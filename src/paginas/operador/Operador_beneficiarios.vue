/**
 * Componente: Operador_beneficiarios.vue
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
    clientes: ['Juan Pérez', 'Ana Martínez'],
    ultimaRemesa: '2024-03-20',
    totalRemesas: 5,
    ubicacion: 'La Paz, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'DNI', numero: '12345678', estado: 'Verificado' },
      { tipo: 'Pasaporte', numero: 'AB123456', estado: 'Verificado' }
    ]
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    documento: '87654321',
    tipoDocumento: 'DNI',
    telefono: '+591 71234567',
    clientes: ['Pedro López', 'María Fernández'],
    ultimaRemesa: '2024-03-19',
    totalRemesas: 3,
    ubicacion: 'Santa Cruz, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'DNI', numero: '87654321', estado: 'Verificado' }
    ]
  },
  {
    id: 3,
    nombre: 'Ana Martínez',
    documento: '98765432',
    tipoDocumento: 'Pasaporte',
    telefono: '+591 72345678',
    clientes: ['Juan Pérez', 'Carlos Rodríguez'],
    ultimaRemesa: '2024-03-18',
    totalRemesas: 7,
    ubicacion: 'Cochabamba, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'Pasaporte', numero: 'CD987654', estado: 'Verificado' },
      { tipo: 'DNI', numero: '98765432', estado: 'Pendiente' }
    ]
  },
  {
    id: 4,
    nombre: 'Roberto Sánchez',
    documento: '76543210',
    tipoDocumento: 'Carnet',
    telefono: '+591 73456789',
    clientes: ['Laura Gómez'],
    ultimaRemesa: '2024-03-17',
    totalRemesas: 2,
    ubicacion: 'Sucre, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'Carnet', numero: 'EF765432', estado: 'Verificado' }
    ]
  },
  {
    id: 5,
    nombre: 'Patricia López',
    documento: '65432109',
    tipoDocumento: 'DNI',
    telefono: '+591 74567890',
    clientes: ['Miguel Torres', 'Ana Martínez', 'Carlos Rodríguez'],
    ultimaRemesa: '2024-03-16',
    totalRemesas: 4,
    ubicacion: 'Oruro, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'DNI', numero: '65432109', estado: 'Verificado' },
      { tipo: 'Pasaporte', numero: 'GH654321', estado: 'Verificado' }
    ]
  },
  {
    id: 6,
    nombre: 'Miguel Torres',
    documento: '54321098',
    tipoDocumento: 'DNI',
    telefono: '+591 75678901',
    clientes: ['Patricia López'],
    ultimaRemesa: '2024-03-15',
    totalRemesas: 3,
    ubicacion: 'Tarija, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'DNI', numero: '54321098', estado: 'Verificado' }
    ]
  },
  {
    id: 7,
    nombre: 'Laura Gómez',
    documento: '43210987',
    tipoDocumento: 'Pasaporte',
    telefono: '+591 76789012',
    clientes: ['Roberto Sánchez', 'Ana Martínez'],
    ultimaRemesa: '2024-03-14',
    totalRemesas: 6,
    ubicacion: 'Potosí, Bolivia',
    estado: 'Activo',
    documentos: [
      { tipo: 'Pasaporte', numero: 'IJ432109', estado: 'Verificado' },
      { tipo: 'DNI', numero: '43210987', estado: 'Verificado' }
    ]
  }
])

const beneficiarioSeleccionado = ref(null)
const mostrarModal = ref(false)
const nuevoCliente = ref('')
const mostrarModalNuevo = ref(false)
const nuevoBeneficiario = ref({
  nombre: '',
  documento: '',
  tipoDocumento: 'DNI',
  telefono: '',
  ubicacion: '',
  documentos: []
})

// Funciones
const verDetalles = (beneficiario) => {
  beneficiarioSeleccionado.value = beneficiario
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  beneficiarioSeleccionado.value = null
}

const agregarCliente = () => {
  if (nuevoCliente.value && beneficiarioSeleccionado.value) {
    if (!beneficiarioSeleccionado.value.clientes.includes(nuevoCliente.value)) {
      beneficiarioSeleccionado.value.clientes.push(nuevoCliente.value)
    }
    nuevoCliente.value = ''
  }
}

const eliminarCliente = (cliente) => {
  if (beneficiarioSeleccionado.value) {
    beneficiarioSeleccionado.value.clientes = beneficiarioSeleccionado.value.clientes.filter(c => c !== cliente)
  }
}

const crearBeneficiario = () => {
  // Aquí iría la lógica para guardar en la base de datos
  beneficiarios.value.push({
    id: Date.now(),
    ...nuevoBeneficiario.value,
    clientes: [],
    ultimaRemesa: null,
    totalRemesas: 0
  })
  mostrarModalNuevo.value = false
  nuevoBeneficiario.value = {
    nombre: '',
    documento: '',
    tipoDocumento: 'DNI',
    telefono: '',
    ubicacion: '',
    documentos: []
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Encabezado con Explicación -->
    <div class="bg-white rounded-lg p-4 text-gray-800 shadow-lg max-w-2xl mx-auto border border-gray-200">
      <h1 class="text-xl font-bold mb-2">Gestión de Beneficiarios</h1>
      <p class="text-gray-600 mb-2">
        Este módulo permite gestionar los beneficiarios de las remesas. Aquí podrás:
      </p>
      <ul class="list-disc list-inside space-y-1 text-gray-600">
        <li>Visualizar todos los beneficiarios registrados</li>
        <li>Asociar beneficiarios con múltiples clientes</li>
        <li>Ver el historial de remesas por beneficiario</li>
        <li>Gestionar documentos y estados de verificación</li>
        <li>Administrar la información personal de cada beneficiario</li>
      </ul>
    </div>

    <!-- Botón Nuevo Beneficiario -->
    <div class="flex justify-end">
      <button 
        @click="mostrarModalNuevo = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        Nuevo Beneficiario
      </button>
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
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clientes Asociados</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Remesa</th>
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
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span v-for="cliente in beneficiario.clientes" 
                      :key="cliente"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ cliente }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.ultimaRemesa || 'Sin remesas' }}</div>
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
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-3xl">
            <div class="mb-4 border-b pb-3">
              <h3 class="text-lg font-semibold text-gray-900">
                Detalles del Beneficiario
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Información completa y opciones de gestión
              </p>
            </div>

            <div v-if="beneficiarioSeleccionado" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Columna Izquierda -->
                <div class="space-y-4">
                  <!-- Información Personal -->
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Información Personal</h4>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-xs font-medium text-gray-500">Nombre:</span>
                        <span class="text-sm text-gray-900">{{ beneficiarioSeleccionado.nombre }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs font-medium text-gray-500">Documento:</span>
                        <span class="text-sm text-gray-900">{{ beneficiarioSeleccionado.tipoDocumento }}: {{ beneficiarioSeleccionado.documento }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs font-medium text-gray-500">Teléfono:</span>
                        <span class="text-sm text-gray-900">{{ beneficiarioSeleccionado.telefono }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs font-medium text-gray-500">Ubicación:</span>
                        <span class="text-sm text-gray-900">{{ beneficiarioSeleccionado.ubicacion }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Documentos -->
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Documentos</h4>
                    <div class="space-y-2">
                      <div v-for="doc in beneficiarioSeleccionado.documentos" 
                           :key="doc.numero"
                           class="flex items-center justify-between bg-white p-2 rounded">
                        <span class="text-sm text-gray-900">{{ doc.tipo }}: {{ doc.numero }}</span>
                        <span :class="[
                          'px-2 py-0.5 text-xs rounded-full',
                          doc.estado === 'Verificado' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        ]">
                          {{ doc.estado }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Columna Derecha -->
                <div class="space-y-4">
                  <!-- Estadísticas -->
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Estadísticas</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs font-medium text-gray-500">Total Remesas</p>
                        <p class="text-lg font-semibold text-gray-900">{{ beneficiarioSeleccionado.totalRemesas }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500">Última Remesa</p>
                        <p class="text-sm text-gray-900">{{ beneficiarioSeleccionado.ultimaRemesa || 'Sin remesas' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Clientes Asociados -->
                  <div class="bg-gray-50 p-3 rounded-lg">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Clientes Asociados</h4>
                    <div class="space-y-3">
                      <!-- Lista de Clientes -->
                      <div class="flex flex-wrap gap-2">
                        <span v-for="cliente in beneficiarioSeleccionado.clientes" 
                              :key="cliente"
                              class="inline-flex items-center px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                          {{ cliente }}
                          <button 
                            @click.stop="eliminarCliente(cliente)"
                            class="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </span>
                      </div>

                      <!-- Agregar Cliente -->
                      <div class="flex space-x-2">
                        <input 
                          type="text" 
                          v-model="nuevoCliente"
                          placeholder="Nombre del cliente"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                        <button 
                          @click="agregarCliente"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
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

    <!-- Modal para Agregar Beneficiario -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="mostrarModalNuevo" 
           class="fixed inset-0 z-50 overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-2xl">
            <div class="mb-4 border-b pb-3">
              <h3 class="text-lg font-semibold text-gray-900">
                Agregar Nuevo Beneficiario
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Complete la información del beneficiario
              </p>
            </div>

            <form @submit.prevent="crearBeneficiario" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Columna Izquierda -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input 
                      type="text" 
                      v-model="nuevoBeneficiario.nombre"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                    <select 
                      v-model="nuevoBeneficiario.tipoDocumento"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Carnet">Carnet</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Número de Documento</label>
                    <input 
                      type="text" 
                      v-model="nuevoBeneficiario.documento"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <!-- Columna Derecha -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input 
                      type="tel" 
                      v-model="nuevoBeneficiario.telefono"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Ubicación</label>
                    <input 
                      type="text" 
                      v-model="nuevoBeneficiario.ubicacion"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Cliente Asociado</label>
                    <input 
                      type="text" 
                      v-model="nuevoBeneficiario.clienteInicial"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  @click="cerrarModalNuevo"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Beneficiario
                </button>
              </div>
            </form>
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