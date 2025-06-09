import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './tailwind.css'
import './style.css'
import App from './App.vue'
import router from './router'

// Importar Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// Crear la aplicación Vue
const app = createApp(App)

// Deshabilitar completamente las DevTools
app.config.devtools = false
app.config.warnHandler = () => null
app.config.errorHandler = () => null

// Crear y usar Pinia
const pinia = createPinia()
app.use(pinia)

// Usar el enrutador
app.use(router)

// Montar la aplicación
app.mount('#app')
