import { Category } from '../../../types/graphql/generated';

export const convertCategoryText = (category?: Category): string => {
  switch (category) {
    case Category.NOVEL:
      return '소설';
    case Category.COMIC:
      return '만화';
    case Category.ANIMATION:
      return '애니메이션';
    case Category.DRAMA:
      return '드라마';
    case Category.MOVIE:
      return '영화';
  }
  return '미디어';
};
