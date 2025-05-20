<script setup>
import { ref } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  datos: Object,
  onEnviar: Function
})

const acepto = ref(false)
const emit = defineEmits(['enviar'])

const enviar = () => {
  if (acepto.value) {
    emit('enviar')
  }
}
</script>

<template>
  <div class="w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resumen de la remesa</h2>
      <p class="text-gray-600 dark:text-gray-300">Verifica los datos antes de confirmar</p>
    </div>
    
    <!-- Resumen de la transacción -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-100 dark:border-gray-700">
      <div class="space-y-4">
        <!-- Información del beneficiario -->
        <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Información del beneficiario</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Nombre</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.destinatario?.nombre || '' }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Documento</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.destinatario?.documento || '' }}</p>
            </div>
          </div>
        </div>

        <!-- Métodos de pago y recepción -->
        <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Métodos de pago</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Recepción</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.metodoRecepcion || '' }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Pago</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.metodoPago || '' }}</p>
            </div>
          </div>
        </div>

        <!-- Montos y tipo de cambio -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Detalles de la transacción</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Monto a enviar</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.montoEnviar || '' }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Monto a recibir</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.montoRecibir || '' }}</p>
            </div>
            <div class="col-span-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">Tipo de cambio</span>
              <p class="font-medium text-gray-900 dark:text-white">{{ datos?.tipoCambio || '' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Términos y condiciones -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input 
            type="checkbox" 
            v-model="acepto" 
            id="acepto" 
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          >
        </div>
        <label for="acepto" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          He verificado todos los datos y acepto los 
          <a href="#" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline">
            términos y condiciones
          </a>
        </label>
      </div>
    </div>

    <!-- Botón Finalizar -->
    <div v-if="acepto" class="w-full mt-6">
      <BotonContinuar
        :texto="'Finalizar'"
        :textoCompletado="'¡Enviado!'"
        :colorInicial="'blue'"
        :colorCompletado="'emerald'"
        :deshabilitado="!acepto"
        @click="enviar"
      />
    </div>
  </div>
</template> 