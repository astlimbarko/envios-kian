<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'paymentCompleted'])

// Estado para el paso actual
const currentStep = ref(1)

// Estado para el método de pago seleccionado
const selectedPaymentMethod = ref('qr')

// Estado para el QR
const qrFile = ref(null)
const lastUsedQR = ref('/src/assets/QR.png')
const selectedQR = ref('last') // 'last' o 'new'

// Estado para las cuentas bancarias
const bankAccounts = ref([
  {
    id: 1,
    bankName: 'Banco Nacional de Bolivia',
    accountType: 'Ahorro',
    branch: 'Santa Cruz',
    accountNumber: '1234567890',
    ciNumber: '1234567',
    isSelected: false
  },
  {
    id: 2,
    bankName: 'Banco Mercantil Santa Cruz',
    accountType: 'Cuenta Corriente',
    branch: 'La Paz',
    accountNumber: '0987654321',
    ciNumber: '7654321',
    isSelected: false
  }
])

// Estado para nueva cuenta bancaria
const newBankAccount = ref({
  bankName: '',
  accountType: '',
  branch: '',
  accountNumber: '',
  ciNumber: ''
})

// Lista de bancos de Bolivia
const banksList = [
  'Banco Nacional de Bolivia',
  'Banco Mercantil Santa Cruz',
  'Banco BISA',
  'Banco Ganadero',
  'Banco Fassil',
  'Banco Unión',
  'Banco Económico',
  'Banco Fortaleza',
  'Banco Prodem'
]

// Lista de departamentos de Bolivia
const departments = [
  'La Paz',
  'Santa Cruz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando'
]

// Computed para validar el formulario
const isFormValid = computed(() => {
  if (currentStep.value === 1) {
    return selectedPaymentMethod.value !== ''
  } else {
    if (selectedPaymentMethod.value === 'qr') {
      return selectedQR.value !== ''
    } else {
      return bankAccounts.value.some(account => account.isSelected) || 
             (newBankAccount.value.bankName && 
              newBankAccount.value.accountType &&
              newBankAccount.value.branch &&
              newBankAccount.value.accountNumber && 
              newBankAccount.value.ciNumber)
    }
  }
})

// Función para manejar la subida de QR
const handleQRUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    qrFile.value = URL.createObjectURL(file)
    selectedQR.value = 'new'
  }
}

// Función para seleccionar cuenta bancaria
const selectBankAccount = (accountId) => {
  bankAccounts.value.forEach(account => {
    account.isSelected = account.id === accountId
  })
}

// Función para agregar nueva cuenta bancaria
const addNewBankAccount = () => {
  if (newBankAccount.value.bankName && 
      newBankAccount.value.accountType &&
      newBankAccount.value.branch &&
      newBankAccount.value.accountNumber && 
      newBankAccount.value.ciNumber) {
    bankAccounts.value.push({
      id: bankAccounts.value.length + 1,
      ...newBankAccount.value,
      isSelected: true
    })
    // Limpiar el formulario
    newBankAccount.value = {
      bankName: '',
      accountType: '',
      branch: '',
      accountNumber: '',
      ciNumber: ''
    }
  }
}

// Función para continuar al siguiente paso
const nextStep = () => {
  if (currentStep.value === 1) {
    currentStep.value = 2
  } else {
    // Aquí iría la lógica para procesar la selección
    emit('paymentCompleted', {
      method: selectedPaymentMethod.value,
      selectedQR: selectedQR.value === 'last' ? lastUsedQR.value : qrFile.value,
      selectedAccount: bankAccounts.value.find(account => account.isSelected)
    })
    emit('close')
  }
}

// Función para volver al paso anterior
const previousStep = () => {
  if (currentStep.value === 2) {
    currentStep.value = 1
  }
}
</script>

<template>
  <!-- Modal -->
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            Pago a Destinatario
          </h3>
          <button @click="emit('close')" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Contenido -->
      <div class="px-6 py-4">
        <!-- Paso 1: Selección de método de pago -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <label class="relative flex p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
              :class="[
                selectedPaymentMethod === 'qr'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              ]"
            >
              <input
                type="radio"
                v-model="selectedPaymentMethod"
                value="qr"
                class="sr-only"
              />
              <div class="flex items-center">
                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                  :class="selectedPaymentMethod === 'qr' ? 'border-blue-500' : 'border-gray-300'">
                  <div v-if="selectedPaymentMethod === 'qr'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <i class="fas fa-qrcode text-2xl mb-2 text-blue-500"></i>
                  <div class="font-medium">Pago por QR</div>
                </div>
              </div>
            </label>

            <label class="relative flex p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
              :class="[
                selectedPaymentMethod === 'transfer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              ]"
            >
              <input
                type="radio"
                v-model="selectedPaymentMethod"
                value="transfer"
                class="sr-only"
              />
              <div class="flex items-center">
                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                  :class="selectedPaymentMethod === 'transfer' ? 'border-blue-500' : 'border-gray-300'">
                  <div v-if="selectedPaymentMethod === 'transfer'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <i class="fas fa-university text-2xl mb-2 text-blue-500"></i>
                  <div class="font-medium">Transferencia Bancaria</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Paso 2: Detalles según método seleccionado -->
        <div v-else class="space-y-6">
          <!-- Opción QR -->
          <div v-if="selectedPaymentMethod === 'qr'" class="grid grid-cols-2 gap-6">
            <!-- QR existente -->
            <div class="border rounded-lg p-4">
              <label class="relative flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="selectedQR"
                  value="last"
                  class="sr-only"
                />
                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mb-3"
                  :class="selectedQR === 'last' ? 'border-blue-500' : 'border-gray-300'">
                  <div v-if="selectedQR === 'last'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Último QR utilizado
                </h4>
                <img :src="lastUsedQR" alt="QR Code" class="w-full max-w-[200px] mx-auto" />
              </label>
            </div>

            <!-- Subir nuevo QR -->
            <div class="border rounded-lg p-4">
              <label class="relative flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  v-model="selectedQR"
                  value="new"
                  class="sr-only"
                />
                <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mb-3"
                  :class="selectedQR === 'new' ? 'border-blue-500' : 'border-gray-300'">
                  <div v-if="selectedQR === 'new'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Subir nuevo QR
                </h4>
                <div class="w-full">
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                    <div class="space-y-1 text-center">
                      <i class="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                      <div class="flex text-sm text-gray-600 dark:text-gray-400">
                        <label class="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                          <span>Subir archivo</span>
                          <input type="file" class="sr-only" accept="image/*" @change="handleQRUpload">
                        </label>
                        <p class="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF hasta 10MB
                      </p>
                    </div>
                  </div>
                  <!-- Vista previa de la imagen -->
                  <div v-if="qrFile" class="mt-4">
                    <img :src="qrFile" alt="QR Preview" class="w-full max-w-[200px] mx-auto" />
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Opción Transferencia Bancaria -->
          <div v-else class="grid grid-cols-2 gap-6">
            <!-- Cuentas existentes -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cuentas bancarias guardadas
              </h4>
              <div class="space-y-3 max-h-[400px] overflow-y-auto">
                <div
                  v-for="account in bankAccounts"
                  :key="account.id"
                  @click="selectBankAccount(account.id)"
                  :class="[
                    'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                    account.isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  ]"
                >
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium">{{ account.bankName }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ account.accountType }} - {{ account.branch }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        Cuenta: {{ account.accountNumber }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        C.I.: {{ account.ciNumber }}
                      </div>
                    </div>
                    <div v-if="account.isSelected" class="text-blue-500">
                      <i class="fas fa-check-circle"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nueva cuenta bancaria -->
            <div class="border rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Agregar nueva cuenta bancaria
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre del banco
                  </label>
                  <select
                    v-model="newBankAccount.bankName"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione un banco</option>
                    <option v-for="bank in banksList" :key="bank" :value="bank">
                      {{ bank }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tipo de cuenta
                  </label>
                  <select
                    v-model="newBankAccount.accountType"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione tipo de cuenta</option>
                    <option value="Ahorro">Ahorro</option>
                    <option value="Cuenta Corriente">Cuenta Corriente</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sucursal del banco
                  </label>
                  <select
                    v-model="newBankAccount.branch"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccione departamento</option>
                    <option v-for="dept in departments" :key="dept" :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de cuenta
                  </label>
                  <input
                    type="text"
                    v-model="newBankAccount.accountNumber"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Número de cuenta"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de C.I. del beneficiario
                  </label>
                  <input
                    type="text"
                    v-model="newBankAccount.ciNumber"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Número de C.I."
                  />
                </div>

                <button
                  @click="addNewBankAccount"
                  class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Agregar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pie del modal -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
        <div class="flex justify-between space-x-3">
          <button
            v-if="currentStep === 2"
            @click="previousStep"
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
              @click="nextStep"
              :disabled="!isFormValid"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ currentStep === 1 ? 'Continuar' : 'Finalizar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones para el modal */
.fixed.inset-0 > div {
  animation: modalFadeIn 0.2s ease-out forwards;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Estilos para el input file */
input[type="file"] {
  display: none;
}

/* Estilos para el hover de las tarjetas */
.border-dashed:hover {
  border-color: var(--color-blue-primary);
}

/* Estilos para el scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
