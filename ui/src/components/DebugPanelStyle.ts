import { css } from '@emotion/css';

export const styles = {
  debug: css({
    padding: '1rem',
    backgroundColor: '#333',
    borderRadius: '1rem',
    color: 'white',
    '@media (prefers-color-scheme: dark)': {
      backgroundColor: 'white',
      color: 'black',
    },
    overflow: 'scroll',
  }),
};
