import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(rootDir, "index.html"),
        ideas: resolve(rootDir, "content/ideas/index.html"),
        ideasPost: resolve(rootDir, "content/ideas/post.html"),
        diary: resolve(rootDir, "content/diary/index.html"),
        work: resolve(rootDir, "content/work/index.html"),
        guestbook: resolve(rootDir, "content/guestbook/index.html"),
      },
    },
  },
});
