import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/jwt.ts', 'src/middleware/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
});
