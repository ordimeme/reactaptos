import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dialog',
            'lucide-react'
          ],
          'vendor-icons': [
            'react-icons',
            'react-icons/fa',
            'react-icons/fa6'
          ],
          'vendor-utils': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ]
        },
        experimentalMinChunkSize: 10000,
        chunkFileNames: (chunkInfo) => {
          const id = chunkInfo.facadeModuleId || '';
          if (id.includes('pages')) {
            return 'assets/pages/[name]-[hash].js';
          }
          if (id.includes('components')) {
            return 'assets/components/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    open: true,
  },
  plugins: [
    react(),
    nodePolyfills({
      exclude: ["fs"],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      process: "process/browser",
      path: "path-browserify",
      os: "os-browserify",
      stream: "stream-browserify",
    },
  },
});
