import { useRoute, useNavigation } from "@react-navigation/native";
import { FC, useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  View,
} from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArticleType } from "../../types/news";

const Details: FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { article } = route.params as { article: ArticleType };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: article.source.name,
    });
  }, [navigation, article]);

  const handleOpenArticle = async () => {
    try {
      const canOpen = await Linking.canOpenURL(article.url);
      if (canOpen) {
        await Linking.openURL(article.url);
      }
    } catch (error) {
      console.error('Erro ao abrir o link:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {article.urlToImage && (
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.metadata}>
          {article.author ? `Por ${article.author} • ` : ''}
          {format(new Date(article.publishedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </Text>
        
        {article.description && (
          <Text style={styles.description}>{article.description}</Text>
        )}
        
        {article.content && (
          <Text style={styles.articleContent}>{article.content}</Text>
        )}

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleOpenArticle}
        >
          <Text style={styles.linkButtonText}>Ler artigo completo no site original</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1a1a1a',
    lineHeight: 34,
  },
  metadata: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
    color: '#333',
    fontWeight: '500',
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 30,
    color: '#444',
  },
  linkButton: {
    backgroundColor: '#2962ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Details;
