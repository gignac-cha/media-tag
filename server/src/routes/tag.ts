import { SocketStream } from '@fastify/websocket';
import { FastifyInstance } from 'fastify';
import { RawData } from 'ws';

export const routeTag = async (instance: FastifyInstance): Promise<void> => {
  instance.get('/tag', { websocket: true }, (connection: SocketStream) => {
    connection.socket.on('message', (data: RawData, isBinary: boolean) => {
      const message: ClientMessage = JSON.parse(data.toString());
      if (message.type === 'MEDIA') {
        instance.websocketClients.set(connection.socket, { mediaUUID: message.uuid });
      }
    });
    connection.socket.on('close', (code: number, reason: Buffer) => instance.websocketClients.delete(connection.socket));
    connection.socket.on('error', (err: Error) => console.log('error', { err }));
  });
};
