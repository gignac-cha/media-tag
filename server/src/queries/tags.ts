import { AggregationsRangeBucketKeys, AggregationsTermsAggregateBase, AggregationsValueCountAggregate, SearchHit } from '@elastic/elasticsearch/lib/api/types';
import dayjs, { Dayjs } from 'dayjs';
import { Media } from '../models/media';
import { TagAction } from '../models/types';
import { FastifyInstance } from 'fastify';

export const getTagCounts = async (instance: FastifyInstance, media: MediaInput): Promise<Nullable<TagCount[]>> => {
  const termsAggregationsName = 'aggs:terms:value';
  const valueCountAggregationsName = 'aggs:value_count:value';
  const searchResponse = await instance.elasticsearchClient.search<
    unknown,
    { [termsAggregationsName]: AggregationsTermsAggregateBase<AggregationsRangeBucketKeys> }
  >({
    index: 'tags-*',
    query: {
      term: {
        'mediaUUID.keyword': media.uuid,
      },
    },
    aggs: {
      [termsAggregationsName]: {
        aggs: {
          [valueCountAggregationsName]: {
            value_count: {
              field: 'value.keyword',
            },
          },
        },
        terms: {
          field: 'value.keyword',
          order: {
            [valueCountAggregationsName]: 'desc',
          },
          size: 10,
        },
      },
    },
    size: 0,
  });
  if (!searchResponse.aggregations || !Array.isArray(searchResponse.aggregations[termsAggregationsName].buckets)) {
    return;
  }
  const tagCounts: TagCount[] = searchResponse.aggregations[termsAggregationsName].buckets
    .map<TagCount | undefined>((bucket: AggregationsRangeBucketKeys) => (bucket.key ? { value: bucket.key, count: bucket.doc_count } : undefined))
    .filter<TagCount>((tagCount?: TagCount): tagCount is TagCount => !!tagCount);
  if (searchResponse.aggregations[termsAggregationsName].sum_other_doc_count) {
    tagCounts.push({ value: '그 외', count: searchResponse.aggregations[termsAggregationsName].sum_other_doc_count });
  }
  return tagCounts;
};
export const getTagCount = async (instance: FastifyInstance, media: MediaInput, tag: TagInput): Promise<Nullable<TagCount>> => {
  const valueCountAggregationsName = 'aggs:value_count:value';
  const searchResponse = await instance.elasticsearchClient.search<unknown, { [valueCountAggregationsName]: AggregationsValueCountAggregate }>({
    index: 'tags-*',
    query: {
      bool: {
        must: [{ match: { 'mediaUUID.keyword': media.uuid } }, { match: { 'value.keyword': tag.value } }],
      },
    },
    aggs: {
      [valueCountAggregationsName]: {
        value_count: {
          field: 'value.keyword',
        },
      },
    },
  });
  if (!searchResponse.aggregations || typeof searchResponse.aggregations[valueCountAggregationsName].value !== 'number') {
    return;
  }
  const tagCount: TagCount = {
    value: tag.value,
    count: searchResponse.aggregations[valueCountAggregationsName].value,
  };
  return tagCount;
};
export const getMyTags = async (instance: FastifyInstance, tagCounts: TagCount[], media: Media, user?: UserInput): Promise<Tag[]> => {
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
  const tags: Tag[] = tagCounts.map((tagCount: TagCount): Tag => ({ ...tagCount, active: myTags.includes(tagCount.value) }));
  return tags;
};
export const increaseTag = async (instance: FastifyInstance, tag: TagInput, media: MediaInput, user: UserInput): Promise<void> => {
  const now: Dayjs = dayjs();
  const index = `tags-${now.format('YYYY.MM.DD')}`;
  await instance.elasticsearchClient.index({
    index,
    document: {
      mediaUUID: media.uuid,
      userUUID: user.uuid,
      value: tag.value,
      action: TagAction.INCREASE,
      createdAt: now.toDate(),
    },
    refresh: true,
  });
};
