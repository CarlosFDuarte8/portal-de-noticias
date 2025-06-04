import { FC } from "react";
import { ArticleType } from "../../types/news";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { IconButton, Surface } from "react-native-paper";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

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

  if (diffInDays > 7) {
    return published.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInDays >= 2) {
    return `${diffInDays} dias atrás`;
  } else if (diffInDays === 1) {
    return "Ontem";
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
  const scaleValue = new Animated.Value(1);
  const opacityValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFavoriteToggle();
    
    if (!isFavorite) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.touchable,
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Surface style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: article.urlToImage || "https://via.placeholder.com/400x200?text=Sem+Imagem" }}
              style={styles.image}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.gradient}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.source.name}</Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {article.title}
            </Text>

            <View style={styles.footer}>
              <View style={styles.metaContainer}>
                <Feather name="clock" size={14} color="#94a3b8" />
                <Text style={styles.timeText}>
                  {article.publishedAt
                    ? formatRelativeTime(article.publishedAt)
                    : "Data não disponível"}
                </Text>
                
                {article.author && (
                  <>
                    <View style={styles.metaDivider} />
                    <Feather name="user" size={14} color="#94a3b8" />
                    <Text style={styles.authorText} numberOfLines={1}>
                      {article.author}
                    </Text>
                  </>
                )}
              </View>

              <IconButton
                icon={isFavorite ? "heart" : "heart-outline"}
                size={20}
                onPress={handleFavoritePress}
                style={[
                  styles.favoriteButton,
                  isFavorite && styles.favoriteButtonActive
                ]}
                iconColor={isFavorite ? "#fff" : "#94a3b8"}
              />
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f1f5f9",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "40%",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "System",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    lineHeight: 24,
    fontFamily: "System",
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
    gap: 8,
  },
  timeText: {
    fontSize: 13,
    color: "#64748b",
    fontFamily: "System",
  },
  authorText: {
    fontSize: 13,
    color: "#64748b",
    maxWidth: 120,
    fontFamily: "System",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
  },
  favoriteButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    margin: 0,
    width: 36,
    height: 36,
  },
  favoriteButtonActive: {
    backgroundColor: "#ef4444",
  },
});

export default CardNewsItem;