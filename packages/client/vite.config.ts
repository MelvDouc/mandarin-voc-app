import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "$": join(import.meta.dirname, "src")
    }
  },
  server: {
    host: true
  }
});