<script setup>
import { ref, computed, watch } from 'vue'
import BotonGradiente from '../../components/BotonGradiente.vue'

const emit = defineEmits(['goToPayment', 'goBack', 'close'])

const props = defineProps({
  showRemittanceModal: Boolean,
  currentStep: Number,
  remittanceData: Object
})

// Tipo de cambio actual (1.09 SEK = 1 BOB)
const exchangeRate = ref(1.09)

// Valores locales para el envío y recepción
const sendAmount = ref(props.remittanceData?.amount?.toString() || "1000")
const receiveAmount = ref(((props.remittanceData?.amount || 1000) * exchangeRate.value).toFixed(2))

// Validar entrada y permitir solo números
const validateNumericInput = (value) => {
  // Eliminar caracteres no numéricos excepto puntos y comas
  return value.replace(/[^0-9.,]/g, '');
}

// Función para actualizar el monto de envío cuando cambia el monto de recepción
const updateSendAmount = (event) => {
  // Obtener el valor del evento
  let value = event.target.value;
  
  // Si el campo está vacío, establecer ambos valores a 0
  if (value === '' || value === null) {
    sendAmount.value = "0";
    receiveAmount.value = "0";
    props.remittanceData.amount = 0;
    return;
  }
  
  // Validar que solo sea numérico con punto o coma como separador decimal
  value = validateNumericInput(value);
  
  // Manejar el caso especial donde solo hay un punto o coma
  if (value === '.' || value === ',') {
    value = '0.';
    receiveAmount.value = value;
    return;
  }
  
  // Convertir comas a puntos si es necesario
  value = value.replace(',', '.');
  
  const parsedValue = parseFloat(value);
  if (!isNaN(parsedValue)) {
    receiveAmount.value = value; // Mantener el valor como texto para preservar el cursor
    sendAmount.value = (parsedValue / exchangeRate.value).toFixed(2);
    props.remittanceData.amount = parseFloat(sendAmount.value);
  }
}

// Función para actualizar el monto de recepción cuando cambia el monto de envío
const updateReceiveAmount = (event) => {
  // Obtener el valor del evento
  let value = event.target.value;
  
  // Si el campo está vacío, establecer ambos valores a 0
  if (value === '' || value === null) {
    sendAmount.value = "0";
    receiveAmount.value = "0";
    props.remittanceData.amount = 0;
    return;
  }
  
  // Validar que solo sea numérico con punto o coma como separador decimal
  value = validateNumericInput(value);
  
  // Manejar el caso especial donde solo hay un punto o coma
  if (value === '.' || value === ',') {
    value = '0.';
    sendAmount.value = value;
    return;
  }
  
  // Convertir comas a puntos si es necesario
  value = value.replace(',', '.');
  
  const parsedValue = parseFloat(value);
  if (!isNaN(parsedValue)) {
    sendAmount.value = value; // Mantener el valor como texto para preservar el cursor
    receiveAmount.value = (parsedValue * exchangeRate.value).toFixed(2);
    props.remittanceData.amount = parsedValue;
  }
}

// Mensaje informativo sobre la conversión
const conversionMessage = computed(() => {
  const sendValue = parseFloat(sendAmount.value) || 0;
  const receiveValue = parseFloat(receiveAmount.value) || 0;
  return `Si envías ${sendValue.toFixed(2)} ${props.remittanceData?.sendCurrency}, recibes ${receiveValue.toFixed(2)} ${props.remittanceData?.receiveCurrency}`;
})

// Actualizar cuando cambia la moneda
watch(() => props.remittanceData?.sendCurrency, () => {
  // Aquí se actualizaría el tipo de cambio según las monedas seleccionadas
  // Por ahora usamos el valor estático
  updateReceiveAmount({ target: { value: sendAmount.value } })
})

watch(() => props.remittanceData?.receiveCurrency, () => {
  // Aquí se actualizaría el tipo de cambio según las monedas seleccionadas
  // Por ahora usamos el valor estático
  updateReceiveAmount({ target: { value: sendAmount.value } })
})

// Asegurarse de que los valores se actualicen al abrir el modal
watch(() => props.showRemittanceModal, (newValue) => {
  if (newValue && props.remittanceData) {
    sendAmount.value = (props.remittanceData.amount || 0).toString()
    receiveAmount.value = ((props.remittanceData.amount || 0) * exchangeRate.value).toFixed(2)
  }
})
</script>

<template>
  <!-- Contenido del paso 1: Datos de la remesa -->
  <div v-if="showRemittanceModal && currentStep === 1" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
      <!-- Selección de destinatario -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-1 text-sm">Datos del Destinatario</h4>
        
        <div class="flex items-center space-x-4 mb-2">
          <div>
            <input 
              id="saved_recipient" 
              v-model="remittanceData.recipientType" 
              value="saved" 
              type="radio" 
              class="text-[#146EBE]"
            >
            <label for="saved_recipient" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Beneficiario guardado</label>
          </div>
          <div>
            <input 
              id="new_recipient" 
              v-model="remittanceData.recipientType" 
              value="new" 
              type="radio" 
              class="text-[#146EBE]"
            >
            <label for="new_recipient" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Nuevo beneficiario</label>
          </div>
        </div>
        
        <!-- Seleccionar beneficiario existente -->
        <div v-if="remittanceData.recipientType === 'saved'" class="space-y-2">
          <select 
            v-model="remittanceData.recipientId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
          >
            <option value="">Seleccione un beneficiario</option>
            <option value="1">María González - Bogotá, Colombia</option>
            <option value="2">Juan Martínez - La Paz, Bolivia</option>
            <option value="3">Carlos Ramírez - Santa Cruz, Bolivia</option>
          </select>
        </div>
        
        <!-- Nuevo beneficiario -->
        <div v-if="remittanceData.recipientType === 'new'" class="space-y-2">
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Nombre completo</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent">
          </div>
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">País</label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent">
              <option value="bolivia">Bolivia</option>
              <option value="colombia">Colombia</option>
              <option value="peru">Perú</option>
            </select>
          </div>
        </div>
        
        <!-- Guardar nuevo beneficiario -->
        <div v-if="remittanceData.recipientType === 'new'" class="mt-2">
          <div class="flex items-center">
            <input 
              id="save_new" 
              v-model="remittanceData.saveRecipient" 
              type="checkbox" 
              class="text-[#146EBE]"
            >
            <label for="save_new" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Guardar para futuros envíos</label>
          </div>
        </div>
      </div>
      
      <!-- Detalles de la remesa -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-1 text-sm">Detalles de la Remesa</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Moneda de envío</label>
            <select 
              v-model="remittanceData.sendCurrency"
              class="w-full min-w-[180px] px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent text-sm"
            >
              <option value="SEK">Corona Sueca (SEK)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dólar (USD)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Moneda de recepción</label>
            <select 
              v-model="remittanceData.receiveCurrency"
              class="w-full min-w-[180px] px-3 py-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent text-base"
            >
              <option value="BOB">Boliviano (BOB)</option>
              <option value="COP">Peso Colombiano (COP)</option>
              <option value="USD">Dólar (USD)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Método de recepción</label>
          <select 
            v-model="remittanceData.receiveMethod"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent text-sm"
          >
            <option value="qr">QR (Recomendado)</option>
            <option value="bank">Cuenta Bancaria</option>
          </select>
          <p v-if="remittanceData.receiveMethod === 'bank'" class="text-xs text-amber-600 dark:text-amber-400 mt-1">
            <i class="fas fa-info-circle mr-1"></i>
            Los depósitos a cuenta bancaria pueden demorar hasta 24 horas.
          </p>
        </div>
        
        <!-- Campos de monto uno al lado del otro -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Campo de monto a enviar -->
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Monto a enviar</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">{{ remittanceData.sendCurrency }}</span>
              <input 
                v-model="sendAmount"
                @input="updateReceiveAmount($event)"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                inputmode="decimal"
                min="0"
                class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" 
                placeholder="0.00"
              >
            </div>
          </div>
          
          <!-- Campo de monto a recibir -->
          <div>
            <label class="block text-xs text-gray-700 dark:text-gray-300 mb-1">Monto a recibir</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500 dark:text-gray-400">{{ remittanceData.receiveCurrency }}</span>
              <input 
                v-model="receiveAmount"
                @input="updateSendAmount($event)"
                type="text"
                pattern="[0-9]*[.,]?[0-9]*"
                inputmode="decimal"
                min="0"
                class="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" 
                placeholder="0.00"
              >
            </div>
          </div>
        </div>
        
        <!-- Mensaje informativo de la conversión - Ahora está después de los inputs -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border-l-4 border-blue-500 dark:border-blue-700 mt-3">
          <div class="flex items-center text-sm">
            <i class="fas fa-exchange-alt text-blue-500 dark:text-blue-400 mr-2"></i>
            <span class="text-blue-800 dark:text-blue-300 font-medium">{{ conversionMessage }}</span>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span class="font-medium">Tipo de cambio actual:</span> 1 {{ remittanceData.sendCurrency }} = {{ exchangeRate }} {{ remittanceData.receiveCurrency }}
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
  min-height: 40px; /* Reducida la altura mínima para todos los campos */
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
    row-gap: 1.5rem;
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