/**
 * Componente: sidebar.vue
 * 
 * Sidebar base común para todos los roles.
 * Utiliza el store de roles para mostrar las opciones correspondientes.
 */

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRolStore } from '../stores/rolStore'

const router = useRouter()
const route = useRoute()
const rolStore = useRolStore()

// Estado para el menú móvil
const isMobileMenuOpen = ref(false)

// Computar las opciones del menú según el rol
const menuOptions = computed(() => rolStore.menuOptions)

// Función para navegar
const navigate = (path) => {
  router.push(`/${rolStore.rol}${path}`)
  isMobileMenuOpen.value = false
}

// Función para verificar si una ruta está activa
const isActive = (path) => {
  return route.path.includes(path)
}
</script>

<template>
  <!-- Sidebar para escritorio -->
  <aside class="hidden md:flex flex-col w-64 bg-white dark:bg-[#111b21] border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-16 transition-all duration-300">
    <div class="flex-1 overflow-y-auto py-4">
      <nav class="space-y-1 px-2">
        <template v-for="(option, index) in menuOptions" :key="index">
          <!-- Sección con título -->
          <div v-if="option.titulo" class="px-3 py-2">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ option.titulo }}
            </h3>
          </div>
          
          <!-- Opción de menú -->
          <a
            v-if="!option.titulo"
            @click="navigate(option.path)"
            :class="[
              isActive(option.path)
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200'
            ]"
          >
            <i :class="[
              option.icon,
              isActive(option.path)
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300',
              'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
            ]"></i>
            {{ option.text }}
          </a>
        </template>
      </nav>
    </div>
  </aside>

  <!-- Botón de menú móvil -->
  <button
    @click="isMobileMenuOpen = !isMobileMenuOpen"
    class="md:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
  >
    <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
  </button>

  <!-- Menú móvil -->
  <div
    v-if="isMobileMenuOpen"
    class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    @click="isMobileMenuOpen = false"
  >
    <div
      class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#111b21] shadow-lg transform transition-transform duration-300"
      @click.stop
    >
      <div class="flex-1 overflow-y-auto py-4">
        <nav class="space-y-1 px-2">
          <template v-for="(option, index) in menuOptions" :key="index">
            <!-- Sección con título -->
            <div v-if="option.titulo" class="px-3 py-2">
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ option.titulo }}
              </h3>
            </div>
            
            <!-- Opción de menú -->
            <a
              v-if="!option.titulo"
              @click="navigate(option.path)"
              :class="[
                isActive(option.path)
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200'
              ]"
            >
              <i :class="[
                option.icon,
                isActive(option.path)
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300',
                'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200'
              ]"></i>
              {{ option.text }}
            </a>
          </template>
        </nav>
      </div>
    </div>
  </div>

  <!-- Espaciador para el contenido principal -->
  <div class="hidden md:block w-64"></div>
</template>

<style scoped>
/* Estilos para el scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Estilos para modo oscuro */
.dark .overflow-y-auto {
  scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
</style> 