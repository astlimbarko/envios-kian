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
import html2pdf from 'html2pdf.js'
import ModalTerminos from './modalTerminos.vue'
import { useRouter } from 'vue-router'

const store = useRemesaStore()
const logoKian = '/kian-logo.svg'
const aceptoTerminos = ref(false)
const remesaEnviada = ref(false)
const mostrarConfirmacion = ref(false)
const mostrarOpcionesPDF = ref(false)
const mostrarTerminos = ref(false)
const mostrarToast = ref(false)
const mensajeToast = ref('')
const audioBell = new Audio('/src/assets/sound/bell.mp3')

const emit = defineEmits(['confirmado', 'siguiente-paso'])

const router = useRouter()

// Computed properties para los datos del resumen
const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const numeroComprobante = computed(() => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `REM-${timestamp}-${random}`
})

// Usar los nuevos getters del store
const datosTransaccion = computed(() => store.datosTransaccion)
const datosRecepcion = computed(() => store.datosRecepcion)
const datosPago = computed(() => store.datosPago)

// Observar cambios en los datos para actualizar la visibilidad del resumen
watch(() => store.datosValidos, (nuevoValor) => {
  console.log('ResumenRemesa: Datos válidos cambiaron a', nuevoValor)
  store.setResumenVisible(nuevoValor)
}, { immediate: true })

// Observar cambios específicos en cada sección
watch(() => store.estado.transaccion, (nuevoValor) => {
  console.log('ResumenRemesa: Transacción actualizada:', nuevoValor)
}, { deep: true })

watch(() => store.estado.recepcion, (nuevoValor) => {
  console.log('ResumenRemesa: Recepción actualizada:', nuevoValor)
}, { deep: true })

watch(() => store.estado.pago, (nuevoValor) => {
  console.log('ResumenRemesa: Pago actualizado:', nuevoValor)
}, { deep: true })

const imprimirComprobante = () => {
  const element = document.getElementById('comprobante-remesa')
  const contenido = element.cloneNode(true)
  
  // Eliminar elementos que no deben aparecer en la impresión
  const elementosAEliminar = contenido.querySelectorAll('.botones-accion, .terminos-condiciones')
  elementosAEliminar.forEach(el => el.remove())
  
  const ventana = window.open('', '_blank')
  ventana.document.write(`
    <html>
      <head>
        <title>Comprobante de Remesa</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .comprobante { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { height: 60px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .section { margin: 20px 0; }
          .section h2 { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
          .footer { text-align: center; font-size: 12px; margin-top: 20px; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${contenido.innerHTML}
      </body>
    </html>
  `)
  ventana.document.close()
  ventana.print()
}

const generarPDF = () => {
  const element = document.getElementById('comprobante-remesa')
  const contenido = element.cloneNode(true)
  
  // Eliminar elementos que no deben aparecer en el PDF
  const elementosAEliminar = contenido.querySelectorAll('.botones-accion, .terminos-condiciones')
  elementosAEliminar.forEach(el => el.remove())
  
  const opt = {
    margin: 1,
    filename: `remesa-${numeroComprobante.value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(contenido).save()
}

const confirmarRemesa = () => {
  remesaEnviada.value = true
  mostrarConfirmacion.value = false
  mostrarOpcionesPDF.value = true
  emit('confirmado')
  
  // Reproducir sonido y mostrar toast
  audioBell.play()
  mensajeToast.value = '¡Remesa confirmada exitosamente!'
  mostrarToast.value = true
  setTimeout(() => {
    mostrarToast.value = false
  }, 3000)
}

const irANuevaRemesa = () => {
  router.push('/cliente/nueva-remesa')
}
</script>

<template>
  <div v-show="store.resumenVisible" class="min-h-screen py-4" :class="{'bg-red-50 dark:bg-red-900/20': remesaEnviada, 'bg-gray-100 dark:bg-gray-900': !remesaEnviada}">
    <div id="comprobante-remesa" class="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-[14px] text-gray-800 dark:text-gray-200 space-y-2">
      <!-- Logo y Encabezado -->
      <div class="text-center border-b border-gray-200 dark:border-gray-700 pb-2">
        <img :src="logoKian" alt="KIAN Logo" class="h-10 mx-auto mb-2">
        <h1 class="text-lg font-semibold text-gray-800 dark:text-white resumen-titulo">Recibo de Remesa</h1>
      </div>

      <!-- Información general -->
      <div class="grid grid-cols-2 gap-y-1">
        <div class="text-gray-600 dark:text-gray-400 font-medium">Fecha:</div>
        <div>{{ fechaActual }}</div>

        <div v-if="remesaEnviada" class="text-gray-600 dark:text-gray-400 font-medium">N° Comprobante:</div>
        <div v-if="remesaEnviada">{{ numeroComprobante }}</div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Transacción -->
      <div v-if="datosTransaccion" class="space-y-1">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Transacción</h2>
        <div class="grid grid-cols-2 gap-y-1">
          <div class="text-gray-600 dark:text-gray-400">Cantidad enviada:</div>
          <div>{{ datosTransaccion.montoEnviarFormateado }} SEK</div>

          <div class="text-gray-600 dark:text-gray-400">Cantidad a recibir:</div>
          <div>{{ datosTransaccion.montoRecibirFormateado }} {{ datosTransaccion.pais?.moneda || 'BOB' }}</div>
          <!--
          <div class="text-gray-600 dark:text-gray-400">Tipo de cambio:</div>
          <div>1 SEK = {{ datosTransaccion.tipoCambio }} {{ datosTransaccion.pais?.moneda || 'BOB' }}</div>
          -->
          <div class="text-gray-600 dark:text-gray-400">País destino:</div>
          <div>{{ datosTransaccion.pais?.nombre || 'Bolivia' }}</div>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de recepción -->
      <div v-if="datosRecepcion" class="space-y-1">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Método de Recepción</h2>
        <div class="grid grid-cols-2 gap-y-1">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ datosRecepcion.tipoFormateado }}</div>

          <!-- Detalles para QR -->
          <template v-if="datosRecepcion.tipo === 'qr'">
            <div class="text-gray-600 dark:text-gray-400">Beneficiario:</div>
            <div>{{ datosRecepcion.nombreBeneficiario }}</div>
          </template>

          <!-- Detalles para cuenta bancaria -->
          <template v-if="datosRecepcion.tipo === 'cuenta' && datosRecepcion.cuenta">
            <div class="text-gray-600 dark:text-gray-400">Titular:</div>
            <div>{{ datosRecepcion.cuenta.titular }}</div>

            <div class="text-gray-600 dark:text-gray-400">Banco:</div>
            <div>{{ datosRecepcion.cuenta.banco }}</div>

            <div class="text-gray-600 dark:text-gray-400">N° de Cuenta:</div>
            <div>{{ datosRecepcion.cuenta.numeroCuenta }}</div>

            <div class="text-gray-600 dark:text-gray-400">Tipo de Cuenta:</div>
            <div>{{ datosRecepcion.cuenta.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</div>

            <div class="text-gray-600 dark:text-gray-400">Sucursal:</div>
            <div>{{ datosRecepcion.cuenta.sucursal }}</div>
          </template>
        </div>
      </div>

      <hr class="border-gray-200 dark:border-gray-700" />

      <!-- Método de pago -->
      <div v-if="datosPago" class="space-y-1">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-white mb-1">Método de Pago</h2>
        <div class="grid grid-cols-2 gap-y-1">
          <div class="text-gray-600 dark:text-gray-400">Tipo:</div>
          <div>{{ datosPago.tipoFormateado }}</div>
        </div>
      </div>

      <!-- Pie -->
      <div class="pt-2 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>La remesa será procesada una vez confirmada la recepción de fondos.</p>
        <p>Este documento no tiene validez para crédito fiscal.</p>
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-center space-x-2 terminos-condiciones">
        <input 
          type="checkbox" 
          id="terminos" 
          v-model="aceptoTerminos"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        >
        <label for="terminos" class="text-sm text-gray-600 dark:text-gray-400">
          Acepto los 
          <span 
            @click="mostrarTerminos = true"
            class="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            términos y condiciones
          </span>
        </label>
      </div>


      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4 botones-accion">
        <div v-if="remesaEnviada && mostrarOpcionesPDF" class="flex space-x-4">
          <button 
            @click="generarPDF"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <i class="fas fa-file-pdf mr-2"></i>
            Descargar PDF
          </button>
          <button 
            @click="imprimirComprobante"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
          >
            <i class="fas fa-print mr-2"></i>
            Imprimir
          </button>
          <button 
            @click="irANuevaRemesa"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <i class="fas fa-arrow-right mr-2"></i>
            Continuar
          </button>
        </div>
        <button 
          v-if="!remesaEnviada"
          @click="mostrarConfirmacion = true"
          :disabled="!aceptoTerminos"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar Remesa
        </button>
        <div v-else-if="!mostrarOpcionesPDF" class="px-6 py-3 bg-green-600 text-white rounded-lg">
          Remesa Enviada
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmar Envío</h3>
        <p class="mb-6">¿Está seguro que desea enviar esta remesa? Esta acción no se puede deshacer.</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="mostrarConfirmacion = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button 
            @click="confirmarRemesa"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de términos y condiciones -->
    <ModalTerminos 
      :mostrar="mostrarTerminos"
      @cerrar="mostrarTerminos = false"
    />

    <!-- Toast Notification -->
    <div 
      v-if="mostrarToast"
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>{{ mensajeToast }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... existing styles ... */

/* Animación para el toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style> 