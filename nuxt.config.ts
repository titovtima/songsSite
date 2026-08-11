// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  modules: [
    '@nuxtjs/device',
    'nuxt-gtag',
  ],

  gtag: {
    id: 'G-4SJQ08K50R'
  },

  devServer: {
    host: '0.0.0.0',
  },

  compatibilityDate: '2024-10-08',
});
