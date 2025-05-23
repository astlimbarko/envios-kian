/**
 * Componente ResumenRemesa.vue
 * 
 * Este componente muestra un resumen completo de la remesa que el usuario está creando.
 * Utiliza el store centralizado para manejar el estado y las actualizaciones.
 */

<script setup>
import { ref, computed, watch } from 'vue'
import { useRemesaStore } from '../../../store/remesa'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const store = useRemesaStore()
const logoKian = '/kian-logo.svg'
const aceptoTerminos = ref(false)

const emit = defineEmits(['confirmado', 'siguiente-paso'])

// Watchers para actualizar la vista
watch(() => store.estado.recepcion, (nuevoValor) => {
  console.log('ResumenRemesa: Cambios detectados en recepción:', nuevoValor)
}, { deep: true })

watch(() => store.estado.pago, (nuevoValor) => {
  console.log('ResumenRemesa: Cambios detectados en pago:', nuevoValor)
}, { deep: true })

// Computed properties
const fechaActual = computed(() => {
  const fecha = new Date()
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const numeroRecibo = computed(() => {
  return `REM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
})

const metodoRecepcion = computed(() => {
  const { tipo, nombreBeneficiario, cuenta } = store.estado.recepcion
  if (tipo === 'qr') {
    return `QR - ${nombreBeneficiario}`
  } else if (tipo === 'banco') {
    return `Cuenta Bancaria - ${cuenta?.banco}`
  }
  return 'No especificado'
})

const metodoPago = computed(() => {
  const { tipo } = store.estado.pago
  if (tipo === 'swish') {
    return 'Swish'
  } else if (tipo === 'banco') {
    return 'Transferencia Bancaria'
  }
  return 'No especificado'
})

const validarDatos = () => {
  const { transaccion, recepcion, pago } = store.estado
  const datosValidos = !!transaccion && !!recepcion && !!pago
  console.log('ResumenRemesa: Validando datos:', { transaccion, recepcion, pago })
  console.log('ResumenRemesa: Datos válidos:', datosValidos)
  store.setResumenVisible(datosValidos)
}

// Observar cambios en el estado
watch(() => store.estado, (nuevoEstado) => {
  console.log('ResumenRemesa: Estado actualizado:', nuevoEstado)
  validarDatos()
}, { deep: true, immediate: true })

// Observar cambios específicos
watch(() => store.estado.recepcion, (nuevaRecepcion) => {
  console.log('ResumenRemesa: Cambios detectados en recepción:', nuevaRecepcion)
  validarDatos()
}, { deep: true })

watch(() => store.estado.pago, (nuevoPago) => {
  console.log('ResumenRemesa: Cambios detectados en pago:', nuevoPago)
  validarDatos()
}, { deep: true })

// Confirmar la remesa
const confirmarRemesa = () => {
  console.log('ResumenRemesa: Iniciando función confirmarRemesa')
  console.log('ResumenRemesa: Estado actual:', {
    aceptoTerminos: aceptoTerminos.value,
    datosValidos: store.datosValidos
  })

  try {
    if (!aceptoTerminos.value) {
      console.log('ResumenRemesa: Términos y condiciones no aceptados')
      return
    }

    if (!store.datosValidos) {
      console.log('ResumenRemesa: Datos incompletos')
      return
    }

    // Emitir evento de confirmación con los datos del store
    emit('confirmado', {
      montoEnviar: store.estado.transaccion.montoEnviar,
      montoRecibir: store.estado.transaccion.montoRecibir,
      metodoRecepcion: store.estado.recepcion.tipo,
      metodoPago: store.estado.pago.tipo,
      nombreBeneficiario: store.estado.recepcion.nombreBeneficiario
    })
    console.log('ResumenRemesa: Evento confirmado emitido')

    // Avanzar al siguiente paso
    store.setPasoActual(5)
    console.log('ResumenRemesa: Paso actual actualizado a 5')

    // Emitir evento para mostrar el siguiente paso
    emit('siguiente-paso', 5)
    console.log('ResumenRemesa: Evento siguiente-paso emitido con paso 5')

    // Scroll al siguiente paso
    setTimeout(() => {
      console.log('ResumenRemesa: Iniciando scroll')
      const siguientePaso = document.querySelector('.confirmacion-titulo')
      if (siguientePaso) {
        console.log('ResumenRemesa: Elemento siguiente paso encontrado')
        const headerOffset = 80
        const elementPosition = siguientePaso.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        siguientePaso.classList.add('paso-activo')
        setTimeout(() => {
          siguientePaso.classList.remove('paso-activo')
        }, 2000)
      } else {
        console.log('ResumenRemesa: No se encontró el elemento siguiente paso')
      }
    }, 100)
  } catch (error) {
    console.error('ResumenRemesa: Error en la función confirmarRemesa:', error)
  }
}
</script>

<template>
  <div v-show="store.resumenVisible" class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-6 text-[15px] text-gray-800 dark:text-gray-200 space-y-6">
      <!-- Logo y Encabezado -->
      <div class="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <img :src="logoKian" alt="KIAN Logo" class="h-12 mx-auto mb-4">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white resumen-titulo">Recibo de Remesa</h1>
      </div>

      <!-- Información general -->
      <div class="grid grid-cols-2 gap-y-2">
        <div class="text-gray-600 dark:text-gray-400 font-medium">Fecha:</div>
        <div>{{ fechaActual }}</div>

        <div class="text-gray-600 dark:text-gray-400 font-medium">N° Comprobante:</div>
        <div>{{ numeroRecibo }}</div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Transacción -->
      <div v-if="store.estado.transaccion">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Transacción</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Cantidad enviada:</div>
          <div>{{ store.estado.transaccion.montoEnviar }} SEK</div>

          <div class="text-gray-600 dark:text-gray-400">Cantidad a recibir:</div>
          <div>{{ store.estado.transaccion.montoRecibir }} {{ store.estado.transaccion.pais?.moneda || 'BOB' }}</div>

          <div class="text-gray-600 dark:text-gray-400">Tipo de cambio:</div>
          <div>1 SEK = {{ store.estado.transaccion.tipoCambio }} {{ store.estado.transaccion.pais?.moneda || 'BOB' }}</div>

          <div class="text-gray-600 dark:text-gray-400">País destino:</div>
          <div>{{ store.estado.transaccion.pais?.nombre || 'Bolivia' }}</div>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de recepción -->
      <div v-if="store.estado.recepcion">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Método de Recepción</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ metodoRecepcion }}</div>

          <!-- Detalles para QR -->
          <template v-if="store.estado.recepcion.tipo === 'qr'">
            <div class="text-gray-600 dark:text-gray-400">Beneficiario:</div>
            <div>{{ store.estado.recepcion.nombreBeneficiario }}</div>
          </template>

          <!-- Detalles para cuenta bancaria -->
          <template v-if="store.estado.recepcion.tipo === 'banco' && store.estado.recepcion.cuenta">
            <div class="text-gray-600 dark:text-gray-400">Titular:</div>
            <div>{{ store.estado.recepcion.cuenta.titular }}</div>

            <div class="text-gray-600 dark:text-gray-400">Banco:</div>
            <div>{{ store.estado.recepcion.cuenta.banco }}</div>

            <div class="text-gray-600 dark:text-gray-400">N° de Cuenta:</div>
            <div>{{ store.estado.recepcion.cuenta.numeroCuenta }}</div>

            <div class="text-gray-600 dark:text-gray-400">Tipo de Cuenta:</div>
            <div>{{ store.estado.recepcion.cuenta.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</div>

            <div class="text-gray-600 dark:text-gray-400">Sucursal:</div>
            <div>{{ store.estado.recepcion.cuenta.sucursal }}</div>
          </template>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de pago -->
      <div v-if="store.estado.pago">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-2">Método de Pago</h2>
        <div class="grid grid-cols-2 gap-y-2">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ metodoPago }}</div>
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