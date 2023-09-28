const pkg = require('./package')

module.exports = {
  mode: 'Universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://use.fontawesome.com/releases/v5.7.1/css/all.css' }
    ]
  },
  env: {
    pdfCreator: process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3999' : 'http://192.168.2.217:3999',
    eva: 'hWmZq4t7w!z%C*F)J@NcRfUjXn2r5u8x'
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '~/plugins/axios',
    '@/plugins/vue-draggable',
    { src: '~/plugins/vue-apexcharts', ssr:false},
    
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://127.0.0.1:3998' : 'http://192.168.2.147:3998'  
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
 buildModules: [
  '@nuxtjs/dotenv'
],
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },
  server: {
    port: 4000, //4000, // default: 3000
    //host: '192.168.2.147' //'192.168.2.26' // default: localhost
    host: process.env.NODE_ENV !== 'production' ? '127.0.0.1' : '192.168.2.59'
  }
}
