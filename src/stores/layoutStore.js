import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // Estado
  const isSidebarOpen = ref(true)
  const isMobile = ref(false)
  const windowWidth = ref(window.innerWidth)

  // Acciones
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const checkMobile = () => {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < 1024
    
    // Si cambiamos a móvil, cerramos automáticamente el sidebar
    if (isMobile.value && isSidebarOpen.value) {
      isSidebarOpen.value = false
    }
    
    // Si volvemos a desktop, SIEMPRE abrimos el sidebar
    if (!isMobile.value) {
      isSidebarOpen.value = true
    }
  }

  // Hooks para Lifecycle
  const setupResizeListener = () => {
    window.addEventListener('resize', checkMobile)
    checkMobile() // Comprobación inicial
  }

  const cleanupResizeListener = () => {
    window.removeEventListener('resize', checkMobile)
  }

  return {
    isSidebarOpen,
    isMobile,
    windowWidth,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    checkMobile,
    setupResizeListener,
    cleanupResizeListener
  }
}) 