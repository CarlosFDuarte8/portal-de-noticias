import { ArticleType } from './news';

export type RootStackParamList = {
  BottomTabNavigator: undefined;
  Home: undefined;
  Details: {
    article: ArticleType;
  };
  Favorites: undefined;
};
