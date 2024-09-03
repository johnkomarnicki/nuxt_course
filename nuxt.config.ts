// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  colorMode: {
    preference: "light",
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

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false,
    },
  },

  image: {
    domains: ["https://cdn.dummyjson.com"],
  },

  devtools: { enabled: true },

  modules: ["@nuxt/icon", "@nuxtjs/google-fonts", "@nuxt/image", "@nuxt/ui"],

  runtimeConfig: {
    convertKitKey: process.env.CONVERT_KIT_KEY,
  },

  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
});
