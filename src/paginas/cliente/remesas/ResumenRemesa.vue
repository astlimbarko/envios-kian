<script setup>
import { ref, computed } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  datos: {
    type: Object,
    required: true,
    default: () => ({
      montoEnviar: '',
      montoRecibir: '',
      tipoCambio: '',
      comision: '',
      metodoRecepcion: {
        metodo: '',
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
      metodoPago: {
        metodo: '',
        numero: '',
        referencia: '',
        nombreBeneficiario: '',
        banco: '',
        cuenta: '',
        swift: '',
        titular: ''
      },
      comprobantePago: null
    })
  }
})

const aceptoTerminos = ref(false)
const emit = defineEmits(['confirmar'])

// Datos de las cuentas bancarias
const cuentasBancarias = {
  suecia: {
    banco: 'Swedbank',
    cuenta: 'SE1234567890123456789012',
    swift: 'SWEDSESS',
    titular: 'KIAN AB',
    pais: 'Suecia'
  },
  estonia: {
    banco: 'SEB Bank Estonia',
    cuenta: 'EE123456789012345678',
    swift: 'SEBEE2X',
    titular: 'KIAN OÜ',
    pais: 'Estonia'
  }
}

// Generar número de comprobante único
const numeroComprobante = computed(() => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `REM-${timestamp}-${random}`
})

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const confirmarRemesa = () => {
  if (aceptoTerminos.value) {
    emit('confirmar', {
      numeroComprobante: numeroComprobante.value,
      fecha: fechaActual.value,
      ...props.datos
    })
  }
}

// Formatear el método de pago para mostrar
const metodoPagoFormateado = computed(() => {
  if (!props.datos?.metodoPago) return ''
  return props.datos.metodoPago.metodo === 'swish' ? 'Swish' : 'Transferencia Bancaria'
})

// Formatear el método de recepción para mostrar
const metodoRecepcionFormateado = computed(() => {
  if (!props.datos?.metodoRecepcion) return ''
  return props.datos.metodoRecepcion.metodo === 'qr' ? 'QR' : 'Transferencia Bancaria'
})

// Verificar si hay datos de recepción
const tieneDatosRecepcion = computed(() => {
  if (!props.datos?.metodoRecepcion) return false
  
  const { metodo, nombreBeneficiario, qr, cuenta } = props.datos.metodoRecepcion
  
  if (metodo === 'qr') {
    return Boolean(nombreBeneficiario && qr)
  }
  
  if (metodo === 'banco' && cuenta) {
    return Boolean(
      cuenta.titular &&
      cuenta.banco &&
      cuenta.numeroCuenta &&
      cuenta.tipoCuenta &&
      cuenta.sucursal
    )
  }
  
  return false
})

// Verificar si hay datos de pago
const tieneDatosPago = computed(() => {
  if (!props.datos?.metodoPago) return false
  
  const { metodo, numero, referencia, banco, cuenta, swift, titular, cuentas } = props.datos.metodoPago
  
  if (metodo === 'swish') {
    return Boolean(numero && referencia)
  }
  
  if (metodo === 'banco') {
    return Boolean(banco && cuenta && swift && titular) || Boolean(cuentas?.suecia && cuentas?.estonia)
  }
  
  return false
})

// Verificar si hay comprobante de pago
const tieneComprobantePago = computed(() => {
  return Boolean(props.datos?.metodoPago?.comprobantePago)
})
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <!-- Encabezado del comprobante -->
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Comprobante de Remesa</h2>
      <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>N° {{ numeroComprobante }}</span>
        <span>{{ fechaActual }}</span>
      </div>
    </div>

    <!-- Detalles de la transacción -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Detalles de la transacción</h3>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Monto a enviar</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ datos.montoEnviar }} SEK</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Monto a recibir</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ datos.montoRecibir }} PEN</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Tipo de cambio</p>
          <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.tipoCambio }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">Comisión</p>
          <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.comision }} SEK</p>
        </div>
      </div>
    </div>

    <!-- Método de recepción -->
    <div v-if="tieneDatosRecepcion" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Método de recepción</h3>
      <p class="text-base font-medium text-gray-900 dark:text-white mb-2">{{ metodoRecepcionFormateado }}</p>
      
      <!-- Detalles para QR -->
      <template v-if="datos.metodoRecepcion.metodo === 'qr'">
        <div class="mt-2 space-y-3">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Nombre del beneficiario</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoRecepcion.nombreBeneficiario }}</p>
          </div>
          <div v-if="datos.metodoRecepcion.qr" class="flex justify-center">
            <img :src="datos.metodoRecepcion.qr" class="w-40 h-40 object-contain rounded-xl border border-gray-200 dark:border-gray-700">
          </div>
        </div>
      </template>

      <!-- Detalles para cuenta bancaria -->
      <template v-if="datos.metodoRecepcion.metodo === 'banco'">
        <div class="mt-2 space-y-3">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Titular</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoRecepcion.cuenta.titular }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Banco</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoRecepcion.cuenta.banco }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Número de cuenta</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoRecepcion.cuenta.numeroCuenta }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tipo de cuenta</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">
              {{ datos.metodoRecepcion.cuenta.tipoCuenta === 'ahorro' ? 'Cuenta de Ahorro' : 'Cuenta Corriente' }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Sucursal</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoRecepcion.cuenta.sucursal }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Método de pago -->
    <div v-if="tieneDatosPago" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Método de pago</h3>
      <p class="text-base font-medium text-gray-900 dark:text-white mb-2">{{ metodoPagoFormateado }}</p>
      
      <!-- Detalles para Swish -->
      <template v-if="datos.metodoPago.metodo === 'swish'">
        <div class="mt-2 space-y-3">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Número de Swish</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.numero }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Referencia</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.referencia }}</p>
          </div>
          <div v-if="datos.metodoPago.nombreBeneficiario">
            <p class="text-sm text-gray-600 dark:text-gray-400">Nombre del beneficiario</p>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.nombreBeneficiario }}</p>
          </div>
        </div>
      </template>

      <!-- Detalles para transferencia bancaria -->
      <template v-if="datos.metodoPago.metodo === 'banco'">
        <div class="mt-2">
          <h4 class="text-base font-medium text-gray-900 dark:text-white mb-3">Detalles de las cuentas bancarias</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Cuenta en Suecia -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <h5 class="text-base font-medium text-gray-900 dark:text-white">Suecia</h5>
                <span class="text-sm text-blue-600 dark:text-blue-400">Cuenta Principal</span>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Banco</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas?.suecia?.banco || datos.metodoPago.banco }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Número de cuenta</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas?.suecia?.cuenta || datos.metodoPago.cuenta }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">SWIFT/BIC</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas?.suecia?.swift || datos.metodoPago.swift }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Titular</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas?.suecia?.titular || datos.metodoPago.titular }}</p>
                </div>
              </div>
            </div>

            <!-- Cuenta en Estonia -->
            <div v-if="datos.metodoPago.cuentas?.estonia" class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <h5 class="text-base font-medium text-gray-900 dark:text-white">Estonia</h5>
                <span class="text-sm text-green-600 dark:text-green-400">Cuenta Alternativa</span>
              </div>
              <div class="space-y-2">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Banco</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas.estonia.banco }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Número de cuenta</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas.estonia.cuenta }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">SWIFT/BIC</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas.estonia.swift }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Titular</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ datos.metodoPago.cuentas.estonia.titular }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Comprobante de pago -->
    <div v-if="tieneComprobantePago" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Comprobante de pago</h3>
      <div class="flex justify-center">
        <img v-if="datos.metodoPago.comprobantePago.type?.startsWith('image/')" 
             :src="URL.createObjectURL(datos.metodoPago.comprobantePago)" 
             class="w-40 h-40 object-contain rounded-xl border border-gray-200 dark:border-gray-700">
        <div v-else class="w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
          <i class="fas fa-file-pdf text-3xl text-red-500"></i>
        </div>
      </div>
    </div>

    <!-- Términos y condiciones -->
    <div class="flex items-center space-x-2 mb-4">
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

    <!-- Botón confirmar -->
    <div class="w-full">
      <BotonContinuar
        texto="Confirmar Remesa"
        colorInicial="green"
        :deshabilitado="!aceptoTerminos"
        @click="confirmarRemesa"
      />
    </div>
  </div>
</template> 