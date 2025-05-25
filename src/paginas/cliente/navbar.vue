<script setup>
// Componente de barra de navegación para ENVIOS KIAN (Remesadora)
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import ThemeToggle from '../../components/ThemeToggle.vue'
import { useLayoutStore } from '../../stores/layoutStore'

const router = useRouter()
const showDropdown = ref(false)
const layoutStore = useLayoutStore()

const cerrarSesion = () => {
  // Lógica para cerrar sesión
  console.log('Cerrando sesión...')
  // Redireccionar a la página de inicio
  router.push('/')
  showDropdown.value = false
}

const goToAccount = () => {
  router.push('/mi-cuenta')
  showDropdown.value = false
}

const toggleSidebar = () => {
  layoutStore.toggleSidebar()
}
</script>

<template>
  <nav class="bg-[var(--color-navbar-bg)] dark:bg-[#111b21] text-gray-800 dark:text-white shadow-md py-3 w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Logo y Nombre -->
      <div class="flex items-center">
        <!-- Eliminado botón para mostrar/ocultar sidebar en pantallas grandes -->
        
        <div class="text-gray-800 dark:text-white mr-2">
          <i class="fas fa-globe-americas text-3xl"></i>
        </div>
        <router-link to="/cliente" class="text-xl font-bold logo-text hidden sm:block">
          ENVIOS KIAN
        </router-link>
      </div>

      <!-- Opciones de Navegación -->
      <div class="flex items-center space-x-3 sm:space-x-6">
        <!-- Botón de tema -->
        <ThemeToggle />
        
        <router-link to="/faq" class="flex items-center text-gray-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-300 transition-colors relative group">
          <i class="fas fa-circle-question text-xl sm:text-2xl icon-neon"></i>
          <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">FAQ</span>
        </router-link>
        

        
        <router-link to="/blog" class="hidden sm:flex items-center text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors relative group">
          <i class="fas fa-newspaper text-xl sm:text-2xl icon-neon"></i>
          <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">Noticias</span>
        </router-link>

        <!-- Usuario y Menú Desplegable -->
        <div class="relative ml-3 sm:ml-6 group">
          <div class="flex items-center cursor-pointer">
            <div class="hidden sm:block mr-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Erik Johansson</span>
            </div>
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#3073ad] to-[#4c9ed9] text-white">
              <i class="fas fa-user text-sm"></i>
            </div>
          </div>
          
          <!-- Menú desplegable -->
          <div 
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
          >
            <div class="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 sm:hidden">
              <div class="font-medium text-gray-800 dark:text-gray-200">Erik Johansson</div>
            </div>
            <a 
              @click="goToAccount" 
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              <i class="fas fa-user mr-2"></i>Mi Cuenta
            </a>
            <a 
              @click="cerrarSesion" 
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Espaciador para compensar el navbar fijo -->
  <div class="h-16"></div>
</template>

<style scoped>
/* Estilos para el degradado del nombre */
.logo-text {
  background: linear-gradient(90deg, #3073ad, #d94cba);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

/* Efecto de resplandor neón para los iconos */
.icon-neon {
  position: relative;
  transition: all 0.1s ease;
}

.icon-neon:hover {
  transform: scale(1.1); /* Ligero efecto de zoom */
}

/* Estilo para modo claro */
:root .icon-neon:hover {
  color: #146EBE; /* Azul más oscuro para modo claro */
  text-shadow: 
    0 0 10px rgba(76, 158, 217, 0.4),
    0 0 20px rgba(20, 110, 190, 0.2);
}

/* Estilo para modo oscuro */
.dark .icon-neon:hover {
  color: #c8e4ff; /* Color celeste muy claro para modo oscuro */
  text-shadow: 
    0 0 10px rgba(200, 228, 255, 0.9),
    0 0 20px rgba(128, 189, 255, 0.7),
    0 0 30px rgba(20, 110, 190, 0.3);
}

/* Adaptación a móvil */
@media (max-width: 640px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .space-x-3 > * + * {
    margin-left: 0.5rem;
  }
}
</style>
