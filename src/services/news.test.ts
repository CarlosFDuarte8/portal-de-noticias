import { getNews, getAllCachedNews } from "./news";
import api from "./index";
import { saveNewsLocally, getLocalNews, getAllLocalNews } from "./storage";
import NetInfo from "@react-native-community/netinfo";
import { NewsResponse } from "../types/news";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("./index");
jest.mock("./storage");
jest.mock("@react-native-community/netinfo");

// Mock console methods
const consoleSpy = {
  log: jest.spyOn(console, "log").mockImplementation(() => {}),
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

describe("News Service", () => {
  const mockNewsResponse: NewsResponse = {
    status: "ok",
    totalResults: 1,
    articles: [
      {
        source: { id: "1", name: "Test Source" },
        author: "Test Author",
        title: "Test Article",
        description: "Test Description",
        url: "https://test.com",
        urlToImage: "https://test.com/image.jpg",
        publishedAt: "2025-06-12T10:00:00Z",
        content: "Test content",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNews", () => {
    it("deve buscar notícias da API quando estiver online", async () => {
      // Mock online connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

      // Mock API response
      (api.get as jest.Mock).mockResolvedValue(mockNewsResponse);

      // Mock storage save
      (saveNewsLocally as jest.Mock).mockResolvedValue(undefined);

      const result = await getNews("tesla");

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith("/everything", {
        params: expect.objectContaining({
          q: "tesla",
          sortBy: "publishedAt",
          page: 1,
          pageSize: 10,
          language: "pt",
          apiKey: expect.any(String),
        }),
      });
      expect(saveNewsLocally).toHaveBeenCalledWith(mockNewsResponse, "tesla");
      expect(result).toEqual(mockNewsResponse);
    });

    it("deve retornar notícias do cache quando estiver offline", async () => {
      // Mock offline connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

      // Mock cached data
      (getLocalNews as jest.Mock).mockResolvedValue(mockNewsResponse);

      const result = await getNews("tesla");

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(getLocalNews).toHaveBeenCalledWith("tesla");
      expect(api.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockNewsResponse);
    });

    it("deve lançar erro quando offline e sem dados em cache", async () => {
      // Mock offline connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

      // Mock no cached data
      (getLocalNews as jest.Mock).mockResolvedValue(null);

      await expect(getNews("tesla")).rejects.toThrow(
        "Sem conexão e nenhum dado em cache disponível"
      );
    });

    it("deve usar cache quando API falha", async () => {
      // Mock online connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

      // Mock API error
      (api.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      // Mock cached data
      const cachedNews: NewsResponse = {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            source: { id: "1", name: "Cached Source" },
            author: "Cached Author",
            title: "Cached Article",
            description: "Cached Description",
            url: "https://cached.com",
            urlToImage: "https://cached.com/image.jpg",
            publishedAt: "2025-06-12T10:00:00Z",
            content: "Cached content",
          },
        ],
      };
      (getLocalNews as jest.Mock).mockResolvedValue(cachedNews);

      const result = await getNews("test");

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith("/everything", expect.any(Object));
      expect(getLocalNews).toHaveBeenCalledWith("test");
      expect(result).toEqual(cachedNews);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Erro ao buscar da API, tentando cache:",
        expect.any(Error)
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        "Usando dados em cache após falha na API"
      );
    });

    it("deve lançar erro quando API falha e não há cache", async () => {
      // Mock online connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

      // Mock API error
      const apiError = new Error("API Error");
      (api.get as jest.Mock).mockRejectedValue(apiError);

      // Mock no cached data
      (getLocalNews as jest.Mock).mockResolvedValue(null);

      await expect(getNews("tesla")).rejects.toThrow("API Error");
    });

    it("deve retornar notícias do cache quando offline e dados locais estão disponíveis", async () => {
      // Mock offline connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

      // Mock local news data
      const mockLocalNews: NewsResponse = {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            source: { id: "1", name: "Local Source" },
            author: "Local Author",
            title: "Cached Article",
            description: "Cached Description",
            url: "https://cached.com",
            urlToImage: "https://cached.com/image.jpg",
            publishedAt: "2025-06-12T10:00:00Z",
            content: "Cached content",
          },
        ],
      };
      (getLocalNews as jest.Mock).mockResolvedValue(mockLocalNews);

      const result = await getNews("cached");

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(getLocalNews).toHaveBeenCalledWith("cached");
      expect(api.get).not.toHaveBeenCalled();
      expect(result).toEqual(mockLocalNews);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        "Modo offline: Usando dados em cache para:",
        "cached"
      );
    });

    it("deve lançar erro quando offline e não há dados em cache", async () => {
      // Mock offline connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

      // Mock no cached data
      (getLocalNews as jest.Mock).mockResolvedValue(null);

      await expect(getNews("tesla")).rejects.toThrow(
        "Sem conexão e nenhum dado em cache disponível"
      );

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(getLocalNews).toHaveBeenCalledWith("tesla");
      expect(api.get).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it("deve buscar novos dados da API quando online e atualizar o cache local", async () => {
      // Mock online connectivity
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

      // Mock API response
      const mockApiResponse: NewsResponse = {
        status: "ok",
        totalResults: 1,
        articles: [
          {
            source: { id: "1", name: "API Source" },
            author: "API Author",
            title: "API Article",
            description: "API Description",
            url: "https://api.com",
            urlToImage: "https://api.com/image.jpg",
            publishedAt: "2025-06-12T10:00:00Z",
            content: "API content",
          },
        ],
      };
      (api.get as jest.Mock).mockResolvedValue(mockApiResponse);

      // Mock storage save
      (saveNewsLocally as jest.Mock).mockResolvedValue(undefined);

      const result = await getNews("api_test");

      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(api.get).toHaveBeenCalledWith("/everything", {
        params: expect.objectContaining({
          q: "api_test",
          from: expect.any(String),
          sortBy: "publishedAt",
          page: 1,
          pageSize: 10,
          language: "pt",
          apiKey: expect.any(String),
        }),
      });
      expect(saveNewsLocally).toHaveBeenCalledWith(mockApiResponse, "api_test");
      expect(result).toEqual(mockApiResponse);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        "Notícias atualizadas recebidas da API"
      );
    });
  });

  describe("getAllCachedNews", () => {
    it("deve retornar todas as notícias em cache", async () => {
      const mockCachedData = [
        { query: "tesla", news: mockNewsResponse },
        { query: "spacex", news: { ...mockNewsResponse, articles: [] } },
      ];

      (getAllLocalNews as jest.Mock).mockResolvedValue(mockCachedData);

      const result = await getAllCachedNews();

      expect(getAllLocalNews).toHaveBeenCalled();
      expect(result).toEqual([
        mockNewsResponse,
        { ...mockNewsResponse, articles: [] },
      ]);
    });

    it("deve retornar array vazio quando cache falha", async () => {
      (getAllLocalNews as jest.Mock).mockRejectedValue(
        new Error("Cache error")
      );

      const result = await getAllCachedNews();

      expect(result).toEqual([]);
    });
  });
});
