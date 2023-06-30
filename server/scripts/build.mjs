import { build } from 'esbuild';
import { resolveDecoratorWithTSC } from '../plugins/resolveDecoratorWithTSC.mjs';
import { resolveGraphQL } from '../plugins/resolveGraphQL.mjs';

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
