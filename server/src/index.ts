import fastifyWebsocket from '@fastify/websocket';
import fastify, { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { loadSchemaFiles } from 'mercurius-codegen';
import { join } from 'path';
import { getResolvers } from './graphql/resolvers';
import { routeTag } from './routes/tag';
import { fastifyConfiguration } from './utilities/configuration';
import { fastifyDataSource } from './utilities/database';
import { fastifyElasticsearch } from './utilities/elasticsearch';
import { fastifyWebSocketClients } from './utilities/webSocketClients';

const server: FastifyInstance = fastify({
  logger: true,
});

fastifyConfiguration(server);
fastifyDataSource(server);

const { schema } = loadSchemaFiles(join(__dirname, 'graphql', '*.graphql'));
server.register(mercurius, { schema, resolvers: getResolvers(server) });

server.register(fastifyElasticsearch);

fastifyWebSocketClients(server);

server.register(fastifyWebsocket);
server.register(routeTag);

server.addHook('onClose', async (instnace: FastifyInstance, done: (err: Error) => void) => {
  console.log('onClose');
  await server.dataSource.destroy();
});

server.listen({ port: 3000 }).then(async () => {
  await server.dataSource.initialize();
});
