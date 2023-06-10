declare interface Novel extends Media {
  volume: string;
  page: number;
  ISBN: string;
}

declare type NovelInput = MediaInput;

declare interface NovelOutput extends Novel {
  tags?: Tag[];
}
