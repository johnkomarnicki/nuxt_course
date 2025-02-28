// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },

  image: {
    domains: ["https://cdn.dummyjson.com"],
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },

  devtools: { enabled: true },

  colorMode: {
    preference: "light",
  },

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/supabase",
  ],

  googleFonts: {
    families: {
      Montserrat: true,
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
    kitKey: process.env.KIT_KEY,
    kitSecret: process.env.KIT_SECRET,
  },

  supabase: {
    redirectOptions: {
      exclude: ["/*"],
      callback: "/confirm",
    },
  },
});
