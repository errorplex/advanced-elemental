// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Advanced Elemental",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content:
            "Advanced Elemental is an open-source alchemy game powered by AI, where you can combine up to 4 elements to create a new element.",
        },
        {
          name: "keywords",
          content:
            "advanced elemental,little alchemy,infinite craft,alchemy game,element game,alchemy ai,alchemy ai game",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },
  compatibilityDate: "2024-11-01",
  css: ["~/assets/css/global.css"],
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/ui", "@vueuse/nuxt", "@pinia/nuxt"],
});
