<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Encabezado -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Remesa</h1>
            <p class="text-gray-600 dark:text-gray-400">Número: {{ numeroComprobante }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span 
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="{
                'bg-yellow-100 text-yellow-800': estado === 'En proceso',
                'bg-green-100 text-green-800': estado === 'Realizada',
                'bg-red-100 text-red-800': estado === 'Cancelada'
              }"
            >
              {{ estado }}
            </span>
            <button 
              v-if="estado === 'En proceso'"
              @click="cancelarRemesa"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancelar Remesa
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Detalles de la Transacción -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Detalles de la Transacción</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Monto Enviado:</span>
              <span class="font-medium">{{ datosTransaccion.montoEnviarFormateado }} SEK</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Monto a Recibir:</span>
              <span class="font-medium">{{ datosTransaccion.montoRecibirFormateado }} {{ datosTransaccion.pais?.moneda }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Tipo de Cambio:</span>
              <span class="font-medium">1 SEK = {{ datosTransaccion.tipoCambio }} {{ datosTransaccion.pais?.moneda }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">País Destino:</span>
              <span class="font-medium">{{ datosTransaccion.pais?.nombre }}</span>
            </div>
          </div>
        </div>

        <!-- Detalles de Recepción -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Detalles de Recepción</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Método:</span>
              <span class="font-medium">{{ datosRecepcion.tipoFormateado }}</span>
            </div>
            <template v-if="datosRecepcion.tipo === 'qr'">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Beneficiario:</span>
                <span class="font-medium">{{ datosRecepcion.nombreBeneficiario }}</span>
              </div>
            </template>
            <template v-if="datosRecepcion.tipo === 'cuenta'">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Titular:</span>
                <span class="font-medium">{{ datosRecepcion.cuenta.titular }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Banco:</span>
                <span class="font-medium">{{ datosRecepcion.cuenta.banco }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">N° Cuenta:</span>
                <span class="font-medium">{{ datosRecepcion.cuenta.numeroCuenta }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Detalles de Pago -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Detalles de Pago</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Método:</span>
              <span class="font-medium">{{ datosPago.tipoFormateado }}</span>
            </div>
            <template v-if="datosPago.tipo === 'swish'">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Número Swish:</span>
                <span class="font-medium">{{ datosPago.numero }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Referencia:</span>
                <span class="font-medium">{{ datosPago.referencia }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- Tiempo Estimado -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tiempo Estimado</h2>
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <i class="fas fa-clock text-blue-500"></i>
              <span class="text-gray-600 dark:text-gray-400">
                Tiempo estimado de procesamiento: 
                <span class="font-medium">
                  {{ datosRecepcion.tipo === 'qr' ? '30 minutos' : '60 minutos' }}
                </span>
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <i class="fas fa-calendar-alt text-blue-500"></i>
              <span class="text-gray-600 dark:text-gray-400">
                Horario de atención: 
                <span class="font-medium">Lunes a Sábado, 7:00 AM - 7:00 PM</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="mt-6 flex justify-end space-x-4">
        <button 
          @click="editarRemesa"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Editar Remesa
        </button>
        <button 
          @click="descargarComprobante"
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Descargar Comprobante
        </button>
      </div>
    </div>

    <!-- Modal de Confirmación de Cancelación -->
    <div v-if="mostrarConfirmacionCancelacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Cancelación</h3>
        <p class="mb-6">¿Está seguro que desea cancelar esta remesa? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="mostrarConfirmacionCancelacion = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            No Cancelar
          </button>
          <button 
            @click="confirmarCancelacion"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sí, Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRemesaStore } from '../store/remesa'
import { useRouter } from 'vue-router'

const store = useRemesaStore()
const router = useRouter()

const estado = ref('En proceso')
const mostrarConfirmacionCancelacion = ref(false)

// Usar los datos del store
const datosTransaccion = computed(() => store.datosTransaccion)
const datosRecepcion = computed(() => store.datosRecepcion)
const datosPago = computed(() => store.datosPago)
const numeroComprobante = computed(() => store.numeroComprobante)

const cancelarRemesa = () => {
  mostrarConfirmacionCancelacion.value = true
}

const confirmarCancelacion = () => {
  estado.value = 'Cancelada'
  mostrarConfirmacionCancelacion.value = false
  // Aquí iría la lógica para actualizar el estado en el backend
}

const editarRemesa = () => {
  router.push('/cliente/remesas')
}

const descargarComprobante = () => {
  // Aquí iría la lógica para descargar el comprobante
}
</script>
