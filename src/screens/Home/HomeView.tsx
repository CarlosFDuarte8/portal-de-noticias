import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { FC } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { CardNewsItem } from "../../components";
import { CategoryList } from "../../components/CategoryList";
import { ArticleType } from "../../types/news";
import { styles } from "./styles";
import useHomeModel from "./useHomeModel";

type HomeViewProp = ReturnType<typeof useHomeModel>;

const HomeView: FC<HomeViewProp> = ({
  addFavorite,
  error,
  handleCategorySelect,
  handleSearchSubmit,
  hasMorePages,
  headerTranslateY,
  isFavorite,
  loadNews,
  loading,
  navigation,
  news,
  onRefresh,
  refreshing,
  removeFavorite,
  searchQuery,
  scrollY,
  selectedCategory,
  setSearchQuery,
}) => {
  const renderNewsItem: ListRenderItem<ArticleType> = ({ item, index }) => (
    <CardNewsItem
      key={`index-${index}-${item.url}`}
      article={item}
      onPress={() => navigation.navigate("Details", { article: item })}
      isFavorite={isFavorite(item)}
      onFavoriteToggle={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isFavorite(item)) {
          removeFavorite(item.url);
        } else {
          addFavorite(item);
        }
      }}
    />
  );

  const AnimatedFlatList = Animated.createAnimatedComponent(
    FlatList<ArticleType>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Searchbar
          placeholder="Pesquisar notícias..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          style={styles.searchInput}
          iconColor="#64748b"
          inputStyle={styles.searchInputText}
          elevation={0}
          theme={{
            colors: {
              primary: "#3b82f6",
              background: "#f8fafc",
            },
          }}
        />

        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </Animated.View>

      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadNews(true)}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AnimatedFlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.url}
          onEndReached={() => hasMorePages && loadNews()}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="search-off" size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
              </View>
            ) : null
          }
          ListFooterComponent={() =>
            loading && !refreshing ? (
              <ActivityIndicator
                style={styles.loader}
                size="large"
                color="#3b82f6"
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      )}
    </View>
  );
};

export default HomeView;
