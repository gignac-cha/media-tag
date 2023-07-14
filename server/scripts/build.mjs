import { build } from 'esbuild';
import { resolveDecoratorWithTSC } from '../plugins/resolveDecoratorWithTSC.mjs';
import { resolveGraphQL } from '../plugins/resolveGraphQL.mjs';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

if (!existsSync('dist/graphql')) {
  mkdirSync('dist/graphql', { recursive: true });
}
const files = readdirSync('src/graphql');
files.filter((file) => file.endsWith('.graphql')).map((file) => copyFileSync(join('src/graphql', file), join('dist/graphql', file)));

build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'node18',
  bundle: true,
  minify: true,
  external: ['mercurius-codegen'],
  plugins: [resolveGraphQL(), resolveDecoratorWithTSC()],
});
