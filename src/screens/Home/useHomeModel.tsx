import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Animated } from "react-native";
import { categories } from "../../constants/categories";
import { useFavorites } from "../../contexts/FavoriteContext";
import { getNews } from "../../services/news";
import { RootStackParamList } from "../../types/navigation";
import { ArticleType } from "../../types/news";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const useHomeModel = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();

  const [news, setNews] = useState<ArticleType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [scrollY] = useState(new Animated.Value(0));
  const loadNewsRef = useRef<(refresh?: boolean) => Promise<void>>();
  const flatListRef = useRef<any>(null);
  const PAGE_SIZE = 20;

  const headerTranslateY = useMemo(() => 
    scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, -50],
      extrapolate: "clamp",
    }), [scrollY]
  );

  const getSearchQuery = useCallback(() => {
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return searchQuery;

    if (searchQuery && category.id !== "all") {
      return `${category.query} ${searchQuery}`;
    }

    return category.id === "all" ? searchQuery || "brasil" : category.query;
  }, [selectedCategory, searchQuery]);

  const loadNews = useCallback(
    async (refresh = false) => {
      if (loading || (!refresh && !hasMorePages)) return;

      try {
        setLoading(true);
        setError(null);
        const today = new Date();
        const fromDate = format(
          new Date(today.setDate(today.getDate() - 7)),
          "yyyy-MM-dd"
        );

        const currentQuery = getSearchQuery();
        const response = await getNews(
          currentQuery,
          fromDate,
          "publishedAt",
          refresh ? 1 : page,
          PAGE_SIZE
        );

        const totalPages = Math.ceil(response.totalResults / PAGE_SIZE);
        setHasMorePages((refresh ? 2 : page + 1) < Math.min(5, totalPages));

        if (refresh) {
          setNews(response.articles);
          setPage(2);
        } else {
          setNews((prev) => [...prev, ...response.articles]);
          setPage((prev) => prev + 1);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar notícias"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getSearchQuery, page, loading, hasMorePages]
  );

  // Store reference for external calls
  loadNewsRef.current = loadNews;

  useEffect(() => {
    loadNews(true);
  }, [searchQuery, selectedCategory]);

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    loadNewsRef.current?.(true);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
    setPage(1);
    setHasMorePages(true);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadNewsRef.current?.(true);
  }, []);

  const loadMoreNews = useCallback(() => {
    if (hasMorePages) {
      loadNewsRef.current?.(false);
    }
  }, [hasMorePages]);

  const scrollToTop = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  const isScrolledDown = useMemo(() => 
    scrollY.interpolate({
      inputRange: [0, 150, 200], // Só aparece depois de rolar 150px
      outputRange: [0, 0, 1],    // Mantém 0 até 150px, depois vai para 1
      extrapolate: "clamp",
    }), [scrollY]
  );

  return {
    navigation,
    news,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    loading,
    refreshing,
    error,
    hasMorePages,
    scrollY,
    headerTranslateY,
    isScrolledDown,
    flatListRef,
    scrollToTop,
    loadNews: loadMoreNews,
    onRefresh,
    handleCategorySelect,
    handleSearchSubmit,
    addFavorite,
    isFavorite,
    removeFavorite,
  };
};

export default useHomeModel;
