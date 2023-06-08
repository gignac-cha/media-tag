import { ClientOptions } from '@elastic/elasticsearch';
import { FastifyInstance } from 'fastify';
import { readFile } from 'fs/promises';
import { DataSourceOptions } from 'typeorm';

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    configuration: Configuration;
  }
}

type PostgresConfiguration = DataSourceOptions;
type ElasticsearchConfiguration = ClientOptions;
interface Configuration {
  postgres: PostgresConfiguration;
  elasticsearch: ElasticsearchConfiguration;
}

const generateConfigurationFromEnv = async (instance: FastifyInstance): Promise<Configuration> => {
  const postgres: PostgresConfiguration = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: true,
    // entities: [],
    // subscribers: [],
    // migrations: [],
  };
  const elasticsearch: ElasticsearchConfiguration = {
    node: process.env.ELASTICSEARCH_NODE,
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
    tls: {
      ca: await readFile(process.env.ELASTICSEARCH_TLS_CA),
      rejectUnauthorized: false,
    },
  };
  return { postgres, elasticsearch };
};

export const fastifyConfiguration = (instance: FastifyInstance): FastifyInstance => instance.decorate('configuration', generateConfigurationFromEnv(instance));
