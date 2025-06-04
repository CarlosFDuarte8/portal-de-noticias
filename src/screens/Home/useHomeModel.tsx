import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
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
  const PAGE_SIZE = 20;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

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
        setHasMorePages(page < Math.min(5, totalPages));

        if (refresh) {
          setNews(response.articles);
          setPage(2);
        } else {
          setNews((prev) => [...prev, ...response.articles]);
          setPage(page + 1);
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
    [searchQuery, page, loading, selectedCategory]
  );

  useEffect(() => {
    loadNews(true);
  }, [searchQuery, selectedCategory]);

  const onRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    loadNews(true);
  }, [loadNews]);

  const handleCategorySelect = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(categoryId);
    setPage(1);
    setHasMorePages(true);
  };

  const handleSearchSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadNews(true);
  };

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
    loadNews,
    onRefresh,
    handleCategorySelect,
    handleSearchSubmit,
    addFavorite,
    isFavorite,
    removeFavorite,
  };
};

export default useHomeModel;
