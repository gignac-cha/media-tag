declare interface MediaClientMessage {
  type: 'MEDIA';
  uuid: string;
}
declare interface TestClientMessage {
  type: 'TEST';
  uuid: string;
}

declare interface TagServerMessage {
  tag: Tag;
}

declare type ClientMessage = MediaClientMessage | TestClientMessage;
