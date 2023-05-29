import { readFile } from 'fs/promises';
import { resolve } from 'path';
import typescript from 'typescript';

export const resolveDecoratorWithTSC = () => ({
  name: 'resolve-decorator-with-tsc',
  setup: (build) => {
    const compilerOptions = typescript.parseJsonConfigFileContent(
      typescript.readConfigFile(typescript.findConfigFile(resolve(), typescript.sys.fileExists), typescript.sys.readFile).config,
      typescript.sys,
      resolve(),
    ).options;
    build.onLoad({ filter: /^.*\.ts$/ }, async ({ path }) => {
      const contents = await readFile(path, { encoding: 'utf-8' });
      if (/\s+@\w+\(/g.test(contents)) {
        return { contents: typescript.transpileModule(contents, { compilerOptions }).outputText };
      }
    });
  },
});
