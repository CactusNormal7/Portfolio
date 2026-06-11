// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/a11y',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@morev/vue-transitions',
    '@formkit/auto-animate',
    '@nuxtjs/html-validator',
    '@nuxtjs/svg-sprite',
    '@oro.ad/nuxt-claude-devtools'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Override with NUXT_ADMIN_PASSWORD env var
    adminPassword: 'admin'
  },

  app: {
    head: {
      title: 'Jules Besson — Web Developer',
      meta: [
        { name: 'description', content: 'Jules Besson — M1 web development student. Selected works, about & contact.' }
      ],
      htmlAttrs: { lang: 'en' }
    }
  }
})
