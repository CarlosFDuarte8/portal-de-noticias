import { FC } from "react";
import { ArticleType } from "../../types/news";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { IconButton, Surface } from "react-native-paper";

type CardNewsItemProps = {
  article: ArticleType;
  onPress: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
};

const formatRelativeTime = (dateString: string) => {
  const published = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - published.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays >= 1) {
    return published.toLocaleDateString();
  } else if (diffInHours >= 1) {
    return `${diffInHours}h atrás`;
  } else if (diffInMinutes >= 1) {
    return `${diffInMinutes}min atrás`;
  } else {
    return "Agora";
  }
};

const CardNewsItem: FC<CardNewsItemProps> = ({
  article,
  onPress,
  isFavorite,
  onFavoriteToggle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <Surface style={styles.card} elevation={2}>
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={styles.timeText}>
              {article.publishedAt
                ? formatRelativeTime(article.publishedAt)
                : "Data não disponível"}
            </Text>
            <View style={styles.metaDivider} />
            <Text style={styles.authorText} numberOfLines={1}>
              {article.author || "Autor desconhecido"}
            </Text>
            <View style={styles.metaDivider} />
            <Text style={styles.sourceText} numberOfLines={1}>
              {article.source.name}
            </Text>
          </View>
        </View>
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          size={24}
          onPress={onFavoriteToggle}
          style={styles.favoriteContainer}
          iconColor={isFavorite ? "#FF4081" : "rgba(0, 0, 0, 0.6)"}
        />
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  favoriteContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    flexWrap: "wrap",
  },
  timeText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  authorText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  sourceText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
});

export default CardNewsItem;
