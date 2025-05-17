<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['close', 'newRemittance'])

// Estado para el proceso de tres pasos
const currentStep = ref(1)
const recipientType = ref('existing')
const selectedRecipient = ref(null)

// Estado para nuevo beneficiario
const newRecipient = ref({
  fullName: '',
  city: '',
  country: 'Bolivia',
  phone: '',
  email: ''
})

// Estado para los datos de la remesa
const remittanceData = ref({
  recipient: '',
  location: '',
  amount: '',
  currency: 'SEK',
  receivedAmount: '',
  receivedCurrency: 'BOB',
  status: 'En Progreso',
  statusClass: 'yellow',
  paymentMethod: 'Pendiente',
  receiveMethod: 'Pendiente',
  trackingCode: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
})

// Tipo de cambio (esto vendría de la base de datos)
const exchangeRate = ref(1.08)

// Lista de beneficiarios existentes (simulada)
const existingRecipients = ref([
  { 
    id: 1, 
    fullName: 'María González', 
    city: 'Santa Cruz',
    country: 'Bolivia',
    phone: '+591 76543210',
    email: 'maria@email.com'
  },
  { 
    id: 2, 
    fullName: 'Juan Pérez', 
    city: 'La Paz',
    country: 'Bolivia',
    phone: '+591 76543211',
    email: 'juan@email.com'
  },
  { 
    id: 3, 
    fullName: 'Ana Martínez', 
    city: 'Cochabamba',
    country: 'Bolivia',
    phone: '+591 76543212',
    email: 'ana@email.com'
  }
])

// Validación del paso 1
const isStep1Valid = computed(() => {
  return recipientType.value !== ''
})

// Validación del paso 2
const isStep2Valid = computed(() => {
  if (recipientType.value === 'existing') {
    return selectedRecipient.value !== null
  }
  return newRecipient.value.fullName.trim() !== '' && 
         newRecipient.value.city.trim() !== ''
})

// Validación del paso 3
const isStep3Valid = computed(() => {
  return remittanceData.value.amount !== '' && 
         parseFloat(remittanceData.value.amount) > 0
})

// Calcular monto a recibir
const calculateReceivedAmount = (amount) => {
  if (!amount) return ''
  const calculated = parseFloat(amount) * exchangeRate.value
  return calculated.toFixed(2)
}

// Actualizar monto a recibir cuando cambia el monto a enviar
watch(() => remittanceData.value.amount, (newAmount) => {
  remittanceData.value.receivedAmount = calculateReceivedAmount(newAmount)
})

// Función para avanzar al siguiente paso
const nextStep = () => {
  if (currentStep.value === 1 && isStep1Valid.value) {
    currentStep.value = 2
  } else if (currentStep.value === 2 && isStep2Valid.value) {
    if (recipientType.value === 'existing') {
      remittanceData.value.recipient = selectedRecipient.value.fullName
      remittanceData.value.location = `${selectedRecipient.value.city}, ${selectedRecipient.value.country}`
    } else {
      remittanceData.value.recipient = newRecipient.value.fullName
      remittanceData.value.location = `${newRecipient.value.city}, ${newRecipient.value.country}`
    }
    currentStep.value = 3
  }
}

// Función para retroceder al paso anterior
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Función para crear la remesa
const createRemittance = () => {
  if (isStep3Valid.value) {
    const newRemittance = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      ...remittanceData.value
    }
    emit('newRemittance', newRemittance)
    emit('close')
  }
}

// Calcular el progreso
const progress = computed(() => {
  return (currentStep.value / 3) * 100
})
</script>

<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      
      <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
        <!-- Barra de progreso -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div 
            class="bg-blue-600 h-2 transition-all duration-300 ease-in-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ currentStep === 1 ? 'Tipo de Beneficiario' : 
                 currentStep === 2 ? (recipientType === 'existing' ? 'Seleccionar Beneficiario' : 'Nuevo Beneficiario') : 
                 'Detalles de la Remesa' }}
            </h3>
            <button @click="emit('close')" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Contenido -->
        <div class="bg-white dark:bg-gray-800 px-6 py-4">
          <!-- Paso 1: Selección de tipo de beneficiario -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <label class="relative flex p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
                :class="[
                  recipientType === 'existing'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                ]"
              >
                <input 
                  type="radio"
                  v-model="recipientType"
                  value="existing" 
                  class="sr-only"
                />
                <div class="flex items-center">
                  <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                    :class="recipientType === 'existing' ? 'border-blue-500' : 'border-gray-300'">
                    <div v-if="recipientType === 'existing'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <i class="fas fa-user-check text-2xl mb-2 text-blue-500"></i>
                    <div class="font-medium">Beneficiario Existente</div>
                  </div>
                </div>
              </label>

              <label class="relative flex p-4 rounded-lg border-2 cursor-pointer transition-all duration-200"
                :class="[
                  recipientType === 'new'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                ]"
              >
                <input
                  type="radio"
                  v-model="recipientType"
                  value="new"
                  class="sr-only"
                />
                <div class="flex items-center">
                  <div class="w-6 h-6 border-2 rounded-full flex items-center justify-center mr-3"
                    :class="recipientType === 'new' ? 'border-blue-500' : 'border-gray-300'">
                    <div v-if="recipientType === 'new'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <i class="fas fa-user-plus text-2xl mb-2 text-blue-500"></i>
                    <div class="font-medium">Nuevo Beneficiario</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Paso 2: Selección o formulario de beneficiario -->
          <div v-if="currentStep === 2" class="space-y-6">
            <!-- Selección de beneficiario existente -->
            <div v-if="recipientType === 'existing'" class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seleccionar Beneficiario
              </label>
              <select
                v-model="selectedRecipient"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option :value="null">Seleccione un beneficiario</option>
                <option v-for="recipient in existingRecipients" :key="recipient.id" :value="recipient">
                  {{ recipient.fullName }} - {{ recipient.city }}
                </option>
              </select>

              <!-- Detalles del beneficiario seleccionado -->
              <div v-if="selectedRecipient" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles del Beneficiario</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400">Nombre Completo</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedRecipient.fullName }}</p>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400">Ciudad</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedRecipient.city }}</p>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400">País</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedRecipient.country }}</p>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400">Teléfono</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ selectedRecipient.phone }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario para nuevo beneficiario -->
            <div v-else class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    v-model="newRecipient.fullName"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese el nombre completo"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    v-model="newRecipient.city"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese la ciudad"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    País
                  </label>
                  <select
                    v-model="newRecipient.country"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Bolivia">Bolivia</option>
                    <option value="Perú">Perú</option>
                    <option value="Chile">Chile</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    v-model="newRecipient.phone"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="+591 76543210"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Paso 3: Detalles de la Remesa -->
          <div v-if="currentStep === 3" class="space-y-6">


            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda de Envío
                </label>
                <select 
                  v-model="remittanceData.currency"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="SEK">SEK</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Moneda de Recepción
                </label>
                <select 
                  v-model="remittanceData.receivedCurrency"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="BOB">BOB</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monto a Enviar
                </label>
                <input 
                  type="number"
                  v-model="remittanceData.amount"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el monto"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Monto a Recibir
                </label>
                <div class="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                  {{ remittanceData.receivedAmount }} {{ remittanceData.receivedCurrency }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between space-x-3">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
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
                @click="currentStep === 3 ? createRemittance() : nextStep()"
                :disabled="currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : !isStep3Valid"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ currentStep === 3 ? 'Finalizar' : 'Continuar' }}
              </button>
            </div>
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

/* Estilo elegante para Windows 11 */
input, select, textarea {
  border-radius: 6px;
  min-height: 40px;
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
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style> 