import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // Estado
  const isMobile = ref(false)
  const isSidebarOpen = ref(true)
  const windowWidth = ref(window.innerWidth)

  // Acciones
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function closeSidebar() {
    isSidebarOpen.value = false
  }

  function openSidebar() {
    isSidebarOpen.value = true
  }

  function checkMobile() {
    windowWidth.value = window.innerWidth
    isMobile.value = windowWidth.value < 1024
    
    // Si cambiamos a móvil, cerramos automáticamente el sidebar
    if (isMobile.value && isSidebarOpen.value) {
      isSidebarOpen.value = false
    }
    
    // Si volvemos a desktop, SIEMPRE abrimos el sidebar (cambiado)
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
    isMobile,
    isSidebarOpen,
    windowWidth,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    checkMobile,
    setupResizeListener,
    cleanupResizeListener
  }
}) 