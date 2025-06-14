/**
 * Componente: P_operador.vue
 * 
 * Este es el layout principal para el módulo de operador.
 * Contiene la estructura base con navbar, sidebar y área de contenido.
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

// Configurar listeners de resize al montar el componente
onMounted(() => {
  console.log('[P_operador] Componente montado')
  console.log('[P_operador] Rol actual:', rolStore.rol)
  layoutStore.setupResizeListener()
})

// Limpiar listeners al desmontar
onUnmounted(() => {
  layoutStore.cleanupResizeListener()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navbar -->
    <Navbar />

    <!-- Contenedor principal con sidebar y contenido -->
    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Área de contenido principal -->
      <main class="flex-1 overflow-y-auto p-6 transition-all duration-300 lg:ml-64">
        <div class="max-w-7xl mx-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Ajustes para el layout */
main {
  min-height: calc(100vh - 4rem);
}

/* Ajuste para móvil */
@media (max-width: 1024px) {
  main {
    margin-left: 0;
  }
}
</style>

