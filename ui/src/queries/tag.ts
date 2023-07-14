import { useMutation } from 'react-query';
import { DecreaseTagInput, IncreaseTagInput } from '../../../types/graphql/generated';
import DecreaseTagMutation from '../graphql/decreaseTag.graphql';
import IncreaseTagMutation from '../graphql/increaseTag.graphql';
import { request } from '../graphql/request';

export const useIncreaseTagMutation = () =>
  useMutation(['increaseTag'], ({ tag, media, user }: IncreaseTagInput) => request(IncreaseTagMutation, { tag, media, user }));
export const useDecreaseTagMutation = () =>
  useMutation(['decreaseTag'], ({ tag, media, user }: DecreaseTagInput) => request(DecreaseTagMutation, { tag, media, user }));
