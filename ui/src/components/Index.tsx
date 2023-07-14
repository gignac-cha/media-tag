import { NovelOutput } from '../../../types/graphql/generated';
import { useNovelsQuery } from '../queries/novel';
import { DebugPanel } from './DebugPanel';

export const Index = () => {
  const { data: novelsResponse, error: novelsResponseError, refetch: refetchNovels } = useNovelsQuery();
  return (
    <div>
      <ul>
        {novelsResponse?.novels.map((novel: Nullable<NovelOutput>, index: number) => (
          <li key={index}>
            <a href={`/novels/${novel?.uuid}`}>{novel?.title}</a>
          </li>
        ))}
      </ul>
      <DebugPanel data={{ novelsResponse, novelsResponseError }} />
    </div>
  );
};
