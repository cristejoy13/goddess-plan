import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'The Goddess Plan',
        short_name: 'Goddess Plan',
        description: 'Your personal wellness plan — workouts, nutrition, skincare, and reminders.',
        theme_color: '#1a0c12',
        background_color: '#1a0c12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          // Her logo, unaltered. One large square image; phones scale it down.
          { src: 'app-icon.png', sizes: '1254x1254', type: 'image/png', purpose: 'any' },
          { src: 'app-icon.png', sizes: '1254x1254', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Her logo is kept at full size and never shrunk, so it is over the
        // offline-cache limit. The phone fetches it when the app is added to
        // the home screen; it does not need to live in the offline copy.
        globIgnores: ['**/app-icon.png'],
      },
    }),
  ],
});
