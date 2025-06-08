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

const menuSubtitle = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.subtitle
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

const footerTitle = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.footer.title
    // Agregar otros casos para cliente y gerente cuando estén listos
    default:
      return ''
  }
})

const footerSubtitle = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.footer.subtitle
    // Agregar otros casos para cliente y gerente cuando estén listos
    default:
      return ''
  }
})

const footerIcon = computed(() => {
  switch (rolStore.rol) {
    case 'operador':
      return menuOperador.footer.icon
    // Agregar otros casos para cliente y gerente cuando estén listos
    default:
      return ''
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
      <!-- Header del Sidebar -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 relative">
        <!-- Botón para cerrar en móvil -->
        <button 
          v-if="layoutStore.isMobile && layoutStore.isSidebarOpen"
          @click="layoutStore.closeSidebar()" 
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times"></i>
        </button>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 pr-8">{{ menuTitle }}</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ menuSubtitle }}</p>
      </div>

      <!-- Menú de navegación -->
      <nav class="px-4 py-6">
        <ul class="space-y-3">
          <template v-for="(section, index) in menuSections" :key="index">
            <li v-for="option in section.options" :key="option.path" class="relative">
              <router-link 
                :to="option.path"
                class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400': $route.path === option.path }"
              >
                <i :class="[option.icon, 'w-6 text-lg']"></i>
                <span>{{ option.text }}</span>
              </router-link>
            </li>
          </template>
        </ul>
      </nav>
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
 