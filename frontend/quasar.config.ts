import { defineConfig } from '#q-app/wrappers'

export default defineConfig((/* ctx */) => {
  const backendTarget =
    process.env.DOCKER_ENV === 'true' ? 'http://backend:3000' : 'http://localhost:3000'

  return {
    boot: ['axios', 'pinia', 'auth', 'socket'],

    css: ['app.scss'],

    extras: ['line-awesome', 'roboto-font', 'material-icons', 'fontawesome-v6'],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },
      vueRouterMode: 'history'
    },

    devServer: {
      open: process.env.DOCKER_ENV === 'true' ? false : true,
      port: 9000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true
        },
        '/socket.io': {
          target: backendTarget,
          changeOrigin: true,
          ws: true
        }
      }
    },

    framework: {
      config: {
        dark: 'auto',
        notify: {
          position: 'top-right',
          timeout: 3000
        },
        loading: {
          spinnerColor: 'primary'
        }
      },

      iconSet: 'material-icons',
      lang: 'en-US',

      plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage', 'Meta', 'Screen']
    },

    animations: 'all',

    pwa: {
      workboxMode: 'generateSW',
      manifest: {
        name: 'Gig Galaxy',
        short_name: 'GigGalaxy',
        description: 'Freelancer Hiring Marketplace',
        display: 'standalone',
        background_color: '#F8FAFC',
        theme_color: '#5B21B6',
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }
  }
})
