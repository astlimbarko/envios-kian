<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['close', 'paymentCompleted'])

const currentStep = ref(1)

// Estado para el método de pago seleccionado
const selectedPaymentMethod = ref('swish')

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
  }
}

// Eliminar la imagen cargada
const removeUploadedFile = () => {
  paymentProof.value.file = null
  paymentProof.value.imageUrl = null
}

const nextStep = () => {
  if (selectedPaymentMethod.value) {
    currentStep.value = 2
  }
}

const confirmPayment = () => {
  emit('paymentCompleted')
  emit('close')
}
</script>

<template>
  <!-- Modal de método de pago -->
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Fondo oscuro -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Centrado del modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Contenido del modal -->
      <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
        <!-- Barra de progreso -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div 
            class="bg-blue-600 h-2 transition-all duration-300 ease-in-out"
            :style="{ width: `${currentStep === 1 ? 50 : 100}%` }"
          ></div>
        </div>

        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              Pago del Remitente
            </h3>
            <button @click="emit('close')" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Contenido -->
        <div class="bg-white dark:bg-gray-800 px-6 py-4">
          <!-- Paso 1: Selección de método de pago -->
          <div v-if="currentStep === 1" class="space-y-6">
            <!-- División en dos columnas -->
            <div class="flex flex-col md:flex-row gap-3">
              <!-- Columna izquierda: Selección de método de pago -->
              <div class="w-full md:w-1/3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
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
                </div>
              </div>
              
              <!-- Columna derecha: Detalles del método seleccionado -->
              <div class="w-full md:w-2/3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                <!-- Detalles específicos según el método de pago -->
                <div v-if="selectedPaymentMethod === 'swish'" class="space-y-2">
                  <h5 class="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Detalles de Pago con Swish</h5>
                  
                  <div class="flex items-start justify-center space-x-3">
                    <!--
                    <div class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 text-center">
                      
                      <div class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-10 h-10 mx-auto mb-1">
                        <i class="fas fa-qrcode text-lg"></i>
                      </div>
                      <div class="font-medium text-gray-700 dark:text-gray-200 text-sm">Escanear QR</div>
                    
                      <div class="text-xs text-gray-500 dark:text-gray-400">Próximamente</div>
                      
                    </div>
                    -->
                    <div class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 flex-1">
                      <div class="grid grid-cols-2 gap-1 text-sm">
                        <div class="text-gray-600 dark:text-gray-400">Número Swish:</div>
                        <div class="font-medium text-gray-800 dark:text-gray-200">{{ swishData.phoneNumber }}</div>
                        
                        <div class="text-gray-600 dark:text-gray-400">Destinatario:</div>
                        <div class="font-medium text-gray-800 dark:text-gray-200">{{ swishData.recipientName }}</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Carga de comprobante para Swish -->
                  <div class="mt-2">s
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
                      <img :src="paymentProof.imageUrl" class="w-full h-28 object-cover rounded-lg">
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
                <div v-if="selectedPaymentMethod === 'bank_transfer'" class="space-y-2">
                  <h5 class="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Detalles de Transferencia Bancaria</h5>
                  
                  <div class="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                      <div class="text-gray-600 dark:text-gray-400">Banco:</div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">{{ bankAccounts[0].bankName }}</div>
                      
                      <div class="text-gray-600 dark:text-gray-400">Cuenta:</div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">{{ bankAccounts[0].accountNumber }}</div>
                      
                      <div class="text-gray-600 dark:text-gray-400">SWIFT/BIC:</div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">{{ bankAccounts[0].swiftCode }}</div>
                      
                      <div class="text-gray-600 dark:text-gray-400">Titular:</div>
                      <div class="font-medium text-gray-800 dark:text-gray-200">{{ bankAccounts[0].accountHolder }}</div>
                    </div>
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
                      <img :src="paymentProof.imageUrl" class="w-full h-28 object-cover rounded-lg">
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

          <!-- Paso 2: Detalles del pago -->
          <div v-else class="space-y-6">
            <!-- ... existing content ... -->
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between space-x-3">
            <button
              v-if="currentStep === 2"
              @click="currentStep = 1"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
            >
              Atrás
            </button>
            <div class="flex space-x-3 ml-auto">
              <button
                @click="emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                @click="currentStep === 1 ? nextStep() : confirmPayment()"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ currentStep === 1 ? 'Continuar' : 'Confirmar Pago' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 