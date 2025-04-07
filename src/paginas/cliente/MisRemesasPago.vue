<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['goToSummary', 'goBack', 'close'])

const props = defineProps({
  showRemittanceModal: Boolean,
  currentStep: Number,
  remittanceData: Object
})

// Estado para el método de pago seleccionado
const selectedPaymentMethod = ref(props.remittanceData?.paymentMethod || 'swish')

// Datos para los comprobantes de pago
const paymentProof = ref({
  file: null,
  imageUrl: null
})

// Información de cuentas bancarias
const bankAccounts = [
  {
    country: 'Lituania',
    bankName: 'Swedbank',
    accountNumber: 'LT121000011111111111',
    swiftCode: 'SWEELT22',
    accountHolder: 'ENVIOS KIAN AB'
  },
  {
    country: 'Suecia',
    bankName: 'Handelsbanken',
    accountNumber: 'SE9500000000052344440009',
    swiftCode: 'HANDSESS',
    accountHolder: 'ENVIOS KIAN AB'
  }
]

// Datos para Swish
const swishData = {
  phoneNumber: '+46 70 123 45 67',
  recipientName: 'ENVIOS KIAN AB'
}

// Manejar la carga de imagen
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    paymentProof.value.file = file
    
    // Crear una URL para previsualizar la imagen
    const reader = new FileReader()
    reader.onload = (e) => {
      paymentProof.value.imageUrl = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Actualizar el método de pago seleccionado en los datos de la remesa
    props.remittanceData.paymentMethod = selectedPaymentMethod.value
  }
}

// Eliminar la imagen cargada
const removeUploadedFile = () => {
  paymentProof.value.file = null
  paymentProof.value.imageUrl = null
}

// Actualizar el método de pago en los datos de la remesa cuando cambie
watch(selectedPaymentMethod, (newValue) => {
  props.remittanceData.paymentMethod = newValue
})
</script>

<template>
  <!-- Contenido del paso 2: Métodos de pago -->
  <div v-if="showRemittanceModal && currentStep === 2" class="space-y-4">
    <!-- División en dos columnas -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Columna izquierda: Selección de método de pago -->
      <div class="w-full md:w-1/3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <h4 class="font-semibold text-[#146EBE] dark:text-blue-300 mb-2 text-sm">Seleccione el Método de Pago</h4>
        
        <!-- Selección de método de pago -->
        <div class="space-y-2">
          <div class="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-700/50"
               :class="{'border-blue-500 bg-blue-50 dark:bg-blue-900/30': selectedPaymentMethod === 'swish'}"
          >
            <input id="swish_payment" type="radio" name="payment_method" value="swish" v-model="selectedPaymentMethod" class="text-[#146EBE]">
            <label for="swish_payment" class="ml-3 flex items-center w-full cursor-pointer">
              <div class="flex items-center space-x-3">
                <div class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded-full w-7 h-7 p-1">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="flex-1 text-center">
                  <div class="font-medium text-gray-800 dark:text-gray-100 text-sm">Swish</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Rápido y seguro</div>
                </div>
              </div>
            </label>
          </div>
          
          <div class="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-700/50"
               :class="{'border-blue-500 bg-blue-50 dark:bg-blue-900/30': selectedPaymentMethod === 'bank_transfer'}"
          >
            <input id="bank_transfer" type="radio" name="payment_method" value="bank_transfer" v-model="selectedPaymentMethod" class="text-[#146EBE]">
            <label for="bank_transfer" class="ml-3 flex items-center w-full cursor-pointer">
              <div class="flex items-center space-x-3">
                <div class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded-full w-7 h-7 p-1">
                  <i class="fas fa-university"></i>
                </div>
                <div class="flex-1 text-center">
                  <div class="font-medium text-gray-800 dark:text-gray-100 text-sm">Transferencia Bancaria</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">Depósito directo</div>
                </div>
              </div>
            </label>
          </div>
          
          <!-- Mensaje importante -->
          <div class="mt-2 bg-amber-50 dark:bg-amber-900/30 p-1 rounded-md border-l-4 border-amber-500 dark:border-amber-600 text-xs">
            <div class="font-medium text-amber-800 dark:text-amber-300 mb-1">Importante</div>
            <ul class="text-amber-700 dark:text-amber-200 pl-4 space-y-0.5">
              <li>Recuerde subir el comprobante de pago</li>
              <li>Sin comprobante, no podremos procesar su remesa</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Columna derecha: Detalles del método seleccionado -->
      <div class="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <!-- Detalles específicos según el método de pago -->
        <div v-if="selectedPaymentMethod === 'swish'" class="space-y-3">
          <h5 class="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Detalles de Pago con Swish</h5>
          
          <div class="flex items-start justify-center space-x-4">
            <div class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 text-center">
              <div class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-12 h-12 mx-auto mb-1">
                <i class="fas fa-qrcode text-xl"></i>
              </div>
              <div class="font-medium text-gray-700 dark:text-gray-200 text-sm">Escanear QR</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Próximamente</div>
            </div>
            
            <div class="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex-1">
              <div class="grid grid-cols-2 gap-1 text-sm">
                <div class="text-gray-600 dark:text-gray-400">Número Swish:</div>
                <div class="font-medium text-gray-800 dark:text-gray-200">{{ swishData.phoneNumber }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Destinatario:</div>
                <div class="font-medium text-gray-800 dark:text-gray-200">{{ swishData.recipientName }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Monto a enviar:</div>
                <div class="font-medium text-gray-800 dark:text-gray-200 text-blue-600 dark:text-blue-400">
                  {{ parseFloat(remittanceData.amount).toFixed(2) }} {{ remittanceData.sendCurrency }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carga de comprobante para Swish -->
          <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comprobante de Pago <span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 text-center" v-if="!paymentProof.imageUrl">
              <input type="file" id="payment_proof_swish" @change="handleFileUpload" accept="image/*" class="hidden">
              <label for="payment_proof_swish" class="cursor-pointer">
                <div class="text-gray-500 dark:text-gray-400 text-sm">
                  <i class="fas fa-cloud-upload-alt text-xl mb-1"></i>
                  <div>Haga clic para subir el comprobante de pago</div>
                  <div class="text-xs">o arrastre y suelte aquí</div>
                </div>
              </label>
            </div>
            <div v-else class="relative">
              <img :src="paymentProof.imageUrl" class="w-full h-32 object-cover rounded-lg">
              <button @click="removeUploadedFile" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <i class="fas fa-times text-xs"></i>
              </button>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ paymentProof.file?.name }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Detalles para transferencia bancaria -->
        <div v-if="selectedPaymentMethod === 'bank_transfer'" class="space-y-3">
          <h5 class="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Detalles de Transferencia Bancaria</h5>
          
          <div class="space-y-3">
            <div v-for="(account, index) in bankAccounts" :key="index" 
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
              <div class="font-medium text-gray-800 dark:text-gray-200 text-sm">Banco en {{ account.country }}</div>
              <div class="mt-1 grid grid-cols-2 gap-x-2 text-xs">
                <div class="text-gray-600 dark:text-gray-400">Nombre del Banco:</div>
                <div class="text-gray-800 dark:text-gray-200">{{ account.bankName }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Número de Cuenta:</div>
                <div class="text-gray-800 dark:text-gray-200 flex items-center">
                  {{ account.accountNumber }}
                  <button class="ml-1 text-blue-600 dark:text-blue-400" title="Copiar" @click="navigator.clipboard.writeText(account.accountNumber)">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                
                <div class="text-gray-600 dark:text-gray-400">Código SWIFT:</div>
                <div class="text-gray-800 dark:text-gray-200">{{ account.swiftCode }}</div>
                
                <div class="text-gray-600 dark:text-gray-400">Titular:</div>
                <div class="text-gray-800 dark:text-gray-200">{{ account.accountHolder }}</div>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mt-2">
            <div class="text-sm text-gray-600 dark:text-gray-400">Monto a transferir:</div>
            <div class="font-medium text-gray-800 dark:text-gray-200 text-blue-600 dark:text-blue-400">
              {{ parseFloat(remittanceData.amount).toFixed(2) }} {{ remittanceData.sendCurrency }}
            </div>
          </div>
          
          <div class="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-md border-l-4 border-amber-500 dark:border-amber-600 text-xs">
            <div class="font-medium text-amber-800 dark:text-amber-300 mb-1">Importante</div>
            <ul class="text-amber-700 dark:text-amber-200 pl-4 space-y-0.5 list-disc">
              <li>En la transferencia debe indicar como referencia su nombre completo</li>
              <li>El procesamiento puede tomar hasta 24 horas hábiles</li>
            </ul>
          </div>
          
          <!-- Carga de comprobante para transferencia -->
          <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comprobante de Transferencia <span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 text-center" v-if="!paymentProof.imageUrl">
              <input type="file" id="payment_proof_bank" @change="handleFileUpload" accept="image/*" class="hidden">
              <label for="payment_proof_bank" class="cursor-pointer">
                <div class="text-gray-500 dark:text-gray-400 text-sm">
                  <i class="fas fa-cloud-upload-alt text-xl mb-1"></i>
                  <div>Haga clic para subir el comprobante de transferencia</div>
                  <div class="text-xs">o arrastre y suelte aquí</div>
                </div>
              </label>
            </div>
            <div v-else class="relative">
              <img :src="paymentProof.imageUrl" class="w-full h-32 object-cover rounded-lg">
              <button @click="removeUploadedFile" class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <i class="fas fa-times text-xs"></i>
              </button>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ paymentProof.file?.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilo elegante para Windows 11 */
input, select, textarea {
  border-radius: 6px;
  min-height: 38px;
}

/* Efecto suave en botones */
button {
  transition: all 0.15s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Contenedor del método de pago con altura mínima */
.flex.flex-col.md\:flex-row.gap-4 {
  min-height: 380px;
}

/* Columnas con altura igual */
.w-full.md\:w-1\/3,
.w-full.md\:w-2\/3 {
  display: flex;
  flex-direction: column;
}

/* Mejora de accesibilidad para focus */
button:focus, 
input:focus, 
select:focus {
  outline: 2px solid rgba(37, 99, 235, 0.5);
  outline-offset: 2px;
}

/* Responsividad para dispositivos pequeños */
@media (max-width: 768px) {
  .flex-col.md\:flex-row {
    flex-direction: column;
  }
  
  .w-full.md\:w-1\/3,
  .w-full.md\:w-2\/3 {
    width: 100%;
  }
  
  .flex.items-center.justify-center.space-x-4 {
    flex-direction: column;
  }
  
  .flex.items-center.justify-center.space-x-4 > div {
    width: 100%;
    margin-top: 1rem;
  }
  
  .flex.items-center.justify-center.space-x-4 > div:first-child {
    margin-top: 0;
  }
}

/* Estilos para modo oscuro */
.dark input[type="radio"],
.dark input[type="checkbox"] {
  background-color: #374151;
  border-color: #4B5563;
}

.dark option {
  background-color: #374151;
  color: #E5E7EB;
}
</style> 