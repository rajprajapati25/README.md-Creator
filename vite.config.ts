import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    publicDir: "public",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    // New: Ensure assets are served and built correctly
    build: {
      assetsDir: "assets",
      outDir: "dist",
    },
    // Original: Preserved environment constraints for HMR and file watching
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});