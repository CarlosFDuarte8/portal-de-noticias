import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { FC, useState } from "react";
import {
  Animated,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { useFavorites } from "../../contexts/FavoriteContext";
import { RootStackParamList } from "../../types/navigation";
import { styles } from "./styles";

const Details: FC = () => {
  const { isFavorite, addFavorite, removeFavorite, favorites } = useFavorites();
  const route = useRoute<RouteProp<RootStackParamList, "WebViewScreen">>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { article } = route.params;
  const [scrollY] = useState(new Animated.Value(0));

  const handleShare = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `${article.title}\n\nLeia mais: ${article.url}`,
        url: article.url,
        title: article.title,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={article.source.name} />
        <Appbar.Action icon="share" onPress={handleShare} />
        <Appbar.Action
          icon={(props) => (
            <MaterialIcons
              name={isFavorite(article) ? "favorite" : "favorite-outline"}
              size={20}
              {...props}
              color={colors.error}
            />
          )}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (isFavorite(article)) {
              removeFavorite(article.url);
            } else {
              addFavorite(article);
            }
          }}
        />
      </Appbar.Header>
      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.imageContainer}>
          {article.urlToImage ? (
            <Image
              source={{ uri: article.urlToImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={48} color="#94a3b8" />
            </View>
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.imageGradient}
          />
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>{article.source.name}</Text>
            <View style={styles.divider} />
            <Text style={styles.dateText}>
              {format(new Date(article.publishedAt), "dd MMM yyyy • HH:mm", {
                locale: ptBR,
              })}
            </Text>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          {article.author && (
            <View style={styles.authorContainer}>
              <Feather name="user" size={16} color="#64748b" />
              <Text style={styles.authorText}>{article.author}</Text>
            </View>
          )}

          {article.description && (
            <Text style={styles.description}>{article.description}</Text>
          )}

          {article.content && (
            <Text style={styles.content}>
              {article.content.replace(/\[\+\d+ chars\]/g, "")}
            </Text>
          )}

          <TouchableOpacity
            style={styles.readMoreButton}
            onPress={() => navigation.navigate("WebViewScreen", { article })}
            activeOpacity={0.8}
          >
            <Text style={[styles.readMoreText, {color: colors.secondary}]}>Ler matéria completa</Text>
            <AntDesign name="arrowright" size={18} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};


export default Details;
