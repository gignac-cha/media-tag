import { FastifyInstance } from 'fastify';
import { IResolvers } from 'mercurius';
import { Novel } from '../models/novel';

export const getResolvers = (instance: FastifyInstance): IResolvers => ({
  Query: {
    novels: async (): Promise<Novel[]> => instance.dataSource.getRepository(Novel).find(),
    novel: async (_, { uuid, user }: NovelInput): Promise<Nullable<NovelOutput>> => {
      return instance.dataSource.getRepository(Novel).findOne({ where: { uuid } });
    },
  },
});
