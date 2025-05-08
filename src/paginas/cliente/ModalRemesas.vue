<script setup>
import { ref, computed } from 'vue'
import MisRemesasTerminos from './MisRemesasTerminos.vue'
import MisRemesasNueva from './MisRemesasNueva.vue'
import MisRemesasPago from './MisRemesasPago.vue'
import MisRemesasResumen from './MisRemesasResumen.vue'
import MisRemesasDetalle from './MisRemesasDetalle.vue'
import ModalPasosEnvios from './ModalPasosEnvios.vue'
import BotonGradiente from '../../components/BotonGradiente.vue'

const props = defineProps({
  // Props para modal de términos
  showTermsModal: Boolean,
  
  // Props para modal de remesa
  showRemittanceModal: Boolean,
  currentStep: Number,
  remittanceData: Object,
  
  // Props para modal de detalles
  showDetailModal: Boolean,
  selectedRemittance: Object
})

const emit = defineEmits([
  'acceptTerms', 'closeTerms', 
  'closeRemittanceModal', 'goToPayment', 'goToSummary', 'goBack', 'confirmSend',
  'closeDetailModal'
])

// Calcular el título del modal de pasos según el paso actual
const modalTitle = computed(() => {
  if (props.currentStep === 1) return 'Nueva Remesa'
  if (props.currentStep === 2) return 'Método de Pago'
  return 'Resumen de la Transacción'
})
</script>

<template>
  <!-- Modal de Términos y Condiciones -->
  <MisRemesasTerminos 
    :showTermsModal="showTermsModal"
    @acceptTerms="$emit('acceptTerms')"
    @closeTerms="$emit('closeTerms')"
  />
  
  <!-- Modal principal con pasos para crear una remesa -->
  <ModalPasosEnvios
    :showModal="showRemittanceModal"
    :title="modalTitle"
    :currentStep="currentStep"
    :showStepIndicator="true"
    :maxStep="3"
    @close="$emit('closeRemittanceModal')"
    @goBack="$emit('goBack')"
    @goForward="currentStep === 1 ? $emit('goToPayment') : currentStep === 2 ? $emit('goToSummary') : null"
    @confirm="$emit('confirmSend')"
  >
    <!-- Paso 1: Datos de la remesa -->
    <MisRemesasNueva
      v-if="currentStep === 1"
      :showRemittanceModal="showRemittanceModal"
      :currentStep="currentStep"
      :remittanceData="remittanceData"
      @goToPayment="$emit('goToPayment')"
      @goBack="$emit('goBack')"
      @close="$emit('closeRemittanceModal')"
    />
    
    <!-- Paso 2: Método de pago -->
    <MisRemesasPago
      v-if="currentStep === 2"
      :showRemittanceModal="showRemittanceModal"
      :currentStep="currentStep"
      :remittanceData="remittanceData"
      @goToSummary="$emit('goToSummary')"
      @goBack="$emit('goBack')"
      @close="$emit('closeRemittanceModal')"
    />
    
    <!-- Paso 3: Resumen de la transacción -->
    <MisRemesasResumen
      v-if="currentStep === 3"
      :showRemittanceModal="showRemittanceModal"
      :currentStep="currentStep"
      :remittanceData="remittanceData"
      @confirmSend="$emit('confirmSend')"
      @goBack="$emit('goBack')"
      @close="$emit('closeRemittanceModal')"
    />
    
    <!-- Pie del modal -->
    <template #footer>
      <div class="flex justify-between items-center">
        <button 
          v-if="currentStep > 1"
          @click="$emit('goBack')" 
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </button>
        <div v-else></div>
        
        <div class="flex space-x-3">
          <button 
            @click="$emit('closeRemittanceModal')" 
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 rounded-md"
          >
            Cancelar
          </button>
          
          <BotonGradiente 
            v-if="currentStep === 1"
            texto="Continuar" 
            icono="arrow-right" 
            @click="$emit('goToPayment')" 
          />
          
          <button 
            v-else-if="currentStep === 2"
            @click="$emit('goToSummary')" 
            class="px-4 py-2 bg-[#146EBE] text-white rounded-md hover:bg-blue-700 shadow-md flex items-center"
          >
            Revisar Resumen <i class="fas fa-arrow-right ml-2"></i>
          </button>
          
          <button 
            v-else
            @click="$emit('confirmSend')" 
            class="px-4 py-2 bg-[#146EBE] text-white rounded-md hover:bg-blue-700 shadow-md"
          >
            Confirmar Envío
          </button>
        </div>
      </div>
    </template>
  </ModalPasosEnvios>
  
  <!-- Modal de Detalles de Remesa -->
  <MisRemesasDetalle 
    :showDetailModal="showDetailModal"
    :remittance="selectedRemittance"
    @close="$emit('closeDetailModal')"
  />
</template> 