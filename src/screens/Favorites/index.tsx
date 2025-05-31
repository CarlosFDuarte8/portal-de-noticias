import { FC, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import { useFavorites } from "../../contexts/FavoriteContext";
import { useNavigation } from "@react-navigation/native";
import { Appbar } from "react-native-paper";
import { CardNewsItem } from "../../components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Favorites"
>;
const Favorites: FC = () => {
  const { favorites, clearFavorites, isFavorite, removeFavorite } =
    useFavorites();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      // headerTitle: "Meus Favoritos",
      headerRight: () => (
        <Appbar.Action
          icon="trash-can"
          color="#007AFF"
          onPress={() => clearFavorites()}
        />
      ),
    });
  }, [navigation, clearFavorites]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Meus Favoritos
      </Text>
      {favorites.length === 0 ? (
        <Text style={{ fontSize: 16, color: "#666" }}>
          Você ainda não tem favoritos.
        </Text>
      ) : (
        <FlatList
          data={favorites}
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
          ListEmptyComponent={() => (
            <Text style={{ fontSize: 16, color: "#666" }}>
              Nenhum favorito encontrado.
            </Text>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
};

export default Favorites;
