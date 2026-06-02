import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts", "src/build-index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  shims: true,
});
