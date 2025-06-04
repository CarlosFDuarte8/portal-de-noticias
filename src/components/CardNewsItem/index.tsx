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
import { formatRelativeTime } from "../../utils";
import { styles } from "./style";

type CardNewsItemProps = {
  article: ArticleType;
  onPress: () => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
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
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    article.urlToImage ||
                    "https://via.placeholder.com/400x200?text=Sem+Imagem",
                }}
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
                    isFavorite && styles.favoriteButtonActive,
                  ]}
                  iconColor={isFavorite ? "#fff" : "#94a3b8"}
                />
              </View>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CardNewsItem;
