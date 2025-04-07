<script setup>
import Navbar from './navbar.vue'
import Sidebar from './Sidebar.vue'
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
  <div class="min-h-screen overflow-x-hidden">
    <!-- Barra de navegación -->
    <Navbar />
    
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Overlay para cerrar sidebar en móvil -->
    <div 
      v-if="layoutStore.isMobile && layoutStore.isSidebarOpen" 
      class="sidebar-overlay active" 
      @click="layoutStore.closeSidebar">
    </div>
    
    <!-- Contenido principal -->
    <main 
      :class="[
        'pt-8 px-4 pb-8 transition-all duration-300 overflow-x-hidden app-content', 
        { 'with-sidebar': !layoutStore.isMobile }
      ]">
      <div class="container mx-auto">
        <!-- Router view para los componentes hijos -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Los estilos se heredan de las variables CSS globales */
:deep(body) {
  overflow-x: hidden;
}
</style>
