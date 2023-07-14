declare interface TagServerMessage {
  type: 'TAG';
  tag: {
    // TODO: fix here
    value: string;
    count: number;
    active?: boolean;
  };
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
