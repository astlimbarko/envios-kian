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

// Configurar el store de layout
const layoutStore = useLayoutStore(pinia)

// Configurar listeners globales
app.config.globalProperties.$setupLayoutListeners = () => {
  layoutStore.setupResizeListener()
}

app.config.globalProperties.$cleanupLayoutListeners = () => {
  layoutStore.cleanupResizeListener()
}

// Inicializar listeners
layoutStore.setupResizeListener()

// Montar la aplicación
app.mount('#app')
