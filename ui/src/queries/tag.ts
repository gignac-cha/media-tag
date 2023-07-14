import { useMutation } from 'react-query';
import { IncreaseTagInput } from '../../../types/graphql/generated';
import { request } from '../graphql/request';
import IncreaseTagMutation from '../graphql/increaseTag.graphql';

export const useTagMutation = () => useMutation(['tag'], ({ tag, media, user }: IncreaseTagInput) => request(IncreaseTagMutation, { tag, media, user }));
