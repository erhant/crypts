import dts from 'bun-plugin-dts';

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './build',
  target: 'node',
  minify: true,
  plugins: [dts()],
});
