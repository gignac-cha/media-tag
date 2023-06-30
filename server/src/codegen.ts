import fastify, { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import codegenMercurius, { loadSchemaFiles } from 'mercurius-codegen';
import { join, resolve } from 'path';

const server: FastifyInstance = fastify({
  logger: true,
});
const { schema } = loadSchemaFiles(join(__dirname, 'graphql', '*.graphql'));
server.register(mercurius, { schema });
codegenMercurius(server, {
  codegenConfig: { scalars: { DateTime: 'Date' } },
  targetPath: resolve(__dirname, '..', '..', 'types', 'graphql', 'generated.ts'),
  outputSchema: true,
});
