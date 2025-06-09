/**
 * Componente: navbar.vue
 * 
 * Navbar base común para todos los roles.
 * Incluye logo, nombre de usuario y menú de usuario.
 */

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useRolStore } from '../stores/rolStore'
import { navbarOperador } from '../paginas/operador/Operador_Navbar'
import { navbarCliente } from '../paginas/cliente/Cliente_navbar'

const router = useRouter()
const showDropdown = ref(false)
const rolStore = useRolStore()
const isMobile = ref(false)

// Función para detectar el tamaño de la pantalla
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 640
}

// Configurar listeners de resize
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Configuración base común para todos los roles
const configBase = {
  logo: {
    icono: 'fas fa-globe-americas',
    texto: 'ENVIOS KIAN'
  },
  usuario: {
    nombre: 'Usuario'
  },
  menuUsuario: {
    cerrarSesion: {
      texto: 'Cerrar Sesión',
      icono: 'fas fa-sign-out-alt',
      ruta: '/'
    }
  }
}

// Computed que combina la configuración base con la específica del rol
const navbarConfig = computed(() => {
  let configEspecifica = {}
  
  switch (rolStore.rol) {
    case 'operador':
      configEspecifica = navbarOperador
      break
    case 'cliente':
      configEspecifica = navbarCliente
      break
    default:
      configEspecifica = navbarCliente
  }

  // Combinar configuraciones
  return {
    ...configBase,
    ...configEspecifica,
    menuUsuario: {
      ...configBase.menuUsuario,
      ...configEspecifica.menuUsuario
    }
  }
})

const cerrarSesion = () => {
  console.log('Cerrando sesión...')
  router.push('/')
  showDropdown.value = false
}
</script>

<template>
  <nav class="bg-[var(--color-navbar-bg)] dark:bg-[#111b21] text-gray-800 dark:text-white shadow-md py-3 w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="px-4 sm:px-6 flex items-center justify-between">
      <!-- Logo y Nombre -->
      <div class="flex items-center">
        <!-- Logo y texto -->
        <div class="flex items-center">
          <i :class="[navbarConfig.logo.icono, 'text-2xl sm:text-3xl text-gray-800 dark:text-white']"></i>
          <router-link :to="`/${rolStore.rol}`" class="ml-2 text-lg sm:text-xl font-bold logo-text hidden sm:block">
            {{ navbarConfig.logo.texto }}
          </router-link>
        </div>
      </div>

      <!-- Opciones de Navegación -->
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Elementos adicionales específicos del rol -->
        <template v-for="elemento in navbarConfig.elementosAdicionales" :key="elemento.texto">
          <router-link 
            v-if="elemento.tipo === 'link' && elemento.visible && (!elemento.ocultarEnMovil || !isMobile)"
            :to="elemento.ruta" 
            class="flex items-center text-gray-800 dark:text-white hover:text-blue-700 dark:hover:text-blue-300 transition-colors relative group"
          >
            <i :class="[elemento.icono, 'text-xl sm:text-2xl', elemento.clase]"></i>
            <span 
              v-if="elemento.tooltip"
              class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md"
            >
              {{ elemento.tooltip }}
            </span>
          </router-link>
        </template>

        <!-- Botón de tema -->
        <ThemeToggle />
        
        <!-- Usuario y Menú Desplegable -->
        <div class="relative group">
          <div class="flex items-center cursor-pointer">
            <div class="hidden sm:block mr-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ navbarConfig.usuario.nombre }}</span>
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
              <div class="font-medium text-gray-800 dark:text-gray-200">{{ navbarConfig.usuario.nombre }}</div>
            </div>
            <router-link 
              v-if="navbarConfig.menuUsuario.configuracion"
              :to="navbarConfig.menuUsuario.configuracion.ruta"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              <i :class="[navbarConfig.menuUsuario.configuracion.icono, 'mr-2']"></i>{{ navbarConfig.menuUsuario.configuracion.texto }}
            </router-link>
            <a 
              @click="cerrarSesion" 
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
            >
              <i :class="[navbarConfig.menuUsuario.cerrarSesion.icono, 'mr-2']"></i>{{ navbarConfig.menuUsuario.cerrarSesion.texto }}
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
  transform: scale(1.1);
}

/* Estilo para modo claro */
:root .icon-neon:hover {
  color: #146EBE;
  text-shadow: 
    0 0 10px rgba(76, 158, 217, 0.4),
    0 0 20px rgba(20, 110, 190, 0.2);
}

/* Estilo para modo oscuro */
.dark .icon-neon:hover {
  color: #c8e4ff;
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
}
</style>
 