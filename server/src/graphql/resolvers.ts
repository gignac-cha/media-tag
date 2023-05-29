import { FastifyInstance } from 'fastify';
import { IResolvers } from 'mercurius';

export const getResolvers = (server: FastifyInstance): IResolvers => ({
  Query: {},
  Mutation: {},
});
