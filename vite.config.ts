import { join } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "$": join(process.cwd(), "src")
    }
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: "import { h, Fragment } from 'reactfree-jsx';"
  }
});