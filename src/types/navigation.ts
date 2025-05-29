import { ArticleType } from './news';

export type RootStackParamList = {
  Home: undefined;
  Details: {
    article: ArticleType;
  };
};
