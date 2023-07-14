import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Creator, Job, TagOutput, UserOutput } from '../../../types/graphql/generated';
import { useClient } from '../hooks/websocket';
import { useNovelQuery } from '../queries/novel';
import { useIncreaseTagMutation } from '../queries/tag';
import { useTestMutation } from '../queries/test';
import { DebugPanel } from './DebugPanel';
import { styles } from './NovelStyle';

interface NovelProperties {
  uuid: string;
  user?: UserOutput;
}

export const Novel: FunctionComponent<NovelProperties> = ({ uuid, user }) => {
  const { data: novelResponse, error: novelResponseError, refetch: refetchNovel } = useNovelQuery({ uuid, user });
  const { mutate: increaseTagRequest, error: tagRequestError } = useIncreaseTagMutation();
  const writers = useMemo(
    () => novelResponse?.novel?.creators.filter((creator: Nullable<Creator>): creator is Creator => !!creator?.jobs.includes(Job.WRITER)) ?? [],
    [novelResponse?.novel?.creators],
  );
  const painters = useMemo(
    () => novelResponse?.novel?.creators.filter((creator: Nullable<Creator>): creator is Creator => !!creator?.jobs.includes(Job.PAINTER)) ?? [],
    [novelResponse?.novel?.creators],
  );
  const [tags, setTags] = useState<TagOutput[]>([]);
  useEffect(() => setTags(novelResponse?.novel?.tags?.filter((tag: Nullable<TagOutput>): tag is TagOutput => !!tag) ?? []), [novelResponse?.novel?.tags]);
  const websocketCallback = useCallback(
    (event: MessageEvent) => {
      // console.log('message', { event });
      const message: ServerMessage = JSON.parse(event.data);
      switch (message.type) {
        case 'PING': {
          console.log(message);
          break;
        }
        case 'TAG': {
          for (const [index, tag] of tags.entries()) {
            if (tag.value === message.tag.value) {
              tags[index] = { ...tag, count: message.tag.count };
              setTags([...tags]);
              break;
            }
          }
          break;
        }
      }
    },
    [tags],
  );
  const client = useClient();
  useLayoutEffect(() => {
    const callback = () => {
      if (client?.readyState === WebSocket.OPEN) {
        const message: MediaClientMessage = { type: 'MEDIA', uuid };
        client?.send(JSON.stringify(message));
      } else {
        timeoutId = setTimeout(callback, 1000 / 60);
      }
    };
    let timeoutId: NodeJS.Timeout = setTimeout(callback);
    return () => clearTimeout(timeoutId);
  }, [client, uuid]);
  useLayoutEffect(() => {
    client?.addEventListener('message', websocketCallback);
    () => client?.removeEventListener('message', websocketCallback);
  }, [client, websocketCallback]);
  const { mutate: testRequest, error: testRequestError } = useTestMutation();
  return (
    <div className={styles.container}>
      <button onClick={() => testRequest()}>Test</button>
      <div>
        {tags.map((tag: TagOutput, index: number) => (
          <button key={index} onClick={user ? () => increaseTagRequest({ tag, media: { uuid }, user }) : undefined}>
            {tag.value} {tag.count}
          </button>
        ))}
      </div>
      <DebugPanel data={{ novelResponse, writers, painters, tags }} />
    </div>
  );
};
