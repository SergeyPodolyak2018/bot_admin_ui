import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: './dist',
  },
  server: {
    port: 3008,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    viteStaticCopy({
      targets: [],
    }),
    reactRefresh(),
    VitePWA({
      manifest: {
        name: 'BOT CX',
        short_name: 'BOT CX',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
