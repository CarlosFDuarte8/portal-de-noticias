import { FC, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const Home: FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [news, setNews] = useState<ArticleType[]>([]);
  const [searchQuery, setSearchQuery] = useState("brasil");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_SIZE = 20; // Reduzindo para 20 itens por página

  const loadNews = useCallback(async (refresh = false) => {
    if (loading || (!refresh && !hasMorePages)) return;

    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      // Pegando notícias dos últimos 7 dias para ter mais resultados
      const fromDate = format(new Date(today.setDate(today.getDate() - 7)), "yyyy-MM-dd");

      const response = await getNews(
        searchQuery,
        fromDate,
        "publishedAt",
        refresh ? 1 : page,
        PAGE_SIZE
      );

      const totalPages = Math.ceil(response.totalResults / PAGE_SIZE);
      setHasMorePages(page < Math.min(5, totalPages)); // Limitando a 5 páginas (100 resultados)
      
      if (refresh) {
        setNews(response.articles);
        setPage(1);
      } else {
        setNews((prev) => [...prev, ...response.articles]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar notícias"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, page, loading]);

  useEffect(() => {
    loadNews(true);
  }, [searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNews(true);
  }, [loadNews]);

  const renderNewsItem = ({ item }: { item: ArticleType }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => navigation.navigate("Details", { article: item })}
    >
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsSource}>
          {item.source.name} •{" "}
          {format(
            new Date(item.publishedAt),
            "dd 'de' MMMM 'de' yyyy",
            { locale: ptBR }
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prev) => prev + 1);
      loadNews();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notícias..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadNews(true)}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loader}
              />
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
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  searchInput: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
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
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#0000ff",
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Home;
