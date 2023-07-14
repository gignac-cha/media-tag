import { useQuery } from 'react-query';
import { Query } from '../../../types/graphql/generated';
import { request } from '../graphql/request';
import UsersQuery from '../graphql/users.graphql';

export const useUsersQuery = () => useQuery<Query>(['users'], () => request<Query>(UsersQuery));
