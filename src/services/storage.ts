import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsResponse } from '../types/news';

const STORAGE_KEY_PREFIX = '@portal-noticias:news';
const LAST_UPDATE_KEY = '@portal-noticias:last-update';
const MAX_DAYS_TO_STORE = 7;

interface StoredNewsData {
  query: string;
  date: string;
  news: NewsResponse;
}

export const saveNewsLocally = async (news: NewsResponse, query: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const newData: StoredNewsData = {
      query,
      date: today,
      news,
    };

    // Obter todas as chaves existentes
    const keys = await AsyncStorage.getAllKeys();
    const newsKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));

    // Remover notícias mais antigas que 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - MAX_DAYS_TO_STORE);

    for (const key of newsKeys) {
      const storedData = await AsyncStorage.getItem(key);
      if (storedData) {
        const data: StoredNewsData = JSON.parse(storedData);
        const newsDate = new Date(data.date);
        if (newsDate < sevenDaysAgo) {
          await AsyncStorage.removeItem(key);
        }
      }
    }

    // Salvar as novas notícias
    const storageKey = `${STORAGE_KEY_PREFIX}:${query}:${today}`;
    await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
    await AsyncStorage.setItem(LAST_UPDATE_KEY, today);
  } catch (error) {
    console.error('Erro ao salvar notícias localmente:', error);
    throw error;
  }
};

export const getLocalNews = async (query: string): Promise<NewsResponse | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `${STORAGE_KEY_PREFIX}:${query}:${today}`;
    
    const jsonValue = await AsyncStorage.getItem(storageKey);
    if (jsonValue) {
      const data: StoredNewsData = JSON.parse(jsonValue);
      return data.news;
    }

    // Se não encontrar notícias de hoje, procura nos últimos 7 dias
    const keys = await AsyncStorage.getAllKeys();
    const relevantKeys = keys.filter(key => key.startsWith(`${STORAGE_KEY_PREFIX}:${query}:`));
    
    if (relevantKeys.length > 0) {
      // Pega as notícias mais recentes para esta query
      const latestKey = relevantKeys.sort().reverse()[0];
      const latestData = await AsyncStorage.getItem(latestKey);
      if (latestData) {
        return JSON.parse(latestData).news;
      }
    }

    return null;
  } catch (error) {
    console.error('Erro ao recuperar notícias locais:', error);
    throw error;
  }
};

export const getAllLocalNews = async (): Promise<StoredNewsData[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const newsKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    
    const allNews: StoredNewsData[] = [];
    for (const key of newsKeys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue) {
        allNews.push(JSON.parse(jsonValue));
      }
    }

    return allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Erro ao recuperar todas as notícias locais:', error);
    throw error;
  }
};

export const clearLocalNews = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const newsKeys = keys.filter(key => key.startsWith(STORAGE_KEY_PREFIX));
    await AsyncStorage.multiRemove(newsKeys);
    await AsyncStorage.removeItem(LAST_UPDATE_KEY);
  } catch (error) {
    console.error('Erro ao limpar notícias locais:', error);
    throw error;
  }
};
