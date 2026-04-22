import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
})
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: false,
    },
  },
})

app.mount('#app')
