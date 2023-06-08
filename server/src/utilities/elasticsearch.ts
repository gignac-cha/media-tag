import { Client } from '@elastic/elasticsearch';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    elasticsearchClient: Client;
  }
}

const getClient = (instance: FastifyInstance): Client => new Client({ ...instance.configuration.elasticsearch });

export const fastifyElasticsearch = (instance: FastifyInstance): FastifyInstance => instance.decorate('elasticsearchClient', getClient(instance));
