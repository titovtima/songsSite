// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

let list = ['/', '/songs_list/1'];
// let response = await fetch('https://test.songs.titovtima.ru/api/v1/songs/info');
let response = await fetch('https://songs.titovtima.ru/api/v1/songs/info');
let songsData = await response.json();
for (let song of songsData.list) {
  list.push('/song/' + song.id);
}

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

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  modules: [
    '@nuxtjs/device',
    '@vite-pwa/nuxt',
  ],

  devServer: {
    host: '0.0.0.0',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: false,
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
      runtimeCaching: [
        {
          urlPattern: /\/.*\.(?:png|jpg|jpeg|svg|gif|webp|json|woff2)/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-assets',
          }
        },
        // {
        //   urlPattern: ({ url }) => {
        //     return url.pathname.includes('api');
        //   },
        //   handler: 'StaleWhileRevalidate',
        //   options: {
        //     cacheName: 'api-responses',
        //   }
        // },
        // {
        //   urlPattern: ({request}) => {
        //     return request.method === 'GET'
        //   },
        //   handler: 'StaleWhileRevalidate',
        //   options: {
        //     cacheName: 'global-cache',
        //     expiration: {
        //       maxEntries: 1000,
        //       maxAgeSeconds: 60 * 60 * 24 * 30,
        //     }
        //   }
        // },
      ]
    }
  },

  nitro: {
    prerender: {
      routes: list
    }
  },

  compatibilityDate: '2024-10-08',
});
