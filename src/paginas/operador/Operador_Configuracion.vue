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

    <!-- Notificaciones -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Notificaciones</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">Nuevas Remesas</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificaciones.nuevasRemesas"
              type="checkbox"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">Alertas del Sistema</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificaciones.alertasSistema"
              type="checkbox"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-700 dark:text-gray-300">Recordatorios</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="notificaciones.recordatorios"
              type="checkbox"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <button 
        @click="actualizarNotificaciones"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Guardar Preferencias
      </button>
    </div>

    <!-- Interfaz -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Interfaz</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tema</label>
          <select 
            v-model="interfaz.tema"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="sistema">Sistema</option>
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Idioma</label>
          <select 
            v-model="interfaz.idioma"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
        </div>
      </div>
      <button 
        @click="actualizarInterfaz"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Guardar Configuración
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos del componente si son necesarios */
</style> 