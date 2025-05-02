import { defineConfig } from 'tsup'
import { fixImportsPlugin } from 'esbuild-fix-imports-plugin'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  clean: true,
  dts: true,
  target: 'node20',
  platform: 'node',
  outDir: 'dist',
  bundle: false,
  treeshake: true,
  // minify: true,
  tsconfig: './prod.tsconfig.json',
  esbuildPlugins: [fixImportsPlugin()],
  sourcemap: true,
  esbuildOptions: (options) => {
    options.banner = { js: '"use strict";' }
  },
  outExtension: ({ format }) => ({ js: format === 'cjs' ? '.cjs' : '' }),
})
