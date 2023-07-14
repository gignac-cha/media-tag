import { useMutation } from 'react-query';
import { request } from '../graphql/request';
import TestMutation from '../graphql/test.graphql';

export const useTestMutation = () => useMutation(['test'], () => request(TestMutation));
