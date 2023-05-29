import { readFile } from 'fs/promises';

export const resolveGraphQL = () => ({
  name: 'resolve-graphql',
  setup: (build) => {
    build.onLoad({ filter: /^.*\.graphql$/ }, async ({ path }) => ({ contents: `export const value = \`${await readFile(path)}\`;export default value;` }));
  },
});
