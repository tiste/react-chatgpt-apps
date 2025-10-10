import { build } from "esbuild";
import pkg from "../package.json" with { type: "json" };

const external = [
  "react",
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const common = {
  entryPoints: ["src/index.ts"],
  target: "es2020",
  sourcemap: true,
  bundle: true,
  external,
  jsx: "automatic",
};

await Promise.all([
  build({ ...common, format: "esm", outfile: "dist/index.mjs" }),
  build({ ...common, format: "cjs", outfile: "dist/index.cjs" }),
]);

console.log("✓ esbuild OK");
