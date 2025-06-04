import { ArticleType } from './news';

export type RootStackParamList = {
  BottomTabNavigator: undefined;
  Home: undefined;
  Details: {
    article: ArticleType;
  };
  WebViewScreen: {
    article: ArticleType;
  };
  Favorites: undefined;
};
