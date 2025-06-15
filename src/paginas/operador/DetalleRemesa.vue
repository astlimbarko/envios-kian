/**
 * Componente: DetalleRemesa.vue
 * 
 * Este componente muestra los detalles completos de una remesa,
 * incluyendo información del remitente, beneficiario, documentos,
 * y opciones de procesamiento.
 */

<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import QR from '../../assets/QR.png'

const props = defineProps({
  remesa: {
    type: Object,
    required: true
  },
  mostrar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cerrar', 'actualizarEstado'])
const mostrarQRZoom = ref(false)
const mostrarModalIncidencia = ref(false)
const descripcionIncidencia = ref('')

const cerrar = () => {
  emit('cerrar')
}

const actualizarEstado = (nuevoEstado, descripcion = '') => {
  emit('actualizarEstado', props.remesa.id, nuevoEstado, descripcion)
  if (nuevoEstado === 'incidencia') {
    mostrarModalIncidencia.value = false
    descripcionIncidencia.value = ''
  }
}

const reportarIncidencia = () => {
  mostrarModalIncidencia.value = true
}

const toggleQRZoom = () => {
  mostrarQRZoom.value = !mostrarQRZoom.value
}

const handleKeyPress = (event) => {
  if (mostrarQRZoom.value && event.key === 'Escape') {
    mostrarQRZoom.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

const getEstadoClass = (estado) => {
  const clases = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    incidencia: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelada: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return clases[estado] || clases.pendiente
}

const getEstadoGradient = (estado) => {
  const gradientes = {
    pendiente: 'from-yellow-400 to-yellow-600',
    incidencia: 'from-red-500 to-red-700',
    cancelada: 'from-gray-600 to-gray-800'
  }
  return gradientes[estado] || gradientes.pendiente
}

const formatearMoneda = (monto, moneda) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda
  }).format(monto)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="mostrar" 
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal="true">
      <!-- Fondo oscuro -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
           @click="cerrar"></div>

      <!-- Contenido del modal -->
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-4xl">
          <!-- Encabezado -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                Remesa {{ remesa.numero }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Creada el {{ remesa.fechaCreacion }}
              </p>
            </div>
            <button @click="cerrar" 
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Contenido principal -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Columna izquierda -->
            <div class="space-y-4 md:col-span-2">
              <!-- Estado y Monto -->
              <div :class="`bg-gradient-to-br ${getEstadoGradient(remesa.estado)} p-4 rounded-lg text-white`">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium opacity-80">Estado Actual</p>
                    <p class="text-lg font-bold mt-1">{{ remesa.estado }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium opacity-80">Monto Total</p>
                    <p class="text-lg font-bold mt-1">{{ formatearMoneda(remesa.monto, remesa.moneda) }}</p>
                  </div>
                </div>
              </div>

              <!-- Información del Remitente -->
              <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Información del Remitente
                </h3>
                <div class="space-y-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                    <p class="text-gray-900 dark:text-white">{{ remesa.cliente }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                    <p class="text-gray-900 dark:text-white">{{ remesa.telefono || 'No disponible' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Documentos</p>
                    <div class="mt-1 space-y-1">
                      <div v-for="doc in remesa.documentos" :key="doc.numero" 
                           class="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-2 rounded">
                        <span class="text-sm text-gray-900 dark:text-white">{{ doc.tipo }}: {{ doc.numero }}</span>
                        <i :class="doc.estado === 'verificado' ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información del Beneficiario -->
              <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Información del Beneficiario
                </h3>
                <div class="space-y-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                    <p class="text-gray-900 dark:text-white">{{ remesa.beneficiario }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                    <p class="text-gray-900 dark:text-white">{{ remesa.telefonoBeneficiario || 'No disponible' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Columna derecha -->
            <div class="space-y-4">
              <!-- Información de Pago -->
              <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Información de Pago
                </h3>
                
                <!-- QR -->
                <div v-if="remesa.tipoPago === 'qr'" class="text-center">
                  <img :src="QR" 
                       alt="Código QR" 
                       class="mx-auto mb-2 w-32 h-32 cursor-pointer hover:opacity-90 transition-opacity" 
                       @click="toggleQRZoom" />
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Haz clic para ampliar el código QR
                  </p>
                </div>

                <!-- Datos Bancarios -->
                <div v-else class="space-y-2">
                  <div class="grid grid-cols-1 gap-2">
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Entidad</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ remesa.datosBancarios.entidad }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">N° Cuenta</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ remesa.datosBancarios.numeroCuenta }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ remesa.datosBancarios.tipoCuenta }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Sucursal</p>
                      <p class="text-sm text-gray-900 dark:text-white">{{ remesa.datosBancarios.sucursal }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Acciones
                </h3>
                <div class="grid grid-cols-1 gap-2">
                  <button 
                    v-if="remesa.estado === 'pendiente'"
                    @click="reportarIncidencia"
                    class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    Reportar Incidencia
                  </button>
                  <button 
                    v-if="remesa.estado === 'incidencia'"
                    @click="actualizarEstado('pendiente')"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <i class="fas fa-check mr-1"></i>
                    Incidencia solucionada
                  </button>
                  <button 
                    v-if="remesa.estado === 'pendiente'"
                    @click="actualizarEstado('completada')"
                    class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <i class="fas fa-check-circle mr-1"></i>
                    Finalizar Remesa
                  </button>
                  <button 
                    v-if="remesa.estado === 'cancelada'"
                    @click="actualizarEstado('pendiente')"
                    class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <i class="fas fa-redo mr-1"></i>
                    Reactivar
                  </button>
                  <button 
                    v-if="['pendiente', 'incidencia'].includes(remesa.estado)"
                    @click="actualizarEstado('cancelada')"
                    class="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <i class="fas fa-ban mr-1"></i>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Zoom QR -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="mostrarQRZoom" 
         class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75"
         @click="toggleQRZoom">
      <img :src="QR" 
           alt="Código QR Ampliado" 
           class="max-w-[80vw] max-h-[80vh] object-contain" />
    </div>
  </Transition>

  <!-- Modal de Incidencia -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="mostrarModalIncidencia" 
         class="fixed inset-0 z-[70] overflow-y-auto"
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal="true">
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Reportar Incidencia
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Describe el problema encontrado para notificar al cliente
            </p>
          </div>

          <div class="mb-4">
            <textarea
              v-model="descripcionIncidencia"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe la incidencia..."
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarModalIncidencia = false"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              @click="actualizarEstado('incidencia', descripcionIncidencia)"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              :disabled="!descripcionIncidencia.trim()"
            >
              Reportar Incidencia
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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