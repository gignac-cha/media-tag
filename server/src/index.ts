import fastifyWebsocket from '@fastify/websocket';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import mercurius from 'mercurius';
import { loadSchemaFiles } from 'mercurius-codegen';
import { join, resolve } from 'path';
import { getResolvers } from './graphql/resolvers';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { FastifyPluginOptions } from 'fastify';
import { readFile } from 'fs/promises';
import { routeTag } from './routes/tag';
import { fastifyConfiguration } from './utilities/configuration';
import { fastifyDataSource } from './utilities/database';
import { fastifyElasticsearch } from './utilities/elasticsearch';
import { fastifyWebSocketClients } from './utilities/webSocketClients';

const server: FastifyInstance = fastify({
  logger: true,
});

server.register(fastifyCors);

server.register(fastifyStatic, { root: resolve(__dirname, '..', 'static'), redirect: true });
server.register((instance: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error | undefined) => void) => {
  const routeStatic = async (request: FastifyRequest, reply: FastifyReply) => {
    const buffer: Buffer = await readFile(resolve(__dirname, '..', 'static', 'index.html'));
    reply.header('Content-Type', 'text/html');
    reply.send(buffer);
  };
  instance.get('/novels', routeStatic);
  instance.get('/novels/*', routeStatic);
  done();
});

server.addHook('onClose', async (instnace: FastifyInstance, done: (err: Error) => void) => {
  console.log('onClose');
  await server.dataSource.destroy();
});

Promise.resolve().then(async () => {
  await fastifyConfiguration(server);
  fastifyDataSource(server);
  await server.dataSource.initialize();

  const { schema } = loadSchemaFiles(join(__dirname, 'graphql', '*.graphql'));
  server.register(mercurius, { schema, resolvers: getResolvers(server) });

  fastifyElasticsearch(server);

  fastifyWebSocketClients(server);

  server.register(fastifyWebsocket);
  server.register(routeTag);

  await server.listen({ port: 3000 });
});
