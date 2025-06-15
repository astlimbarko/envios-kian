/**
 * Componente: Beneficiarios.vue
 * 
 * Este componente permite gestionar los beneficiarios de las remesas,
 * asociándolos con los clientes y manteniendo un registro de sus datos.
 */

<script setup>
import { ref } from 'vue'

// Estado
const beneficiarios = ref([
  {
    id: 1,
    nombre: 'María García',
    documento: '12345678',
    tipoDocumento: 'DNI',
    telefono: '+591 76543210',
    cliente: 'Juan Pérez',
    ultimaRemesa: '2024-03-20',
    totalRemesas: 5
  },
  // ... más beneficiarios
])

const beneficiarioSeleccionado = ref(null)
const mostrarModal = ref(false)

// Funciones
const verDetalles = (beneficiario) => {
  beneficiarioSeleccionado.value = beneficiario
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  beneficiarioSeleccionado.value = null
}

const asociarCliente = (cliente) => {
  if (beneficiarioSeleccionado.value) {
    beneficiarioSeleccionado.value.cliente = cliente
    // Aquí iría la lógica para guardar en la base de datos
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Encabezado con Explicación -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
      <h1 class="text-2xl font-bold mb-2">Gestión de Beneficiarios</h1>
      <p class="text-blue-100">
        Este módulo permite gestionar los beneficiarios de las remesas. Aquí podrás:
      </p>
      <ul class="mt-2 space-y-1 text-blue-100">
        <li class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          Visualizar todos los beneficiarios registrados
        </li>
        <li class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          Asociar beneficiarios con clientes para remesas manuales
        </li>
        <li class="flex items-center">
          <i class="fas fa-check-circle mr-2"></i>
          Ver el historial de remesas por beneficiario
        </li>
      </ul>
    </div>

    <!-- Tabla de Beneficiarios -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Lista de Beneficiarios</h2>
      </div>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beneficiario</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Documento</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente Asociado</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Remesa</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="beneficiario in beneficiarios" 
              :key="beneficiario.id"
              @click="verDetalles(beneficiario)"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ beneficiario.nombre }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ beneficiario.telefono }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.tipoDocumento }}: {{ beneficiario.documento }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.cliente }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.ultimaRemesa }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center">
              <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalles -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="mostrarModal" 
           class="fixed inset-0 z-50 overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Detalles del Beneficiario
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Información completa y opciones de gestión
              </p>
            </div>

            <div v-if="beneficiarioSeleccionado" class="space-y-4">
              <!-- Información del Beneficiario -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.nombre }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Documento</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.tipoDocumento }}: {{ beneficiarioSeleccionado.documento }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.telefono }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Cliente Asociado</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.cliente }}</p>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Remesas</p>
                    <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.totalRemesas }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Última Remesa</p>
                    <p class="text-sm text-gray-900 dark:text-white">{{ beneficiarioSeleccionado.ultimaRemesa }}</p>
                  </div>
                </div>
              </div>

              <!-- Asociar Cliente -->
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asociar con Cliente
                </label>
                <div class="flex space-x-2">
                  <input 
                    type="text" 
                    v-model="nuevoCliente"
                    placeholder="Nombre del cliente"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button 
                    @click="asociarCliente(nuevoCliente)"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Asociar
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                @click="cerrarModal"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 