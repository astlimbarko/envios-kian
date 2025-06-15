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
  }
})

const emit = defineEmits(['actualizarEstado', 'cerrar'])
const mostrarQRZoom = ref(false)
const mostrarModalIncidencia = ref(false)
const descripcionIncidencia = ref('')
const incidenciaReportada = ref(false)
const mostrarConfirmacionCancelar = ref(false)
const comprobanteSubido = ref(false)
const comprobanteArchivo = ref(null)
const comprobantePreview = ref(null)

const actualizarEstado = (nuevoEstado, descripcion = '') => {
  if (nuevoEstado === 'completada') {
    if (!comprobanteSubido.value) {
      alert('Debes subir el comprobante antes de finalizar la remesa')
      return
    }
    // Si hay comprobante, proceder con la actualización
    emit('actualizarEstado', props.remesa.id, nuevoEstado, descripcion)
    // Cerrar la remesa y volver a la lista
    setTimeout(() => {
      emit('cerrar')
    }, 100)
  } else {
    // Para otros estados, proceder normalmente
    emit('actualizarEstado', props.remesa.id, nuevoEstado, descripcion)
    if (nuevoEstado === 'incidencia') {
      mostrarModalIncidencia.value = false
      descripcionIncidencia.value = ''
    }
  }
}

const reportarIncidencia = () => {
  mostrarModalIncidencia.value = true
  incidenciaReportada.value = false
  descripcionIncidencia.value = ''
}

const confirmarIncidencia = () => {
  if (!descripcionIncidencia.value.trim()) {
    alert('Debes escribir una descripción de la incidencia')
    return
  }
  actualizarEstado('incidencia', descripcionIncidencia.value)
  incidenciaReportada.value = true
  mostrarModalIncidencia.value = false
}

const reanudarProceso = () => {
  actualizarEstado('pendiente')
  incidenciaReportada.value = false
}

const solicitarCancelacion = () => {
  mostrarConfirmacionCancelar.value = true
}

const confirmarCancelacion = () => {
  actualizarEstado('cancelada')
  mostrarConfirmacionCancelar.value = false
}

const cancelarCancelacion = () => {
  mostrarConfirmacionCancelar.value = false
}

const toggleQRZoom = () => {
  mostrarQRZoom.value = !mostrarQRZoom.value
}

const handleKeyPress = (event) => {
  if (mostrarQRZoom.value && event.key === 'Escape') {
    mostrarQRZoom.value = false
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    comprobanteArchivo.value = file
    comprobanteSubido.value = true
    
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      comprobantePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
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
  <div class="h-full flex flex-col">
    <!-- Contenido principal -->
    <div class="flex-1 space-y-2 overflow-y-auto">
      <!-- Estado y Monto -->
      <div :class="`bg-gradient-to-br ${getEstadoGradient(remesa.estado)} p-3 rounded-lg text-white`">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-xs font-medium opacity-80">Estado Actual</p>
            <p class="text-base font-bold mt-0.5">{{ remesa.estado === 'completada' ? 'Procesado' : 'Procesando' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium opacity-80">Monto Total</p>
            <p class="text-base font-bold mt-0.5">{{ formatearMoneda(remesa.monto, remesa.moneda) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <!-- Columna izquierda -->
        <div class="space-y-2 md:col-span-2">
          <!-- Información del Remitente -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Información del Remitente
            </h3>
            <div class="space-y-1.5">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ remesa.cliente }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ remesa.telefono || 'No disponible' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Documentos</p>
                <div class="mt-1 space-y-1">
                  <div v-for="doc in remesa.documentos" :key="doc.numero" 
                       class="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-1.5 rounded">
                    <span class="text-xs text-gray-900 dark:text-white">{{ doc.tipo }}: {{ doc.numero }}</span>
                    <i :class="doc.estado === 'verificado' ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del Beneficiario -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Información del Beneficiario
            </h3>
            <div class="space-y-1.5">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ remesa.beneficiario }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ remesa.telefonoBeneficiario || 'No disponible' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha -->
        <div class="space-y-2">
          <!-- Información de Pago -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Información de Pago
            </h3>
            
            <!-- QR -->
            <div v-if="remesa.tipoPago === 'qr'" class="text-center">
              <img :src="QR" 
                   alt="Código QR" 
                   class="mx-auto mb-1 w-24 h-24 cursor-pointer hover:opacity-90 transition-opacity" 
                   @click="toggleQRZoom" />
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Haz clic para ampliar el código QR
              </p>
            </div>

            <!-- Datos Bancarios -->
            <div v-else class="space-y-1.5">
              <div class="grid grid-cols-1 gap-1.5">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Entidad</p>
                  <p class="text-xs text-gray-900 dark:text-white">{{ remesa.datosBancarios.entidad }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">N° Cuenta</p>
                  <p class="text-xs text-gray-900 dark:text-white">{{ remesa.datosBancarios.numeroCuenta }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Tipo</p>
                  <p class="text-xs text-gray-900 dark:text-white">{{ remesa.datosBancarios.tipoCuenta }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Sucursal</p>
                  <p class="text-xs text-gray-900 dark:text-white">{{ remesa.datosBancarios.sucursal }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Comprobante de Pago -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-3">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Comprobante de Pago
            </h3>
            
            <div class="space-y-2">
              <!-- Preview del comprobante -->
              <div v-if="comprobantePreview" class="relative">
                <img :src="comprobantePreview" 
                     alt="Comprobante" 
                     class="w-full h-32 object-contain rounded-lg border border-gray-200 dark:border-gray-600" />
                <button 
                  v-if="remesa.estado !== 'completada'"
                  @click="comprobantePreview = null; comprobanteArchivo = null; comprobanteSubido = false"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <i class="fas fa-times text-xs"></i>
                </button>
              </div>

              <!-- Uploader -->
              <div v-else class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center">
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  @change="handleFileUpload"
                  class="hidden"
                  id="comprobante-upload"
                />
                <label 
                  for="comprobante-upload"
                  class="cursor-pointer block"
                >
                  <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-1"></i>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Haz clic para subir el comprobante
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Formatos: JPG, PNG, PDF
                  </p>
                </label>
              </div>

              <!-- Estado del comprobante -->
              <div class="flex items-center justify-between text-xs">
                <span :class="[
                  'px-2 py-1 rounded-full',
                  comprobanteSubido 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                ]">
                  <i :class="comprobanteSubido ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-1"></i>
                  {{ comprobanteSubido ? 'Comprobante subido' : 'Pendiente de subir' }}
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  Obligatorio para finalizar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Acciones -->
    <div class="mt-2 p-2 bg-white dark:bg-gray-700 rounded-lg shadow">
      <div class="flex justify-between items-center space-x-2">
        <!-- Botón único después de reportar incidencia -->
        <button 
          v-if="incidenciaReportada"
          @click="reanudarProceso"
          class="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
        >
          <i class="fas fa-play mr-1"></i>
          Reanudar Proceso
        </button>

        <!-- Botones normales cuando no hay incidencia reportada -->
        <template v-else>
          <button 
            v-if="remesa.estado === 'pendiente'"
            @click="reportarIncidencia"
            class="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs"
          >
            <i class="fas fa-exclamation-triangle mr-1"></i>
            Reportar Incidencia
          </button>
          <button 
            v-if="remesa.estado === 'incidencia'"
            @click="actualizarEstado('pendiente')"
            class="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
          >
            <i class="fas fa-check mr-1"></i>
            Incidencia solucionada
          </button>
          <button 
            v-if="remesa.estado === 'pendiente'"
            @click="actualizarEstado('completada')"
            :disabled="!comprobanteSubido"
            :class="[
              'flex-1 px-3 py-1.5 text-white rounded-lg transition-colors text-xs relative group',
              comprobanteSubido 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            ]"
          >
            <i class="fas fa-check-circle mr-1"></i>
            Remesa completada
            <span v-if="!comprobanteSubido" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Subir comprobante primero
            </span>
          </button>
          <button 
            v-if="remesa.estado === 'cancelada'"
            @click="actualizarEstado('pendiente')"
            class="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
          >
            <i class="fas fa-redo mr-1"></i>
            Reactivar
          </button>
          <button 
            v-if="['pendiente', 'incidencia'].includes(remesa.estado)"
            @click="solicitarCancelacion"
            class="flex-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs"
          >
            <i class="fas fa-ban mr-1"></i>
            Cancelar
          </button>
        </template>
      </div>
    </div>

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
                required
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
                @click="confirmarIncidencia"
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

    <!-- Modal de Confirmación de Cancelación -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="mostrarConfirmacionCancelar" 
           class="fixed inset-0 z-[70] overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Cancelación
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ¿Estás seguro de que deseas cancelar esta remesa? Esta acción no se puede deshacer.
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="cancelarCancelacion"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Volver
              </button>
              <button
                @click="confirmarCancelacion"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Confirmar Cancelación
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