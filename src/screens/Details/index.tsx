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
      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
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
  image: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metadata: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Details;
