import React, { createContext, useContext, useState, useEffect } from "react";
import { ArticleType } from "../types/news";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "@portal-noticias:favorites";

/**
 * Gera um ID único para o artigo, utilizando o ID existente ou a URL.
 * @param article O artigo para o qual gerar o ID.
 * @returns O ID do artigo.
 */
const generateArticleId = (article: ArticleType): string => {
  if (article.id) {
    return article.id;
  }

  return article.url;
};

interface FavoriteContextData {
  favorites: ArticleType[];
  addFavorite: (article: ArticleType) => Promise<void>;
  clearFavorites: () => Promise<void>;
  removeFavorite: (articleId: string) => Promise<void>;
  isFavorite: (article: ArticleType) => boolean;
  loadFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextData>(
  {} as FavoriteContextData
);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<ArticleType[]>([]);

  const loadFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (jsonValue) {
        setFavorites(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (article: ArticleType) => {
    const articleId = generateArticleId(article);
    if (!isFavorite(article)) {
      const articleWithId = { ...article, id: articleId };
      const updatedFavorites = [...favorites, articleWithId];
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      );
    }
  };

  const removeFavorite = async (articleId: string) => {
    const updatedFavorites = favorites.filter(
      (article) => generateArticleId(article) !== articleId
    );
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = (article: ArticleType) => {
    const articleId = generateArticleId(article);
    return favorites.some((fav) => generateArticleId(fav) === articleId);
  };

  const clearFavorites = async () => {
    setFavorites([]);
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        clearFavorites,
        removeFavorite,
        isFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
export const useFavorites = () => useContext(FavoriteContext);
