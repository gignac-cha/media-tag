declare interface TagServerMessage {
  type: 'TAG';
  tag: Tag;
}

declare type ServerMessage = TagServerMessage;

declare interface MediaClientMessage {
  type: 'MEDIA';
  uuid: string;
}
declare interface TestClientMessage {
  type: 'TEST';
  uuid: string;
}

declare type ClientMessage = MediaClientMessage | TestClientMessage;
