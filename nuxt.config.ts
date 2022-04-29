import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    ['unplugin-icons/nuxt', { autoInstall: true }],
  ],
})
