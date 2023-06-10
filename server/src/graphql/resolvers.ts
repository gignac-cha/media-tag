import { FastifyInstance } from 'fastify';
import { IResolvers } from 'mercurius';
import WebSocket from 'ws';
import { Novel } from '../models/novel';
import { getMyTags, getTagCount, getTagCounts, increaseTag } from '../queries/tags';

export const getResolvers = (instance: FastifyInstance): IResolvers => ({
  Query: {
    novels: async (): Promise<Novel[]> => instance.dataSource.getRepository(Novel).find(),
    novel: async (_, { uuid, user }: NovelInput): Promise<Nullable<NovelOutput>> => {
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
      const tags: Tag[] = await getMyTags(instance, tagCounts, novel, user);
      return { ...novel, tags };
    },
  },
  Mutation: {
    tag: async (_, { tag, media, user }: IncreaseTagInput): Promise<Nullable<Tag>> => {
      await increaseTag(instance, tag, media, user);
      const tagCount: Nullable<TagCount> = await getTagCount(instance, media, tag);
      if (!tagCount) {
        return;
      }
      instance.websocketServer.clients.forEach((client: WebSocket) => {
        if (instance.websocketClients.get(client)?.mediaUUID === media.uuid) {
          const message: TagServerMessage = { tag: tagCount };
          client.send(JSON.stringify(message));
        }
      });
      return tagCount;
    },
    test: async (): Promise<boolean> => {
      instance.websocketServer.clients.forEach((client: WebSocket) => {
        client.send(JSON.stringify({ test: 'test' }));
      });
      return true;
    },
  },
});
