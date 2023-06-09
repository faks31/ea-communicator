// https://nuxt.com/docs/api/configuration/nuxt-config
import type { ModuleOptions } from '@sidebase/nuxt-session';
import unocssConfig from './unocss.config';

const nuxtConfig = defineNuxtConfig({
  modules: [
    '@formkit/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@sidebase/nuxt-session',
  ],
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: process.env.NUXT_API_SECRET,
    baseDir: __dirname,

    functionEmail: process.env.FUNCTION_EMAIL,
    functionSms: process.env.FUNCTION_SMS,
    functionMessage: process.env.FUNCTION_MESSAGE,
    functionVoice: process.env.FUNCTION_VOICE,

    // Keys within public are also exposed client-side
    public: {
      APP_URL: process.env.APP_URL,
      API_BASEURL: process.env.API_BASEURL,
      SMARTSUITE_BASEURL: process.env.SMARTSUITE_URL,
      API_SMARTSUITE_BASEURL: process.env.API_SMARTSUITE_BASEURL,
      APP_AUTH_URL: process.env.APP_AUTH_URL,
      UPLOAD_SIZE_LIMIT: parseInt(process.env.UPLOAD_SIZE_LIMIT || '25000000'),
    },
    build: {
      transpile: ['@vuepic/vue-datepicker'],
    },
  },
  css: [
    '~/assets/scss/main.scss',
    '@vueform/multiselect/themes/default.css',
    'vue-loading-overlay/dist/css/index.css',
  ],
  build: { transpile: ['trpc-nuxt'] },
  app: {
    head: {
      title: 'Communicator | SmartSuite',
    },
  },
});

const session: ModuleOptions = {
  isEnabled: true,
  session: {
    cookieSecure: process.env.APP_URL?.startsWith('https'),
    // Sessions expire after 3600 seconds = 60 minutes
    expiryInSeconds: parseInt(process.env.SESSION_EXPIRY_SECONDS || '3600'),
    storageOptions: {
      driver: 'fs',
      options: {
        base: './.session',
      },
    },
  },
  api: { methods: ['get'] },
};

export default { ...nuxtConfig, unocss: { ...unocssConfig }, session };
