import { useQuery } from 'react-query';
import { Query, QuerynovelArgs } from '../../../types/graphql/generated';
import NovelQuery from '../graphql/novel.graphql';
import NovelsQuery from '../graphql/novels.graphql';
import { request } from '../graphql/request';

export const useNovelsQuery = () => useQuery<Query>(['novels'], () => request<Query>(NovelsQuery));
export const useNovelQuery = ({ uuid, user }: QuerynovelArgs) => useQuery<Query>(['novel', uuid, user?.uuid], () => request<Query>(NovelQuery, { uuid, user }));
