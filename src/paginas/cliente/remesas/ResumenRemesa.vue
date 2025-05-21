/**
 * Componente ResumenRemesa.vue
 * 
 * Este componente muestra un resumen completo de la remesa que el usuario está creando.
 * Recopila y muestra la información de todos los pasos anteriores:
 * 1. Formulario de envío (montos, tipo de cambio)
 * 2. Método de recepción (QR o cuenta bancaria)
 * 3. Método de pago (Swish o transferencia bancaria)
 * 
 * El componente espera recibir un objeto 'datos' con toda la información necesaria
 * y emite un evento 'confirmar' cuando el usuario acepta los términos y confirma la remesa.
 */

<script setup>
import { ref, computed } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  datos: {
    type: Object,
    required: true,
    default: () => ({
      // Datos del formulario de envío
      montoEnviar: '',
      montoRecibir: '',
      tipoCambio: '',
      comision: '',
      pais: {
        nombre: '',
        codigo: '',
        moneda: ''
      },
      // Datos del método de recepción
      metodoRecepcion: {
        tipo: '', // 'qr' o 'banco'
        esQR: false,
        qr: null,
        nombreBeneficiario: '',
        cuenta: {
          titular: '',
          banco: '',
          numeroCuenta: '',
          tipoCuenta: '',
          sucursal: ''
        }
      },
      // Datos del método de pago
      metodoPago: {
        tipo: '', // 'swish' o 'banco'
        numero: '',
        referencia: '',
        banco: '',
        cuenta: '',
        swift: '',
        titular: '',
        comprobante: null
      }
    })
  }
})

const aceptoTerminos = ref(false)
const emit = defineEmits(['confirmar'])

// Generar número de comprobante único
const numeroComprobante = computed(() => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `REM-${timestamp}-${random}`
})

// Fecha actual formateada
const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Formatear el método de recepción para mostrar
const metodoRecepcionFormateado = computed(() => {
  if (!props.datos?.metodoRecepcion?.tipo) return ''
  return props.datos.metodoRecepcion.tipo === 'qr' ? 'Código QR' : 'Cuenta Bancaria'
})

// Formatear el método de pago para mostrar
const metodoPagoFormateado = computed(() => {
  if (!props.datos?.metodoPago?.tipo) return ''
  return props.datos.metodoPago.tipo === 'swish' ? 'Swish' : 'Transferencia Bancaria'
})

// Validar si hay datos de recepción
const tieneDatosRecepcion = computed(() => {
  const recepcion = props.datos?.metodoRecepcion
  if (!recepcion) return false

  if (recepcion.tipo === 'qr') {
    return Boolean(recepcion.nombreBeneficiario)
  }

  if (recepcion.tipo === 'banco') {
    const cuenta = recepcion.cuenta
    return Boolean(
      cuenta?.titular &&
      cuenta?.banco &&
      cuenta?.numeroCuenta
    )
  }

  return false
})

// Validar si hay datos de pago
const tieneDatosPago = computed(() => {
  const pago = props.datos?.metodoPago
  if (!pago) return false

  if (pago.tipo === 'swish') {
    return Boolean(pago.numero)
  }

  if (pago.tipo === 'banco') {
    return Boolean(
      pago.banco &&
      pago.cuenta &&
      pago.titular
    )
  }

  return false
})

// Confirmar la remesa
const confirmarRemesa = () => {
  if (aceptoTerminos.value) {
    emit('confirmar', {
      numeroComprobante: numeroComprobante.value,
      fecha: fechaActual.value,
      ...props.datos
    })
  }
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Resumen de la Remesa
    </h2>

    <!-- Detalles de la transacción -->
    <div class="space-y-6">
      <!-- Montos y tipo de cambio -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detalles de la Transacción
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Monto a Enviar</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ datos.montoEnviar }} SEK
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Monto a Recibir</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ datos.montoRecibir }} {{ datos.pais?.moneda }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Tipo de Cambio</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              1 SEK = {{ datos.tipoCambio }} {{ datos.pais?.moneda }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">País de destino</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ datos.pais?.nombre }}
            </p>
          </div>
        </div>
      </div>

      <!-- Método de recepción -->
      <div v-if="tieneDatosRecepcion" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Método de Recepción
        </h3>
        <p class="text-base font-medium text-gray-900 dark:text-white mb-2">
          {{ metodoRecepcionFormateado }}
        </p>
        
        <!-- Detalles para QR -->
        <template v-if="datos.metodoRecepcion.tipo === 'qr'">
          <div class="mt-2 space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Nombre del beneficiario</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.nombreBeneficiario }}
              </p>
            </div>
            <div class="flex justify-center">
              <div class="w-40 h-40 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
                <i class="fas fa-qrcode text-4xl text-gray-400 dark:text-gray-500"></i>
              </div>
            </div>
          </div>
        </template>

        <!-- Detalles para cuenta bancaria -->
        <template v-if="datos.metodoRecepcion.tipo === 'banco'">
          <div class="mt-2 space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Titular</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.cuenta.titular }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Banco</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.cuenta.banco }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Número de cuenta</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.cuenta.numeroCuenta }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Tipo de cuenta</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.cuenta.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Sucursal</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoRecepcion.cuenta.sucursal }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- Método de pago -->
      <div v-if="tieneDatosPago" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Método de Pago
        </h3>
        <p class="text-base font-medium text-gray-900 dark:text-white mb-2">
          {{ metodoPagoFormateado }}
        </p>

        <!-- Detalles para Swish -->
        <template v-if="datos.metodoPago.tipo === 'swish'">
          <div class="mt-2 space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Número de Swish</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.numero }}
              </p>
            </div>
            <div v-if="datos.metodoPago.referencia">
              <p class="text-sm text-gray-500 dark:text-gray-400">Referencia</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.referencia }}
              </p>
            </div>
          </div>
        </template>

        <!-- Detalles para transferencia bancaria -->
        <template v-if="datos.metodoPago.tipo === 'banco'">
          <div class="mt-2 space-y-3">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Banco</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.banco }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Número de cuenta</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.cuenta }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Titular</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.titular }}
              </p>
            </div>
            <div v-if="datos.metodoPago.swift">
              <p class="text-sm text-gray-500 dark:text-gray-400">Código SWIFT</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">
                {{ datos.metodoPago.swift }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- Comprobante de pago -->
      <div v-if="datos.metodoPago?.comprobante" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Comprobante de Pago
        </h3>
        <div class="mt-2">
          <div class="w-full h-40 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center">
            <i class="fas fa-file-image text-4xl text-gray-400 dark:text-gray-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Términos y condiciones -->
    <div class="mt-6 flex items-center space-x-2">
      <input 
        type="checkbox" 
        id="terminos" 
        v-model="aceptoTerminos"
        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      >
      <label for="terminos" class="text-sm text-gray-600 dark:text-gray-400">
        Acepto los términos y condiciones
      </label>
    </div>

    <!-- Botón de envío -->
    <div class="mt-8 flex justify-end">
      <button 
        @click="confirmarRemesa"
        :disabled="!aceptoTerminos"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enviar Remesa
      </button>
    </div>
  </div>
</template> 