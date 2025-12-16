// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8080",
    },
  },
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "vuetify-nuxt-module",
  ],
});
