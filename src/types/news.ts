export type ArticleType = {
  source: SourceType;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};
export type SourceType = {
  id: string | null;
  name: string;
};
export type NewsResponse = {
  status: string;
  totalResults: number;
  articles: ArticleType[];
};
