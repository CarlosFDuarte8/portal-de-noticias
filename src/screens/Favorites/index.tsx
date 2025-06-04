import { FC, useEffect, useState, useRef } from "react";
import { 
  Text, 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  TextInput,
  Easing
} from "react-native";
import { useFavorites } from "../../contexts/FavoriteContext";
import { useNavigation } from "@react-navigation/native";
import { CardNewsItem } from "../../components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

const Favorites: FC = () => {
  const { favorites, clearFavorites, isFavorite, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const searchAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const filteredFavorites = favorites.filter(fav => 
    fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fav.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={toggleSearch} 
            style={styles.searchButton}
          >
            <Animated.View style={{
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '90deg']
                })
              }]
            }}>
              <Feather name="search" size={22} color="#6366f1" />
            </Animated.View>
          </TouchableOpacity>
          {favorites.length > 0 && (
            <TouchableOpacity onPress={clearFavorites}>
              <MaterialIcons name="delete-sweep" size={24} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, clearFavorites, favorites]);

  const toggleSearch = () => {
    if (isSearchVisible) {
      setSearchQuery("");
      Animated.parallel([
        Animated.timing(searchAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(searchAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
    setIsSearchVisible(!isSearchVisible);
  };

  const searchWidth = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const searchOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <LinearGradient
      colors={['#f8fafc', '#f1f5f9']}
      style={styles.container}
    >
      <Animated.View style={[styles.searchContainer, {
        width: searchWidth,
        opacity: searchOpacity
      }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar nos favoritos..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery("")}
            style={styles.clearSearchButton}
          >
            <Feather name="x" size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        {filteredFavorites.length > 0 && (
          <Text style={styles.subtitle}>
            {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'itens'}
          </Text>
        )}
      </View>

      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons 
            name={searchQuery ? "search-off" : "bookmark-border"} 
            size={72} 
            color="#cbd5e1" 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>
            {searchQuery 
              ? "Nenhum resultado encontrado" 
              : "Nenhum favorito adicionado"}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? "Tente ajustar sua busca"
              : "Toque no ícone de coração para salvar itens"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.url}
          renderItem={({ item, index }) => (
            <CardNewsItem
              key={`index-${index}-${item.url}`}
              article={item}
              onPress={() => navigation.navigate("Details", { article: item })}
              isFavorite={isFavorite(item)}
              onFavoriteToggle={() => removeFavorite(item.id || item.url)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{ height: 8 }} />}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
    fontFamily: 'sans-serif-condensed',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    opacity: 0.7,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  emptySubtext: {
    fontSize: 15,
    color: '#cbd5e1',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '80%',
  },
  listContent: {
    paddingBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginRight: 12,
  },
  searchButton: {
    padding: 4,
  },
  searchContainer: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0f172a',
    fontFamily: 'sans-serif',
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  trashButton: {
    marginRight: 16,
    padding: 8,
  },
});

export default Favorites;