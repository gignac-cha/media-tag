import fastify, { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import { getResolvers } from './graphql/resolvers';
import { schema } from './graphql/schema';
import { fastifyConfiguration } from './utilities/configuration';
import { fastifyDataSource } from './utilities/database';

const server: FastifyInstance = fastify({
  logger: true,
});

fastifyConfiguration(server);
fastifyDataSource(server);

server.register(mercurius, { schema, resolvers: getResolvers(server) });

server.addHook('onClose', async (instnace: FastifyInstance, done: (err: Error) => void) => {
  console.log('onClose');
  await server.dataSource.destroy();
});

server.listen({ port: 3000 }).then(async () => {
  await server.dataSource.initialize();
});
