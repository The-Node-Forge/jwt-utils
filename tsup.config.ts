import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/jwt.ts', 'src/middleware/*.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
    entry: 'src/index.ts',
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '.js' }),
});
