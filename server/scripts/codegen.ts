import fastify, { FastifyInstance } from 'fastify';
import mercurius from 'mercurius';
import codegenMercurius, { loadSchemaFiles } from 'mercurius-codegen';
import { resolve } from 'path';

const server: FastifyInstance = fastify({
  logger: true,
});
const { schema } = loadSchemaFiles(resolve(__dirname, '..', 'src', 'graphql', '*.graphql'));
server.register(mercurius, { schema });
codegenMercurius(server, {
  codegenConfig: { scalars: { DateTime: 'Date' } },
  targetPath: resolve(__dirname, '..', '..', 'types', 'graphql', 'generated.ts'),
  outputSchema: true,
});
