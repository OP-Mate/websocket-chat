export default {
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  clean: true,
  bundle: true,
  external: [],
};
