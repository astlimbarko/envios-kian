<script setup>
import { ref, onMounted, watch } from 'vue'

const isDarkMode = ref(false)

// Función para cambiar el tema
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  applyTheme()
}

// Aplicar clase al documento basada en el tema actual
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Inicializar tema según preferencia del usuario
onMounted(() => {
  // Verificar si hay una preferencia guardada
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // Usar preferencia del sistema si no hay guardada
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDarkMode.value = prefersDark
  }
  
  applyTheme()
})

// Observar cambios en el tema
watch(isDarkMode, () => {
  applyTheme()
}, { immediate: true })
</script>

<template>
  <button 
    @click="toggleTheme" 
    class="relative p-2 rounded-full transition-colors duration-300 focus:outline-none group"
    :class="[isDarkMode ? 'bg-blue-900' : 'bg-gray-100']"
    aria-label="Cambiar tema"
  >
    <!-- Icono del sol para modo claro -->
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="w-5 h-5 transition-all duration-300 ease-in-out"
      :class="isDarkMode ? 'opacity-0 scale-0 absolute' : 'opacity-100 text-blue-600'"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
      />
    </svg>
  
    <!-- Icono de la luna para modo oscuro -->
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="w-5 h-5 transition-all duration-300 ease-in-out"
      :class="isDarkMode ? 'opacity-100 text-blue-200' : 'opacity-0 scale-0 absolute'"
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
      />
    </svg>
    
    <!-- Tooltip -->
    <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
      {{ isDarkMode ? 'Modo claro' : 'Modo oscuro' }}
    </span>
  </button>
</template>

<style scoped>
button {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(20, 110, 190, 0.4);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(20, 110, 190, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(20, 110, 190, 0);
  }
}
</style> 