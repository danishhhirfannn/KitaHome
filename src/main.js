import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          background: '#FAFAFA',
          border: '#E5E5E5',
          content: '#FDFDFD',
          textPrimary: "#212529",
          textSecondary: "#86888A",
          primary: "#00287D",
          secondary: "#00287D",
        },
      },
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Inter, sans-serif, Roboto',
      },
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
