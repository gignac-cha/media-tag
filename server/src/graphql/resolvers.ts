import { FastifyInstance } from 'fastify';
import { IResolvers } from 'mercurius';
import WebSocket from 'ws';
import { DecreaseTagInput, IncreaseTagInput, Loaders, NovelOutput, QuerynovelArgs, Resolvers, TagOutput, UserOutput } from '../../../types/graphql/generated';
import { Novel } from '../models/novel';
import { User } from '../models/user';
import { decreaseTag, getMyTags, getTagCount, getTagCounts, increaseTag } from '../queries/tags';

declare module 'mercurius' {
  interface IResolvers extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}

export const getResolvers = (instance: FastifyInstance): IResolvers => ({
  Query: {
    novels: async (): Promise<NovelOutput[]> => {
      const novels: Novel[] = await instance.dataSource.getRepository(Novel).find();
      return novels.map((novel: Novel) => ({ ...novel, tags: [] }));
    },
    novel: async (_, { uuid, user }: QuerynovelArgs): Promise<Nullable<NovelOutput>> => {
      const novel: Nullable<Novel> = await instance.dataSource.getRepository(Novel).findOne({ where: { uuid } });
      if (!novel) {
        return;
      }
      const tagCounts: Nullable<TagCount[]> = await getTagCounts(instance, novel);
      if (!tagCounts) {
        return;
      }
      if (!user) {
        return { ...novel, tags: tagCounts };
      }
      const tags: TagOutput[] = await getMyTags(instance, tagCounts, novel, user);
      return { ...novel, tags };
    },
    users: async (): Promise<UserOutput[]> => instance.dataSource.getRepository(User).find(),
  },
  Mutation: {
    increaseTag: async (_, { tag, media, user }: IncreaseTagInput): Promise<Nullable<TagOutput>> => {
      await increaseTag(instance, tag, media, user);
      const tagCount: Nullable<TagCount> = await getTagCount(instance, media, tag);
      if (!tagCount) {
        return;
      }
      instance.websocketServer.clients.forEach((client: WebSocket) => {
        if (instance.websocketClients.get(client)?.mediaUUID === media.uuid) {
          const message: TagServerMessage = { type: 'TAG', tag: tagCount };
          client.send(JSON.stringify(message));
        }
      });
      return tagCount;
    },
    decreaseTag: async (_, { tag, media, user }: DecreaseTagInput): Promise<Nullable<TagOutput>> => {
      await decreaseTag(instance, tag, media, user);
      const tagCount: Nullable<TagCount> = await getTagCount(instance, media, tag);
      if (!tagCount) {
        return;
      }
      instance.websocketServer.clients.forEach((client: WebSocket) => {
        if (instance.websocketClients.get(client)?.mediaUUID === media.uuid) {
          const message: TagServerMessage = { type: 'TAG', tag: tagCount };
          client.send(JSON.stringify(message));
        }
      });
      return tagCount;
    },
    test: async (): Promise<boolean> => {
      instance.websocketServer.clients.forEach((client: WebSocket) => {
        client.send(JSON.stringify({ type: 'TEST', test: Date.now() }));
      });
      return true;
    },
  },
});
