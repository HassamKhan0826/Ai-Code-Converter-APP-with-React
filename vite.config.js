import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Don't publish source maps: they would expose your original,
    // un-minified source code to anyone who opens DevTools.
    sourcemap: false,
    // React + the CodeMirror editor core form one ~650 kB chunk (about
    // 210 kB gzipped). Languages and the Puter SDK are already split out
    // and loaded on demand, so this size is expected.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      // The Puter SDK ships a few files that mix CommonJS and ES module
      // syntax. They are guarded and work in browsers; hide the noise.
      checks: { commonJsVariableInEsm: false },
    },
  },
});
