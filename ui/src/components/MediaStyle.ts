import { css } from '@emotion/css';

export const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1rem',
    margin: 'auto',
    '@media only screen and (width < 640px)': {
      width: '100%',
    },
    '@media only screen and (640px <= width < 800px)': {
      width: '640px',
    },
    '@media only screen and (800px <= width < 960px)': {
      width: '800px',
    },
    '@media only screen and (960px <= width)': {
      width: '960px',
    },
  }),
};
