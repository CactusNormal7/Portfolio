// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/a11y',
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
      htmlAttrs: { lang: 'en' },
      link: [
        // SVG favicon follows the system color scheme; PNG is the fallback
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' }
      ],
      script: [
        {
          // Apply the saved (or system) theme before first paint to avoid a flash
          innerHTML: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t}catch(e){}})()`
        }
      ]
    }
  }
})
