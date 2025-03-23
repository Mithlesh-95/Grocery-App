import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    babel({
      babelConfig: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "chrome 76", // Target Chrome 76 (equivalent to Android 10 WebView)
              useBuiltIns: "usage", // Polyfill only what's needed
              corejs: 3, // Use core-js@3 for polyfills
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    target: "es2015", // Target ES2015 (supports const, let, destructuring)
  },
  esbuild: {
    target: "es2015", // Ensure esbuild also targets ES2015
  },
});