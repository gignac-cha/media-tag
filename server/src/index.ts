import fastify, { FastifyInstance } from 'fastify';

const server: FastifyInstance = fastify({
  logger: true,
});

server.listen({ port: 3000 });
