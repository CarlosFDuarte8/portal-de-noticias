import api from "./index";
import { NewsResponse } from "../types/news";
import { saveNewsLocally, getLocalNews, getAllLocalNews } from './storage';
import NetInfo from '@react-native-community/netinfo';

// const API_KEY = "209cf92bfe074e75ad2a089d95277f3b"; // 🔐 Recomendo colocar em .env futuramente
const API_KEY = "ebb1b8ba4fab4302ba26b2b4a92abaf0"; // 🔐 Recomendo colocar em .env futuramente carlos.duarte@inv.net.br

const checkConnectivity = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

export const getNews = async (
  query: string = "tesla",
  from?: string,
  sortBy: string = "publishedAt",
  page: number = 1,
  pageSize: number = 10
): Promise<NewsResponse> => {
  try {
    const isConnected = await checkConnectivity();

    // Se estiver offline, retorna dados do cache imediatamente
    if (!isConnected) {
      const localNews = await getLocalNews(query);
      if (localNews) {
        console.log("Modo offline: Usando dados em cache para:", query);
        return localNews;
      }
      throw new Error("Sem conexão e nenhum dado em cache disponível");
    }

    // Se estiver online, tenta buscar dados novos da API
    try {
      // Usa o parâmetro 'from' se fornecido, senão calcula 7 dias atrás
      const fromDate = from || (() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return sevenDaysAgo.toISOString().split('T')[0];
      })();

      const response = await api.get<NewsResponse, NewsResponse>("/everything", {
        params: {
          q: query,
          from: fromDate,
          sortBy,
          page,
          pageSize,
          language: "pt",
          apiKey: API_KEY,
        },
      });

      console.log("Notícias atualizadas recebidas da API");
      await saveNewsLocally(response, query);
      return response;
    } catch (apiError) {
      console.error("Erro ao buscar da API, tentando cache:", apiError);
      const localNews = await getLocalNews(query);
      if (localNews) {
        console.log("Usando dados em cache após falha na API");
        return localNews;
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    throw error;
  }
};

export const getAllCachedNews = async (): Promise<NewsResponse[]> => {
  try {
    const allNews = await getAllLocalNews();
    return allNews.map(item => item.news);
  } catch (error) {
    console.error("Erro ao buscar notícias em cache:", error);
    return [];
  }
};
