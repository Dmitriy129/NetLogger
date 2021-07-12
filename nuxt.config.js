import fs from 'fs'
import colors from 'vuetify/es5/util/colors'
import { json } from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

export default {
  head: {
    titleTemplate: '%s - netlogger',
    title: 'netlogger',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],

  modules: ['@nuxtjs/axios'],

  axios: {},

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  build: {},

  serverMiddleware: [
    { path: '/api/monitors', handler: json() },
    // { path: '/api/monitors', handler: urlencoded() },

    {
      path: '/api/monitors/create',
      handler: './serverMiddleware/monitors/create/index',
    },
    {
      path: '/api/monitors/stop',
      handler: './serverMiddleware/monitors/stop/id',
    },
    {
      path: '/api/monitors/start',
      handler: './serverMiddleware/monitors/start/id',
    },
    { path: '/api/monitors', handler: './serverMiddleware/monitors/index' },
  ],
  server: {
    port: process.env.PORT || 3002,
  },
}
