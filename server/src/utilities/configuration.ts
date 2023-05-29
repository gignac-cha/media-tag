import { FastifyInstance } from 'fastify';
import { DataSourceOptions } from 'typeorm';

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    configuration: Configuration;
  }
}

type PostgresConfiguration = DataSourceOptions;
interface Configuration {
  postgres: PostgresConfiguration;
}

const generateConfigurationFromEnv = (instance: FastifyInstance): Configuration => {
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
  return { postgres };
};

export const fastifyConfiguration = (instance: FastifyInstance): FastifyInstance => instance.decorate('configuration', generateConfigurationFromEnv(instance));
