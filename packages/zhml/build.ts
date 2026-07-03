import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["src/mod.ts"],
  outdir: "dist",
  splitting: true,
  plugins: [dts()]
});