// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-icon', '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
