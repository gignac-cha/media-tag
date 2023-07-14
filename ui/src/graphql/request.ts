interface FetchResponse<T> {
  data: T;
}

export const request = async <T = void>(query: string, variables?: Record<string, unknown>): Promise<T> => {
  const response: Response = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const { data }: FetchResponse<T> = await response.json();
  return data;
};
