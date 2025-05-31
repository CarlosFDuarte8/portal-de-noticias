import { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getNews } from "../../services/news";
import { ArticleType } from "../../types/news";
import { RootStackParamList } from "../../types/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CategoryList } from "../../components/CategoryList";
import { categories } from "../../constants/categories";
import { useFavorites } from "../../contexts/FavoriteContext";
import { Searchbar } from "react-native-paper";
import { CardNewsItem } from "../../components";
import {} from "react-native-screens";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Home: FC = () => {
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
  const PAGE_SIZE = 20;

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
        console.log(`Loading news from ${fromDate} to ${new Date()}...`);
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
          setPage(2); // Preparando para a próxima página
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
    setRefreshing(true);
    loadNews(true);
  }, [loadNews]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
    setHasMorePages(true);
  };

  const renderNewsItem: ListRenderItem<ArticleType> = ({ item, index }) => (
    <CardNewsItem
      key={`index-${index}-${item.url}`}
      article={item}
      onPress={() => navigation.navigate("Details", { article: item })}
      isFavorite={isFavorite(item)}
      onFavoriteToggle={() => {
        if (isFavorite(item)) {
          removeFavorite(item.url);
        } else {
          addFavorite(item);
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        mode="view"
        style={styles.searchInput}
        placeholder="Pesquisar notícias..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          setPage(1);
          setHasMorePages(true);
        }}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.url}
          onEndReached={() => hasMorePages && loadNews()}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() =>
            loading && !refreshing ? (
              <ActivityIndicator style={styles.loader} size="large" />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "transparent",
  },
  newsItem: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  newsImage: {
    width: "100%",
    height: 200,
  },
  newsContent: {
    padding: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  newsSource: {
    fontSize: 12,
    color: "#666",
  },
  loader: {
    marginVertical: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default Home;
