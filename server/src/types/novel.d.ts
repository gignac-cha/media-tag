declare interface NovelInput extends MediaInput {
  uuid: string;
  user?: UserInput;
}
declare interface NovelOutput {
  uuid: string;
  category: Category;
  title: string;
  subtitle: string;
  creators: Creator[];
  series: Series[];
  publisher: Company;
  publishedAt: Date;
  volume: string;
  page: number;
  ISBN: string;
}
