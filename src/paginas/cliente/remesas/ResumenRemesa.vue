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
import { ref, computed, watch, onMounted } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const logoKian = '/kian-logo.svg'
const reciboGenerado = ref(true)

// Datos del recibo en construcción
const datosRecibo = ref({
  fecha: '',
  numeroComprobante: '',
  transaccion: {
    montoEnviar: '',
    montoRecibir: '',
    tipoCambio: '',
    pais: {
      nombre: '',
      moneda: ''
    }
  },
  recepcion: {
    tipo: '',
    datos: null
  },
  pago: {
    tipo: '',
    datos: null
  }
})

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

const emit = defineEmits(['confirmar'])
const aceptoTerminos = ref(false)

// Observar cambios en los datos y actualizar el recibo en construcción
watch(() => props.datos, (nuevosDatos) => {
  if (!nuevosDatos) return

  // Actualizar datos de transacción
  datosRecibo.value.transaccion = {
    montoEnviar: nuevosDatos.montoEnviar,
    montoRecibir: nuevosDatos.montoRecibir,
    tipoCambio: nuevosDatos.tipoCambio,
    pais: {
      nombre: nuevosDatos.pais?.nombre || '',
      moneda: nuevosDatos.pais?.moneda || ''
    }
  }

  // Actualizar datos de recepción
  if (nuevosDatos.metodoRecepcion) {
    datosRecibo.value.recepcion = {
      tipo: nuevosDatos.metodoRecepcion.tipo,
      datos: nuevosDatos.metodoRecepcion.tipo === 'qr' 
        ? {
            nombreBeneficiario: nuevosDatos.metodoRecepcion.nombreBeneficiario,
            qr: nuevosDatos.metodoRecepcion.qr
          }
        : {
            titular: nuevosDatos.metodoRecepcion.cuenta?.titular,
            banco: nuevosDatos.metodoRecepcion.cuenta?.banco,
            numeroCuenta: nuevosDatos.metodoRecepcion.cuenta?.numeroCuenta,
            tipoCuenta: nuevosDatos.metodoRecepcion.cuenta?.tipoCuenta,
            sucursal: nuevosDatos.metodoRecepcion.cuenta?.sucursal
          }
    }
  }

  // Actualizar datos de pago
  if (nuevosDatos.metodoPago) {
    datosRecibo.value.pago = {
      tipo: nuevosDatos.metodoPago.tipo,
      datos: nuevosDatos.metodoPago.tipo === 'swish'
        ? {
            numero: nuevosDatos.metodoPago.numero,
            referencia: nuevosDatos.metodoPago.referencia
          }
        : {
            banco: nuevosDatos.metodoPago.banco,
            cuenta: nuevosDatos.metodoPago.cuenta,
            swift: nuevosDatos.metodoPago.swift,
            titular: nuevosDatos.metodoPago.titular
          }
    }
  }
}, { deep: true, immediate: true })

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
  return datosRecibo.value.recepcion.tipo === 'qr' ? 'Código QR' : 'Cuenta Bancaria'
})

// Formatear el método de pago para mostrar
const metodoPagoFormateado = computed(() => {
  return datosRecibo.value.pago.tipo === 'swish' ? 'Swish' : 'Transferencia Bancaria'
})

// Confirmar la remesa
const confirmarRemesa = () => {
  if (aceptoTerminos.value) {
    emit('confirmar', {
      numeroComprobante: numeroComprobante.value,
      fecha: fechaActual.value,
      ...datosRecibo.value
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-[15px] text-gray-800 dark:text-gray-200 space-y-6">
      <!-- Logo y Encabezado -->
      <div class="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <img :src="logoKian" alt="KIAN Logo" class="h-12 mx-auto mb-4">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Recibo de Remesa</h1>
      </div>

      <!-- Información general -->
      <div class="grid grid-cols-2 gap-y-2">
        <div class="text-gray-600 dark:text-gray-400 font-medium">Fecha:</div>
        <div>{{ fechaActual }}</div>

        <div class="text-gray-600 dark:text-gray-400 font-medium">N° Comprobante:</div>
        <div>{{ numeroComprobante }}</div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Transacción -->
      <div>
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Transacción</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Cantidad enviada:</div>
          <div>{{ datosRecibo.transaccion.montoEnviar }} SEK</div>

          <div class="text-gray-600 dark:text-gray-400">Cantidad a recibir:</div>
          <div>{{ datosRecibo.transaccion.montoRecibir }} {{ datosRecibo.transaccion.pais.moneda }}</div>

          <div class="text-gray-600 dark:text-gray-400">Tipo de cambio:</div>
          <div>1 SEK = {{ datosRecibo.transaccion.tipoCambio }} {{ datosRecibo.transaccion.pais.moneda }}</div>

          <div class="text-gray-600 dark:text-gray-400">País destino:</div>
          <div>{{ datosRecibo.transaccion.pais.nombre }}</div>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de recepción -->
      <div v-if="datosRecibo.recepcion.tipo">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Método de Recepción</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ metodoRecepcionFormateado }}</div>

          <!-- Detalles para QR -->
          <template v-if="datosRecibo.recepcion.tipo === 'qr'">
            <div class="text-gray-600 dark:text-gray-400">Beneficiario:</div>
            <div>{{ datosRecibo.recepcion.datos.nombreBeneficiario }}</div>

            <div class="text-gray-600 dark:text-gray-400">Código QR:</div>
            <div class="flex justify-center">
              <div class="w-40 h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <img 
                  v-if="datosRecibo.recepcion.datos.qr" 
                  :src="datosRecibo.recepcion.datos.qr" 
                  alt="Código QR" 
                  class="max-w-full max-h-full"
                >
                <i v-else class="fas fa-qrcode text-4xl text-gray-400 dark:text-gray-500"></i>
              </div>
            </div>
          </template>

          <!-- Detalles para cuenta bancaria -->
          <template v-if="datosRecibo.recepcion.tipo === 'banco'">
            <div class="text-gray-600 dark:text-gray-400">Titular:</div>
            <div>{{ datosRecibo.recepcion.datos.titular }}</div>

            <div class="text-gray-600 dark:text-gray-400">Banco:</div>
            <div>{{ datosRecibo.recepcion.datos.banco }}</div>

            <div class="text-gray-600 dark:text-gray-400">N° de Cuenta:</div>
            <div>{{ datosRecibo.recepcion.datos.numeroCuenta }}</div>

            <div class="text-gray-600 dark:text-gray-400">Tipo de Cuenta:</div>
            <div>{{ datosRecibo.recepcion.datos.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</div>

            <div class="text-gray-600 dark:text-gray-400">Sucursal:</div>
            <div>{{ datosRecibo.recepcion.datos.sucursal }}</div>
          </template>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de pago -->
      <div v-if="datosRecibo.pago.tipo">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Método de Pago</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ metodoPagoFormateado }}</div>
        </div>
      </div>

      <!-- Comprobante de pago -->
      <div v-if="props.datos.metodoPago?.comprobante" class="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Comprobante de Pago</h2>
        <div class="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <i class="fas fa-file-image text-4xl text-gray-400 dark:text-gray-500"></i>
        </div>
      </div>

      <!-- Pie -->
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
        <p>La remesa será procesada una vez confirmada la recepción de fondos.</p>
        <p>Este documento no tiene validez para crédito fiscal.</p>
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-center space-x-2">
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
      <div class="flex justify-end">
        <button 
          @click="confirmarRemesa"
          :disabled="!aceptoTerminos"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Remesa
        </button>
      </div>
    </div>
  </div>
</template> 