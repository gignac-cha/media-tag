import { useEffect, useMemo, useState } from 'react';

export const useClient = () => {
  const [client, setClient] = useState<WebSocket>();
  const [connectedAt, setConnectedAt] = useState(Date.now());
  const origin = useMemo(() => location.origin, []);
  useEffect(() => {
    const url = new URL(origin);
    url.protocol = 'ws';
    url.port = '3000';
    url.pathname = '/tag';
    url.searchParams.set('t', `${connectedAt}`);
    const client = new WebSocket(url.toString());
    client.addEventListener('open', (event: Event) => {
      console.log('open', { event });
    });
    // client.addEventListener('message', (event) => {
    //   console.log('message', { event });
    // });
    client.addEventListener('close', (event: CloseEvent) => {
      console.log('close', { event });
      setTimeout(() => setConnectedAt(Date.now()), 1000);
    });
    client.addEventListener('error', (event: Event) => {
      console.log('error', { event });
    });
    setClient(client);
    return () => client.close();
  }, [origin, connectedAt]);
  return client;
};
