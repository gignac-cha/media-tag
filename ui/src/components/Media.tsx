import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Novel } from './Novel';

type MediaParameters = {
  category: 'novels' | 'comics' | 'animations' | 'dramas' | 'movies';
  uuid: string;
};

export const Media = () => {
  const { category, uuid = '' } = useParams<MediaParameters>();
  const component = useMemo(() => {
    switch (category) {
      case 'novels':
        return <Novel uuid={uuid} />;
    }
  }, [category, uuid]);
  return <div>{component}</div>;
};
