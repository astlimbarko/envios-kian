<script setup>
// Componente de barra lateral para el módulo de cliente
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useLayoutStore } from '../../stores/layoutStore'

const router = useRouter()
const activeItem = ref('mis-remesas')
const layoutStore = useLayoutStore()

const navigateTo = (route, item) => {
  activeItem.value = item
  router.push(route)
  // En móvil, cerrar sidebar después de navegar
  if (layoutStore.isMobile) {
    layoutStore.closeSidebar()
  }
}

// Calcular clases CSS según estado del store
const sidebarClasses = computed(() => {
  return {
    'translate-x-0': layoutStore.isSidebarOpen,
    '-translate-x-full': !layoutStore.isSidebarOpen,
    'lg:translate-x-0': !layoutStore.isMobile
  }
})

const cerrarSesion = () => {
  // Aquí iría la lógica para cerrar sesión
  router.push('/login')
}
</script>

<template>
  <!-- Botón para mostrar/ocultar en dispositivos móviles -->
  <button 
    v-if="layoutStore.isMobile && !layoutStore.isSidebarOpen"
    @click="layoutStore.toggleSidebar()" 
    class="fixed left-0 top-20 z-40 bg-blue-600 dark:bg-[#111b21] text-white p-2 rounded-r-md shadow-md"
  >
    <i class="fas fa-bars"></i>
  </button>

  <div 
    :class="['sidebar h-full w-64 fixed left-0 top-16 shadow-lg transition-all duration-300 transform z-50', sidebarClasses]">
    <!-- Botón para cerrar en móvil -->
    <button 
      v-if="layoutStore.isMobile && layoutStore.isSidebarOpen"
      @click="layoutStore.closeSidebar()" 
      class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      <i class="fas fa-times"></i>
    </button>
    
    <!-- Header del Sidebar -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Panel de Cliente</h2>
      <p class="text-sm text-gray-600 dark:text-gray-400">Gestión de remesas</p>
    </div>

    <!-- Menú de navegación -->
    <nav class="px-4 py-6">
      <ul class="space-y-3">
        <li class="relative">
          <router-link 
            to="/cliente/nueva-remesa"
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === '/cliente/nueva-remesa' }"
          >
            <i class="fas fa-plus-circle w-6 text-lg"></i>
            <span>Nueva Remesa</span>
          </router-link>
        </li>
        <li class="relative">
          <router-link 
            to="/cliente/mis-remesas"
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === '/cliente/mis-remesas' }"
          >
            <i class="fas fa-exchange-alt w-6 text-lg"></i>
            <span>Mis Remesas</span>
          </router-link>
        </li>
        <li class="relative">
          <router-link to="/cliente/beneficiarios" 
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            :class="{ 'active-menu-item': $route.path === '/cliente/beneficiarios' }"
            @click="layoutStore.isMobile && layoutStore.closeSidebar()"
          >
            <i class="fas fa-users text-lg mr-3" :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/cliente/beneficiarios' }"></i>
            <span>Beneficiarios</span>
          </router-link>
        </li>
        <li class="relative">
          <router-link to="/cliente/soporte" 
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            :class="{ 'active-menu-item': $route.path === '/cliente/soporte' }"
            @click="layoutStore.isMobile && layoutStore.closeSidebar()"
          >
            <i class="fas fa-headset text-lg mr-3" :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/cliente/soporte' }"></i>
            <span>Soporte en Línea</span>
          </router-link>
        </li>
      </ul>

      <!-- Separador -->
      <div class="my-6 border-t border-gray-200 dark:border-gray-700"></div>

      <!-- Información de contacto como botón -->
      <ul class="space-y-3">
        <li class="relative">
          <router-link to="/cliente/contacto" 
            class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            :class="{ 'active-menu-item': $route.path === '/cliente/contacto' }"
            @click="layoutStore.isMobile && layoutStore.closeSidebar()"
          >
            <i class="fas fa-phone text-lg mr-3" :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/cliente/contacto' }"></i>
            <span>Información de Contacto</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer del Sidebar -->
    <div class="absolute bottom-0 w-full px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <div class="mr-3">
          <i class="fas fa-headset text-blue-600 dark:text-blue-400 text-xl"></i>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">¿Necesitas Ayuda?</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400">Contacta a soporte</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Aplicar estilos de sidebar */
.sidebar {
  background-color: var(--color-win10-taskbar);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease;
}

/* Modo oscuro */
.dark .sidebar {
  background-color: var(--color-sidebar-bg);
}

/* Mejora para elementos hover en modo claro */
.sidebar .router-link-active:not(.active-menu-item):hover,
.sidebar a:hover {
  background-color: rgba(255, 255, 255, 0.7) !important;
}

/* Estilo mejorado para elementos activos */
.active-menu-item {
  background-color: rgba(255, 255, 255, 0.85) !important;
  color: #146EBE !important;
  font-weight: 500;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
  position: relative;
}

/* Indicador lateral para elementos activos */
.active-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #146EBE, #4c9ed9);
  border-radius: 0 4px 4px 0;
}

/* Estilos para modo oscuro */
.dark .active-menu-item {
  background-color: rgba(59, 130, 246, 0.2) !important;
  color: #e5e7eb !important;
}

.dark .active-menu-item::before {
  background: linear-gradient(to bottom, #4c9ed9, #146EBE);
}

/* Asegurar que los textos tengan buen contraste en modo oscuro */
.dark .text-gray-700 {
  color: #e5e7eb;
}

/* Mejora para elementos hover en modo oscuro */
.dark .sidebar a:hover {
  background-color: rgba(31, 41, 55, 0.8) !important;
  color: #ffffff !important;
}

.dark .sidebar a:hover i {
  color: #60a5fa !important;
}

/* Ajustes para móvil */
@media (max-width: 1024px) {
  .sidebar {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
}
</style>
