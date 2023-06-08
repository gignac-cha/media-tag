import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

interface WebSocketClientAttributes {
  mediaUUID: string;
}

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    websocketClients: Map<WebSocket, WebSocketClientAttributes>;
  }
}

export const fastifyWebSocketClients = (instance: FastifyInstance): FastifyInstance =>
  instance.decorate('websocketClients', new Map<WebSocket, WebSocketClientAttributes>());
