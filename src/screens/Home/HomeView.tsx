import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { FC, useCallback, useMemo } from "react";
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
  flatListRef,
  handleCategorySelect,
  handleSearchSubmit,
  hasMorePages,
  headerTranslateY,
  isFavorite,
  isScrolledDown,
  loadNews,
  loading,
  navigation,
  news,
  onRefresh,
  refreshing,
  removeFavorite,
  scrollToTop,
  scrollY,
  searchQuery,
  selectedCategory,
  setSearchQuery,
}) => {
  const renderNewsItem: ListRenderItem<ArticleType> = useCallback(
    ({ item, index }) => {
      const handlePress = () =>
        navigation.navigate("Details", { article: item });
      const handleFavoriteToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isFavorite(item)) {
          removeFavorite(item.url);
        } else {
          addFavorite(item);
        }
      };

      return (
        <CardNewsItem
          article={item}
          onPress={handlePress}
          isFavorite={isFavorite(item)}
          onFavoriteToggle={handleFavoriteToggle}
        />
      );
    },
    [navigation, isFavorite, removeFavorite, addFavorite]
  );

  const AnimatedFlatList = useMemo(
    () => Animated.createAnimatedComponent(FlatList<ArticleType>),
    []
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor="#3b82f6"
      />
    ),
    [refreshing, onRefresh]
  );

  const listEmptyComponent = useMemo(
    () =>
      !loading ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
        </View>
      ) : null,
    [loading]
  );

  const listFooterComponent = useMemo(
    () =>
      loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} size="large" color="#3b82f6" />
      ) : null,
    [loading, refreshing]
  );

  const handleRetry = useCallback(() => loadNews(), [loadNews]);

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
        />

        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </Animated.View>

      {/* Botão Scroll to Top - Aparece com fade do centro */}
      <Animated.View
        style={[
          styles.scrollToTopButton,
          {
            opacity: isScrolledDown,
            transform: [
              {
                scale: isScrolledDown.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.scrollToTopButtonInner}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <View />
          <Text style={styles.scrollToTopText}>Voltar ao início</Text>
          <MaterialIcons
            name="keyboard-arrow-up"
            size={18}
            style={styles.scrollToTopIcon}
          />
        </TouchableOpacity>
      </Animated.View>

      {error ? (
        <Animated.View
          style={[
            styles.errorContainer,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.listContainer,
            { transform: [{ translateY: headerTranslateY }] },
          ]}
        >
          <AnimatedFlatList
            ref={flatListRef}
            data={news}
            renderItem={renderNewsItem}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            onEndReached={() => hasMorePages && loadNews()}
            onEndReachedThreshold={0.3}
            refreshControl={refreshControl}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={listFooterComponent}
            contentContainerStyle={styles.listContent}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeView;
