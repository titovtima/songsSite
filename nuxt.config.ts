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

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  modules: [
    '@nuxtjs/device',
  ],

  devServer: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2024-10-08',
});
