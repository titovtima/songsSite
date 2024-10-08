// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

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
  ],

  compatibilityDate: '2024-10-08',
});
