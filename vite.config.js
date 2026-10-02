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
          // Her logo (Background 2), only resized. The edge-to-edge
          // ("maskable") copies have their own files: when both kinds shared
          // one file, Brave on the Mac kept only the plain one and put the
          // logo on a white plate in the Dock.
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'app-icon.png', sizes: '1254x1254', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Her logo is kept at full size and never shrunk, so it is over the
        // offline-cache limit. The phone fetches it when the app is added to
        // the home screen; it does not need to live in the offline copy.
        // The old icon names carry the same image, for any gadget that
        // remembers them, so they are left out too.
        globIgnores: ['**/app-icon.png', '**/apple-touch-icon.png', '**/icon-192.png', '**/icon-512.png', '**/icon-maskable-*.png', '**/favicon.ico',
          // Her own pictures, kept in public/ for later. Too big for the
          // offline copy, and nothing in the app uses them yet.
          '**/Background 2.png', '**/Lotus.png', '**/Lotus 1.png'],
      },
    }),
  ],
});
