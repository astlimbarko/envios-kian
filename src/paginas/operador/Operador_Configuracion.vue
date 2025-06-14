/**
 * Componente: Operador_Configuracion.vue
 * 
 * Página de configuración del operador que permite gestionar:
 * - Información personal
 * - Seguridad de la cuenta
 * - Preferencias de notificaciones
 * - Configuración de la interfaz
 */

<script setup>
import { ref } from 'vue'

// Estado para los formularios
const infoPersonal = ref({
  nombre: 'Erik Johansson',
  email: 'erik.johansson@envioskian.com',
  telefono: '+46 123 456 789',
  cargo: 'Operador Senior'
})

const seguridad = ref({
  cambiarPassword: false,
  passwordActual: '',
  nuevoPassword: '',
  confirmarPassword: ''
})

const notificaciones = ref({
  nuevasRemesas: true,
  alertasSistema: true,
  recordatorios: true,
  correosElectronicos: true
})

const interfaz = ref({
  tema: 'sistema',
  idioma: 'es',
  mostrarTutorial: false
})

// Métodos
const actualizarInfoPersonal = () => {
  // Lógica para actualizar información personal
  console.log('Actualizando información personal:', infoPersonal.value)
}

const actualizarPassword = () => {
  // Lógica para actualizar contraseña
  console.log('Actualizando contraseña')
}

const actualizarNotificaciones = () => {
  // Lógica para actualizar preferencias de notificación
  console.log('Actualizando notificaciones:', notificaciones.value)
}

const actualizarInterfaz = () => {
  // Lógica para actualizar configuración de interfaz
  console.log('Actualizando interfaz:', interfaz.value)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Configuración de la Cuenta</h1>

    <!-- Información Personal -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Información Personal</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
          <input 
            v-model="infoPersonal.nombre"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
          <input 
            v-model="infoPersonal.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
          <input 
            v-model="infoPersonal.telefono"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo</label>
          <input 
            v-model="infoPersonal.cargo"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
      </div>
      <button 
        @click="actualizarInfoPersonal"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Guardar Cambios
      </button>
    </div>

    <!-- Seguridad -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Seguridad</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
          <input 
            v-model="seguridad.passwordActual"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
          <input 
            v-model="seguridad.nuevoPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
          <input 
            v-model="seguridad.confirmarPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
      </div>
      <button 
        @click="actualizarPassword"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Actualizar Contraseña
      </button>
    </div>

    
    

    
  </div>
</template>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style> 