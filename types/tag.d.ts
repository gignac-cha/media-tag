declare interface Tag {
  value: string;
  count: number;
  active?: boolean;
}

declare type TagInput = Pick<Tag, 'value'>;

declare interface IncreaseTagInput {
  tag: TagInput;
  media: MediaInput;
  user: UserInput;
}
