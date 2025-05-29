import api from "./index";
import { NewsResponse } from "../types/news";

const API_KEY = "209cf92bfe074e75ad2a089d95277f3b"; // 🔐 Recomendo colocar em .env futuramente

export const getNews = async (
  query: string = "tesla",
  from: string = "2025-04-28",
  sortBy: string = "publishedAt",
  page: number = 1,
  pageSize: number = 10
): Promise<NewsResponse> => {
  try {
    const response = await api.get<NewsResponse, NewsResponse>("/everything", {
      params: {
        q: query,
        from,
        sortBy,
        page,
        pageSize,
        language: "pt",
        apiKey: API_KEY,
      },
    });

    console.log("Notícias recebidas:", response.status);

    return response;
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    throw error;
  }
};
