import { AggregationsRangeBucketKeys, AggregationsTermsAggregateBase, SearchHit, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import dayjs, { Dayjs } from 'dayjs';
import { FastifyInstance } from 'fastify';
import { MediaInput, TagAction, TagInput, TagOutput, UserInput } from '../../../types/graphql/generated';

interface TagDocument {
  mediaUUID: string;
  userUUID: string;
  value: string;
  action: TagAction;
  createdAt: string;
}

export const getTagCounts = async (instance: FastifyInstance, media: MediaInput): Promise<Nullable<TagCount[]>> => {
  const searchResponse: SearchResponse<TagDocument> = await instance.elasticsearchClient.search<TagDocument>({
    index: 'tags-*',
    query: { term: { 'mediaUUID.keyword': media.uuid } },
    sort: [{ createdAt: { order: 'asc' } }],
    size: 10000,
  });
  const tagCountMap = new Map<string, Set<string>>(
    searchResponse.hits.hits
      .map((value: SearchHit<TagDocument>) => value._source?.value)
      .filter((value?: string): value is string => !!value)
      .map((value: string) => [value, new Set<string>()]),
  );
  for (const value of searchResponse.hits.hits) {
    if (value._source) {
      switch (value._source.action) {
        case TagAction.INCREASE: {
          tagCountMap.get(value._source.value)?.add(value._source.userUUID);
          break;
        }
        case TagAction.DECREASE: {
          tagCountMap.get(value._source.value)?.delete(value._source.userUUID);
          break;
        }
      }
    }
  }
  const tagCounts: TagCount[] = Array.from(tagCountMap.entries())
    .map(([value, set]: [key: string, value: Set<string>]) => ({ value, count: set.size }))
    .sort((a, b) => -(a.count - b.count));
  return tagCounts;
};
export const getTagCount = async (instance: FastifyInstance, media: MediaInput, tag: TagInput): Promise<Nullable<TagCount>> => {
  const searchResponse = await instance.elasticsearchClient.search<TagDocument>({
    index: 'tags-*',
    query: {
      bool: {
        must: [{ term: { 'mediaUUID.keyword': media.uuid } }, { term: { 'value.keyword': tag.value } }],
      },
    },
    sort: [{ createdAt: { order: 'asc' } }],
    size: 10000,
  });
  const set = new Set<string>();
  for (const value of searchResponse.hits.hits) {
    if (value._source) {
      switch (value._source.action) {
        case TagAction.INCREASE: {
          set.add(value._source.userUUID);
          break;
        }
        case TagAction.DECREASE: {
          set.delete(value._source.userUUID);
          break;
        }
      }
    }
  }
  const tagCount: TagCount = { value: tag.value, count: set.size };
  return tagCount;
};
export const getMyTags = async (instance: FastifyInstance, tagCounts: TagCount[], media: MediaInput, user: UserInput): Promise<TagOutput[]> => {
  if (!user) {
    return tagCounts;
  }
  const searchResponse = await instance.elasticsearchClient.search<unknown, { terms: AggregationsTermsAggregateBase<AggregationsRangeBucketKeys> }>({
    index: 'tags-*',
    query: {
      bool: {
        must: [{ match: { 'userUUID.keyword': user.uuid } }, { match: { 'mediaUUID.keyword': media.uuid } }],
        should: tagCounts.map((tagCount: TagCount) => ({ match: { 'value.keyword': tagCount.value } })),
      },
    },
    fields: ['value.keyword'],
    size: tagCounts.length,
    _source: false,
  });
  if (!searchResponse.hits || !Array.isArray(searchResponse.hits.hits)) {
    return tagCounts;
  }
  const myTags: string[] = searchResponse.hits.hits
    .flatMap<string>((searchHit: SearchHit) => (searchHit.fields ? searchHit.fields['value.keyword'] : undefined))
    .filter<string>((value: string): value is string => !!value);
  const tags: TagOutput[] = tagCounts.map((tagCount: TagCount): TagOutput => ({ ...tagCount, active: myTags.includes(tagCount.value) }));
  return tags;
};
const changeTag = async (instance: FastifyInstance, tag: TagInput, media: MediaInput, user: UserInput, action: TagAction) => {
  const now: Dayjs = dayjs();
  const index = `tags-${now.format('YYYY.MM.DD')}`;
  await instance.elasticsearchClient.index({
    index,
    document: {
      mediaUUID: media.uuid,
      userUUID: user.uuid,
      value: tag.value,
      action,
      createdAt: now.toDate(),
    },
    refresh: true,
  });
};
export const increaseTag = async (instance: FastifyInstance, tag: TagInput, media: MediaInput, user: UserInput): Promise<void> => {
  await changeTag(instance, tag, media, user, TagAction.INCREASE);
};
export const decreaseTag = async (instance: FastifyInstance, tag: TagInput, media: MediaInput, user: UserInput): Promise<void> => {
  await changeTag(instance, tag, media, user, TagAction.DECREASE);
};
