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

// Crear y usar Pinia
const pinia = createPinia()
app.use(pinia)

// Usar el enrutador
app.use(router)

// Inicializar el store de layout
import { useLayoutStore } from './stores/layoutStore'

// Inicializar listener global para redimensionamiento
app.config.globalProperties.$setupLayoutListeners = () => {
  const layoutStore = useLayoutStore()
  layoutStore.setupResizeListener()
  
  // Limpiar al cerrar la app
  window.addEventListener('beforeunload', () => {
    layoutStore.cleanupResizeListener()
  })
}

// Ejecutar iniciación del layout
app.config.globalProperties.$setupLayoutListeners()

// Montar la aplicación
app.mount('#app')
