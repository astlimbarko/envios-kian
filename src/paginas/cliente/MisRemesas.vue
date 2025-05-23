<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Mis Remesas</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Completa los siguientes pasos para enviar tu dinero
        </p>
      </div>

      <!-- Barra de progreso -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div 
            v-for="step in 4" 
            :key="step"
            class="flex-1 text-center"
          >
            <div 
              class="w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-300"
              :class="[
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ step }}
            </div>
            <div 
              class="text-xs mt-2 font-medium"
              :class="[
                currentStep >= step 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              ]"
            >
              {{ 
                step === 1 ? 'Envío' :
                step === 2 ? 'Recepción' :
                step === 3 ? 'Pago' :
                'Resumen'
              }}
            </div>
          </div>
        </div>
        <div class="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
          <div 
            class="absolute h-1 bg-blue-600 rounded-full transition-all duration-300"
            :style="{ width: `${(currentStep - 1) * 33.33}%` }"
          ></div>
        </div>
      </div>

      <!-- Contenedor de pasos -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <!-- Paso 1: Formulario de envío -->
        <div v-show="currentStep >= 1" class="p-6">
          <FormularioEnvio 
            :paises="paises"
            :cambioEstandar="cambioEstandar"
            :cambioEspecial="cambioEspecial"
            @siguiente-paso="handleSiguientePaso"
            @datos="handleFormularioDatos"
          />
        </div>

        <!-- Paso 2: Método de recepción -->
        <div v-show="currentStep >= 2" class="p-6">
          <MetodoRecepcion 
            :beneficiarios="beneficiarios"
            :departamentos="departamentos"
            @siguiente-paso="handleSiguientePaso"
          />
        </div>

        <!-- Paso 3: Método de pago -->
        <div v-show="currentStep >= 3" class="p-6">
          <MetodoPagoSuecia 
            @siguiente-paso="handleSiguientePaso"
          />
        </div>

        <!-- Paso 4: Resumen -->
        <div v-show="currentStep >= 4" class="p-6">
          <ResumenRemesa 
            @siguiente-paso="handleSiguientePaso"
            @confirmado="handleSubmit"
          />
        </div>
      </div>

      <!-- Botones de navegación -->
      <div class="mt-6 flex justify-between">
        <button 
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Anterior
        </button>
        <div v-else></div>
        
        <button 
          v-if="currentStep < 4"
          @click="nextStep"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Siguiente
          <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Notificación de éxito -->
    <div 
      v-if="showSuccessNotification" 
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>¡Remesa enviada con éxito!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FormularioEnvio from './remesas/FormularioEnvio.vue'
import MetodoPagoSuecia from './remesas/MetodoPagoSuecia.vue'
import ResumenRemesa from './remesas/ResumenRemesa.vue'
import MetodoRecepcion from './remesas/MetodoRecepcion.vue'
import { useRemesaStore } from '../../store/remesa'

// Estados para el formulario
const currentStep = ref(1)
const showSuccessNotification = ref(false)
const datosRemesa = ref({
  montoEnviar: '',
  montoRecibir: '',
  tipoCambio: 0,
  pais: null,
  metodoRecepcion: null,
  metodoPago: null,
  destinatario: null,
  comprobante: null,
  qrCode: null,
  nombreBeneficiario: null,
  cuenta: null
})

// Datos para los tipos de cambio
const cambioEstandar = ref(1.08)
const cambioEspecial = ref(1.09)

// Lista de países
const paises = ref([
  {
    nombre: 'Bolivia',
    codigo: 'BO',
    moneda: 'BOB',
    bandera: '/flag_bo.svg'
  }
])

// Lista de beneficiarios
const beneficiarios = ref([
  {
    id: 1,
    nombre: 'María González',
    documento: '12345678',
    telefono: '591-76543210',
    departamento: 'Santa Cruz'
  }
])

// Lista de departamentos
const departamentos = ref([
  'Santa Cruz',
  'La Paz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando'
])

// Cálculo del tipo de cambio a usar
const tipoCambio = computed(() => {
  if (cambioEstandar.value === cambioEspecial.value) return cambioEstandar.value
  if (Number(datosRemesa.value.montoRecibir) >= 5000) return cambioEspecial.value
  return cambioEstandar.value
})

// Función para avanzar al siguiente paso
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

// Función para retroceder al paso anterior
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Función para manejar los datos del formulario
const handleFormularioDatos = (datos) => {
  datosRemesa.value = {
    ...datosRemesa.value,
    ...datos
  }
  currentStep.value = 2
}

// Función para manejar el siguiente paso
const handleSiguientePaso = (paso) => {
  currentStep.value = paso
}

// Función para manejar el envío final
const handleSubmit = () => {
  showSuccessNotification.value = true
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 5000)
}

// Inicializar el store
const store = useRemesaStore()
</script>

<style scoped>
/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Animación para los pasos */
[v-show] {
  display: block !important;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

/* Efecto de hover en botones */
button {
  transition: all 0.15s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Animación para la notificación */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fixed.top-4.right-4 {
  animation: slideIn 0.3s ease-out forwards;
}
</style>