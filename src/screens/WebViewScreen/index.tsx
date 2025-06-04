import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { FC } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import { WebView } from "react-native-webview";

import { RootStackParamList } from "../../types/navigation";

const WebViewScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, "Details">>();
  const { article } = params;

  const handleOpenArticle = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const canOpen = await Linking.canOpenURL(article.url);
      if (canOpen) {
        await Linking.openURL(article.url);
      }
    } catch (error) {
      console.error("Erro ao abrir o link:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={article.title} />
        <Appbar.Action icon="open-in-new" onPress={handleOpenArticle} />
      </Appbar.Header>
      <WebView style={styles.container} source={{ uri: article.url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebViewScreen;
