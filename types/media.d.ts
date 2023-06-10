declare interface Media {
  uuid: string;
  category: Category;
  title: string;
  subtitle: string;
  creators: Creator[];
  series: Series[];
  publisher: Company;
  publishedAt: Date;
}

declare interface MediaInput {
  uuid: string;
  user?: UserInput;
}
