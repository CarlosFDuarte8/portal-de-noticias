import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import Toast from "react-native-toast-message";
import { ArticleType } from "../types/news";

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

  const loadFavorites = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (jsonValue) {
        setFavorites(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      Toast.show({
        type: "error",
        text1: "Erro nos Favoritos",
        text2: "Não foi possível carregar seus favoritos.",
      });
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (article: ArticleType) => {
    const articleId = generateArticleId(article);
    setFavorites(currentFavorites => {
      if (currentFavorites.some(fav => generateArticleId(fav) === articleId)) {
        return currentFavorites;
      }
      const articleWithId = { ...article, id: articleId };
      const updatedFavorites = [...currentFavorites, articleWithId];
      
      AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      ).catch(error => {
        console.error("Erro ao salvar favorito:", error);
      });
      
      Toast.show({
        text1: "Artigo adicionado aos favoritos!",
        type: "success",
        visibilityTime: 2000,
      });
      
      return updatedFavorites;
    });
  }, []);

  const removeFavorite = useCallback(async (articleId: string) => {
    setFavorites(currentFavorites => {
      const updatedFavorites = currentFavorites.filter(
        (article) => generateArticleId(article) !== articleId
      );
      
      AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updatedFavorites)
      ).catch(error => {
        console.error("Erro ao remover favorito:", error);
      });
      
      Toast.show({
        text1: "Artigo removido dos favoritos!",
        type: "info",
        visibilityTime: 2000,
      });
      
      return updatedFavorites;
    });
  }, []);

  const isFavorite = useCallback((article: ArticleType) => {
    const articleId = generateArticleId(article);
    return favorites.some((fav) => generateArticleId(fav) === articleId);
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error("Erro ao limpar favoritos:", error);
    }
  }, []);

  const contextValue = useMemo(() => ({
    favorites,
    addFavorite,
    clearFavorites,
    removeFavorite,
    isFavorite,
    loadFavorites,
  }), [favorites, addFavorite, clearFavorites, removeFavorite, isFavorite, loadFavorites]);

  return (
    <FavoriteContext.Provider value={contextValue}>
      {children}
    </FavoriteContext.Provider>
  );
};
export const useFavorites = () => useContext(FavoriteContext);
