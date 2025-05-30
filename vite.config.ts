import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Simplified configuration for AWS SDK v3
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [],
      output: {
        // Global vars to use in UMD build for externalized deps
        globals: {}
      }
    }
  }
}));
