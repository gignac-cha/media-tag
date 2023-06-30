import { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';
import { Company } from '../models/company';
import { Creator } from '../models/creator';
import { Novel } from '../models/novel';
import { Series } from '../models/series';
import { User } from '../models/user';

declare module 'fastify' {
  interface FastifyInstance<RawServer, RawRequest, RawReply, Logger, TypeProvider> {
    dataSource: DataSource;
  }
}

export const getDataSource = (instance: FastifyInstance): DataSource =>
  new DataSource({
    ...instance.configuration.postgres,
    entities: [Novel, Creator, Company, Series, User],
  });

export const fastifyDataSource = (instance: FastifyInstance): FastifyInstance => instance.decorate('dataSource', getDataSource(instance));
