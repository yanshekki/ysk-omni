import path from 'node:path';
import { defineConfig } from 'vite';

/**
 * Full Admin SPA build (feature-complete).
 * Source of truth: admin/src/full/app.js (synced from complete SPA).
 * Output: public/admin/boot.js — Express serves this as the only module entry.
 */
export default defineConfig({
  root: path.resolve(__dirname),
  base: '/admin/',
  publicDir: false,
  build: {
    outDir: path.resolve(__dirname, '../public/admin'),
    emptyOutDir: false, // keep styles.css, vendor, assets, index.html
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/boot.ts'),
      output: {
        entryFileNames: 'boot.js',
        // keep i18n strings in main boot chunk for one-request load
        chunkFileNames: 'assets/admin-[name]-[hash].js',
        assetFileNames: 'assets/admin-[name]-[hash][extname]',
        format: 'es',
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/admin/api': { target: 'http://127.0.0.1:3847', changeOrigin: true },
      '/admin/assets': { target: 'http://127.0.0.1:3847', changeOrigin: true },
      '/admin/styles.css': {
        target: 'http://127.0.0.1:3847',
        changeOrigin: true,
      },
      '/admin/vendor': { target: 'http://127.0.0.1:3847', changeOrigin: true },
    },
  },
});
