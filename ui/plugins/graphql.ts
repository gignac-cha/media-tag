import { PluginOption } from 'vite';

export const graphql = (): PluginOption => {
  return {
    name: 'graphql',
    enforce: 'pre',
    transform(code: string, id: string): Nullable<string> {
      if (id.endsWith('.graphql')) {
        return `export const value = \`${code}\`;export default value;`;
      }
    },
  };
};
