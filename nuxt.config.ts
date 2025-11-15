// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  // app: {
  //   head: {
  //     meta: [
  //       { name: 'description', content: 'Сборник текстов песен для Церкви Источник Жизни' },
  //       { name: 'theme-color', content: '#ffffff' },
  //       { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  //       { name: 'apple-mobile-web-app-capable', content: 'yes' },
  //       { name: 'apple-mobile-web-app-title', content: 'Песни ИЖ' }
  //     ],
  //     link: [
  //       { rel: 'icon', type: 'image/png', href: '/logo-192.png' },
  //       { rel: 'apple-touch-icon', href: '/logo-180.png', sizes: '180x180' },
  //       { rel: 'mask-icon', href: '/logo-512.png', color: '#FFFFFF' }
  //     ]
  //   }
  // },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  modules: [
    '@nuxtjs/device',
    // '@vite-pwa/nuxt',
  ],

  devServer: {
    host: '0.0.0.0',
  },

  // pwa: {
  //   strategies: 'generateSW', 
  //   srcDir: '.',
  //   client: {
  //     installPrompt: true,
    //   periodicSyncForUpdates: 3600,
    // },
    // manifest: {
    //   "short_name": "IstokSongs",
    //   "name": "IstokSongs",
    //   "description": "Песни Церкви \"Источник Жизни\"",
    //   "icons": [
    //     {
    //       "src": "/logo-192.png",
    //       "sizes": "192x192",
    //       "type": "image/png"
    //     },
    //     {
    //       "src": "/logo-512.png",
    //       "sizes": "512x512",
    //       "type": "image/png"
    //     },
    //     {
    //       "src": "/logo-512.png",
    //       "sizes": "512x512",
    //       "type": "image/png",
    //       "purpose": "any"
    //     },
    //     {
    //       "src": "/logo-512.png",
    //       "sizes": "512x512",
    //       "type": "image/png",
    //       "purpose": "maskable"
    //     },
    //   ],
    //   "start_url": ".",
    //   "lang": "ru",
    //   "display": "standalone",
    //   "theme_color": '#ffffff',
    //   "background_color": '#ffffff',
    //   "orientation": "portrait",
    // }
  // },

  compatibilityDate: '2024-10-08',
});
