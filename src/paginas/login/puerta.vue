/**
 * Componente: puerta.vue
 * 
 * Este es un componente temporal que sirve como puerta de entrada al sistema.
 * Permite simular el acceso de diferentes roles (cliente, operador, gerente)
 * sin necesidad de autenticación real.
 * 
 * NOTA: Este componente es temporal y será reemplazado por el sistema
 * de login oficial cuando se implemente la autenticación real.
 */

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRolStore } from '../../stores/rolStore'

const router = useRouter()
const rolStore = useRolStore()

// Función para manejar el cambio de rol
const cambiarRol = (nuevoRol) => {
  rolStore.cambiarRol(nuevoRol)
  
  // Redirigir según el rol
  switch(nuevoRol) {
    case 'cliente':
      router.push('/cliente')
      break
    case 'operador':
      // Por ahora solo mostramos un mensaje
      alert('Módulo Operador en desarrollo')
      break
    case 'gerente':
      // Por ahora solo mostramos un mensaje
      alert('Módulo Gerente en desarrollo')
      break
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Logo y Título -->
      <div class="text-center mb-12">
        <div class="mx-auto w-24 h-24 mb-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <i class="fas fa-globe-americas text-5xl text-white"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Envíos KIAN
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Plataforma de Gestión de Remesas
        </p>
      </div>

      <!-- Tarjetas de Acceso -->
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Cliente -->
        <button 
          @click="cambiarRol('cliente')"
          class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
              <i class="fas fa-user text-2xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Cliente
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Accede para gestionar tus remesas y beneficiarios
            </p>
          </div>
        </button>

        <!-- Operador -->
        <button 
          @click="cambiarRol('operador')"
          class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <i class="fas fa-headset text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Operador
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Procesa remesas y atiende consultas de clientes
            </p>
          </div>
        </button>

        <!-- Gerente -->
        <button 
          @click="cambiarRol('gerente')"
          class="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
              <i class="fas fa-chart-line text-2xl text-purple-600 dark:text-purple-400"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Gerente
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Supervisa operaciones y gestiona el sistema
            </p>
          </div>
        </button>
      </div>

      <!-- Nota Temporal -->
      <div class="mt-12 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 italic">
          * Este es un sistema de acceso temporal para desarrollo. 
          Será reemplazado por el sistema de autenticación oficial.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones suaves para los botones */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-4px);
}

/* Efecto de brillo al hover */
button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: translateX(-100%);
  transition: 0.5s;
}

button:hover::after {
  transform: translateX(100%);
}
</style>
