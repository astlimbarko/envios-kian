/**
 * Componente: P_operador.vue
 * 
 * Este es el componente principal del módulo operador.
 * Sirve como layout para todas las páginas del módulo operador.
 * Utiliza los componentes comunes de navbar y sidebar.
 */

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRolStore } from '../../stores/rolStore'
import { useLayoutStore } from '../../stores/layoutStore'
import Navbar from '../../comun/navbar.vue'
import Sidebar from '../../comun/sidebar.vue'

const router = useRouter()
const rolStore = useRolStore()
const layoutStore = useLayoutStore()

// Verificar rol al montar el componente
onMounted(() => {
  if (rolStore.rol !== 'operador') {
    router.push('/puerta')
  }
  // Inicializar el layout
  layoutStore.setupResizeListener()
})

// Limpiar listeners al desmontar
onUnmounted(() => {
  layoutStore.cleanupResizeListener()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Navbar -->
    <Navbar />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Contenido principal -->
      <main class="flex-1 p-8 transition-all duration-300"
            :class="{ 'lg:ml-64': layoutStore.isSidebarOpen }">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1024px) {
  main {
    margin-left: 0 !important;
  }
}
</style>

