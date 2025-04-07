<script setup>
import { computed, ref } from 'vue'
import html2pdf from 'html2pdf.js'

const emit = defineEmits(['confirmSend', 'goBack', 'close'])

const props = defineProps({
  showRemittanceModal: Boolean,
  currentStep: Number,
  remittanceData: Object
})

// Generar un número de comprobante único
const comprobante = ref(`ENK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`)

// Fecha actual formateada
const fechaActual = ref(new Date().toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}))

// Tipo de cambio actual (1.09 SEK = 1 BOB)
const exchangeRate = 1.09

// Calcular el monto total a pagar (monto + comisión)
const totalAmount = computed(() => {
  return (props.remittanceData?.amount || 0) + (props.remittanceData?.fee || 0)
})

// Calcular el monto que recibirá el beneficiario
const receivedAmount = computed(() => {
  return ((props.remittanceData?.amount || 0) * exchangeRate).toFixed(2)
})

// Obtener el nombre del beneficiario según el ID
const beneficiaryName = computed(() => {
  if (props.remittanceData?.recipientType === 'saved') {
    return props.remittanceData.recipientId === '1' ? 'María González' : 
           props.remittanceData.recipientId === '2' ? 'Juan Martínez' :
           props.remittanceData.recipientId === '3' ? 'Carlos Ramírez' : 'Beneficiario'
  } else {
    return 'Nuevo Beneficiario'
  }
})

// Imprimir el resumen
const printSummary = () => {
  try {
    const printContents = document.getElementById('printable-summary').innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = `
      <div style="padding: 20px;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #146EBE; margin-bottom: 5px;">ENVIOS KIAN</h2>
            <h3 style="margin-top: 0;">Comprobante de Remesa</h3>
          </div>
          ${printContents}
        </div>
      </div>
    `
    window.print()
    document.body.innerHTML = originalContents
    
    // Reconectar los eventos Vue después de restaurar el contenido
    window.location.reload()
  } catch (error) {
    console.error("Error al imprimir:", error)
    alert("Hubo un problema al imprimir. Inténtelo de nuevo.")
  }
}

// Descargar como PDF usando html2pdf.js
const downloadPDF = () => {
  try {
    const element = document.getElementById('printable-summary')
    const opt = {
      margin: 10,
      filename: `Comprobante_Remesa_${comprobante.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    // Añadir el encabezado al PDF
    const header = document.createElement('div')
    header.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        <h2 style="color: #146EBE; margin-bottom: 5px; font-size: 20px;">ENVIOS KIAN</h2>
        <h3 style="margin-top: 0; font-size: 16px;">Comprobante de Remesa</h3>
      </div>
    `
    element.prepend(header)
    
    // Generar el PDF
    html2pdf().set(opt).from(element).save().then(() => {
      // Eliminar el encabezado después de generar el PDF
      element.removeChild(header)
    })
  } catch (error) {
    console.error("Error al generar PDF:", error)
    alert("Hubo un problema al generar el PDF. Inténtelo de nuevo.")
  }
}

// Funciones para emitir eventos al componente padre
const handleConfirmSend = () => {
  emit('confirmSend')
}

const handleGoBack = () => {
  emit('goBack')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <!-- Contenido del paso 3: Resumen de la transacción -->
  <div v-if="showRemittanceModal && currentStep === 3" class="space-y-4">
    <!-- Cabecera con botones de acción y número de comprobante -->
    <div class="flex justify-between items-center">
      <div>
        <div class="text-xs text-gray-500 dark:text-gray-400">Comprobante</div>
        <div class="font-medium text-[#146EBE] dark:text-blue-400">{{ comprobante }}</div>
      </div>
      <div class="flex space-x-2">
        <button @click="printSummary" class="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300" title="Imprimir">
          <i class="fas fa-print"></i>
        </button>
        <button @click="downloadPDF" class="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors text-gray-600 dark:text-gray-300" title="Descargar PDF">
          <i class="fas fa-file-pdf"></i>
        </button>
      </div>
    </div>
    
    <!-- Contenido imprimible -->
    <div id="printable-summary">
      <!-- Fecha y datos del encabezado -->
      <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-[#146EBE] dark:text-blue-300 text-sm">Datos de la Transacción</h4>
          <div class="text-xs text-gray-500 dark:text-gray-400">Fecha: {{ fechaActual }}</div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Datos del destinatario -->
          <div class="space-y-2">
            <h5 class="font-medium text-gray-700 dark:text-gray-200 text-xs">Beneficiario</h5>
            <div class="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <!-- Si es un beneficiario guardado, mostrar sus datos -->
              <div v-if="remittanceData.recipientType === 'saved'">
                <div class="font-medium text-sm">{{ beneficiaryName }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">
                  {{ remittanceData.recipientId === '1' ? 'Bogotá, Colombia' : 
                     remittanceData.recipientId === '2' ? 'La Paz, Bolivia' :
                     remittanceData.recipientId === '3' ? 'Santa Cruz, Bolivia' : 'Dirección' }}
                </div>
              </div>
              
              <!-- Si es un nuevo beneficiario, mostrar información de placeholder -->
              <div v-else>
                <div class="font-medium text-sm">Nuevo Beneficiario</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">Bolivia</div>
              </div>
              
              <div class="mt-1 text-xs inline-flex items-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded-full">
                <i :class="remittanceData.receiveMethod === 'qr' ? 'fas fa-qrcode mr-1' : 'fas fa-university mr-1'"></i>
                {{ remittanceData.receiveMethod === 'qr' ? 'Pago por QR' : 'Cuenta Bancaria' }}
              </div>
            </div>
          </div>
          
          <!-- Detalles del pago -->
          <div class="space-y-2">
            <h5 class="font-medium text-gray-700 dark:text-gray-200 text-xs">Detalles</h5>
            <div class="bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
              <div class="grid grid-cols-2 gap-x-2 text-xs">
                <div class="text-gray-600 dark:text-gray-400">Envía:</div>
                <div class="text-right font-medium">{{ remittanceData.amount.toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Comisión:</div>
                <div class="text-right font-medium">{{ remittanceData.fee.toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Tipo de cambio:</div>
                <div class="text-right font-medium">1 {{ remittanceData.sendCurrency }} = {{ exchangeRate.toFixed(2) }} {{ remittanceData.receiveCurrency }}</div>
                
                <div class="text-gray-600 dark:text-gray-400 font-medium pt-1 border-t dark:border-gray-600">Total a pagar:</div>
                <div class="text-right font-medium pt-1 border-t dark:border-gray-600">{{ totalAmount.toFixed(2) }} {{ remittanceData.sendCurrency }}</div>
                
                <div class="text-gray-600 dark:text-gray-400 font-medium">Beneficiario recibe:</div>
                <div class="text-right font-medium text-green-700 dark:text-green-400">{{ receivedAmount }} {{ remittanceData.receiveCurrency }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Método de pago -->
      <div>
        <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-1 mb-2 text-xs">Método de pago</h4>
        <div class="bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm flex items-center">
          <span class="text-xs text-gray-700 dark:text-gray-300 mr-2">{{ remittanceData.paymentMethod === 'swish' ? 'Swish' : 'Transferencia bancaria' }}</span>
          <div class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5">
            <i :class="remittanceData.paymentMethod === 'swish' ? 'fas fa-mobile-alt text-xs' : 'fas fa-university text-xs'"></i>
          </div>
        </div>
      </div>
      
      <!-- Información legal y política de cancelación -->
      <div class="bg-gray-50 dark:bg-gray-800 p-2 rounded-md mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>Esta remesa está sujeta a nuestros términos y condiciones. Guarde este comprobante para cualquier consulta.</p>
        <p class="mt-1">Contacto: support@envioskian.com</p>
      </div>
    </div>

    <!-- Botones de navegación (para claridad, pero son manejados por el componente padre) -->
    <div class="flex justify-between mt-4 hidden">
      <button @click="handleGoBack" class="text-sm">
        <i class="fas fa-arrow-left mr-1"></i> Volver
      </button>
      <div class="space-x-2">
        <button @click="handleClose" class="text-sm">
          Cancelar
        </button>
        <button @click="handleConfirmSend" class="text-sm bg-[#146EBE] text-white px-4 py-2 rounded-md">
          Confirmar Envío
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo elegante para Windows 11 */
input, select, textarea {
  border-radius: 6px;
}

/* Efecto suave en botones */
button {
  transition: all 0.15s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Mejora de accesibilidad para focus */
button:focus, 
input:focus, 
select:focus {
  outline: 2px solid rgba(37, 99, 235, 0.5);
  outline-offset: 2px;
}

/* Responsividad para dispositivos pequeños */
@media (max-width: 640px) {
  .grid-cols-1 {
    row-gap: 1rem;
  }
}

/* Estilos para modo oscuro */
.dark input[type="radio"],
.dark input[type="checkbox"] {
  background-color: #374151;
  border-color: #4B5563;
}

/* Estilos para impresión */
@media print {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  button, .no-print {
    display: none !important;
  }
  
  body {
    background-color: white;
    font-size: 12pt;
  }
  
  .rounded-lg, .rounded-md {
    border-radius: 0 !important;
  }
  
  #printable-summary {
    border: 1px solid #ddd;
    padding: 20px;
    max-width: 100%;
    margin: 0 auto;
  }
}
</style> 