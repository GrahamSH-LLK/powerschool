
import typescript from "@rollup/plugin-typescript";
import url from "@rollup/plugin-url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import css from "rollup-plugin-import-css";
import metablock from "rollup-plugin-userscript-metablock";

export default {
  input: "src/index.ts",

  output: {
    file: "dist/bundle.user.js",
    format: "esm",
    plugins: [
      metablock({
        file: "meta.yml",
      }),
    ],
    
  },

  plugins: [
    typescript(),
    nodeResolve(),
    terser(),
    css(),
    url({
      emitFiles: false,
      limit: 48000,
    }),
  ],
};
