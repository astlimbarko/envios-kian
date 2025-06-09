/**
 * Componente: P_cliente.vue
 * 
 * Este es el componente principal del módulo cliente.
 * Sirve como layout para todas las páginas del módulo cliente.
 */

<script setup>
import Navbar from '../../comun/navbar.vue'
import Sidebar from './Sidebar.vue'
import Soporte from './Soporte.vue'
import { useLayoutStore } from '../../stores/layoutStore'
import { onMounted, onUnmounted } from 'vue'

// Usar el store de layout
const layoutStore = useLayoutStore()

// Configurar listeners de resize al montar el componente
onMounted(() => {
  layoutStore.setupResizeListener()
})

// Limpiar listeners al desmontar
onUnmounted(() => {
  layoutStore.cleanupResizeListener()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <div class="flex relative">
      <Sidebar />
      <main class="flex-1 p-4 lg:ml-64 transition-all duration-300">
        <router-view></router-view>
      </main>
    </div>
    <Soporte />
  </div>
</template>

<style scoped>
/* Los estilos se heredan de las variables CSS globales */
:deep(body) {
  overflow-x: hidden;
}

/* Ajustes para móvil */
@media (max-width: 1024px) {
  main {
    margin-left: 0 !important;
  }
}
</style>
