// src/plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches

export default createVuetify({
  theme: {
    defaultTheme: prefersDarkScheme ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#C8A2C8',
          background: '#ffffff',
          surface: '#f8f9fa',
          'on-background': '#000000',
          'on-surface': '#333333',
          
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#00ffff',
          background: '#0f0f0f',
          surface: '#1c1c1e',
          'on-background': '#ffffff',
          'on-surface': '#ffffff',
          error: 'rgb(255, 0, 0)',
        },
      },
    },
  },
})
