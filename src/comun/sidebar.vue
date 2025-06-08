/**
 * Componente: sidebar.vue
 * 
 * Sidebar base común para todos los roles.
 * Utiliza el store de roles para mostrar las opciones correspondientes.
 */

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useLayoutStore } from '../stores/layoutStore'
import { useRolStore } from '../stores/rolStore'
import { menuOperador } from '../paginas/operador/sidebar'

const router = useRouter()
const layoutStore = useLayoutStore()
const rolStore = useRolStore()

const isOpen = computed(() => layoutStore.isSidebarOpen)
const isMobile = computed(() => layoutStore.isMobile)

// Calcular clases CSS según estado del store
const sidebarClasses = computed(() => {
  return {
    'translate-x-0': layoutStore.isSidebarOpen,
    '-translate-x-full': !layoutStore.isSidebarOpen,
    'lg:translate-x-0': !layoutStore.isMobile
  }
})

// Computar el título del panel según el rol
const panelTitle = computed(() => {
  switch(rolStore.rol) {
    case 'cliente':
      return 'Panel de Cliente'
    case 'operador':
      return 'Panel de Operador'
    case 'gerente':
      return 'Panel de Gerente'
    default:
      return 'Panel'
  }
})

const closeSidebar = () => {
  layoutStore.closeSidebar()
}

const menuTitle = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.title
    // Agregar otros casos para cliente y gerente cuando estén listos
    default:
      return ''
  }
})

const menuSections = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.sections
    // Agregar otros casos para cliente y gerente cuando estén listos
    default:
      return []
  }
})

const navigateTo = (path) => {
  router.push(path)
  if (layoutStore.isMobile) {
    layoutStore.closeSidebar()
  }
}
</script>

<template>
  <div>
    <!-- Menú móvil -->
    <div v-if="isMobile" class="fixed inset-0 z-40 lg:hidden" v-show="isOpen">
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="closeSidebar"></div>
      <div class="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ menuTitle }}</h2>
          <button @click="closeSidebar" class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <template v-for="(section, index) in menuSections" :key="index">
            <div class="px-3 py-2">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {{ section.title }}
              </h3>
            </div>
            <router-link
              v-for="option in section.options"
              :key="option.path"
              :to="option.path"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === option.path
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              <i :class="[option.icon, 'mr-3 h-5 w-5']"></i>
              {{ option.text }}
            </router-link>
          </template>
        </nav>
      </div>
    </div>

    <!-- Sidebar desktop -->
    <div class="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:dark:bg-gray-800 lg:dark:border-gray-700">
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Título del panel -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ menuTitle }}</h2>
        </div>
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <template v-for="(section, index) in menuSections" :key="index">
            <div class="px-3 py-2">
              <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                {{ section.title }}
              </h3>
            </div>
            <router-link
              v-for="option in section.options"
              :key="option.path"
              :to="option.path"
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="[
                $route.path === option.path
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              ]"
            >
              <i :class="[option.icon, 'mr-3 h-5 w-5']"></i>
              {{ option.text }}
            </router-link>
          </template>
        </nav>
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
 