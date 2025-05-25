<template>
    <div class="min-h-screen py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="remesa in remesas" 
          :key="remesa.id"
          class="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl shadow-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-white">{{ remesa.recipient }}</h3>
              <p class="text-blue-100/80">{{ remesa.date }}</p>
            </div>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="{
                'bg-yellow-500/20 text-yellow-200': remesa.status === 'En Progreso',
                'bg-green-500/20 text-green-200': remesa.status === 'Completada',
                'bg-red-500/20 text-red-200': remesa.status === 'Cancelada'
              }"
            >
              {{ remesa.status }}
            </span>
          </div>
  
          <div class="space-y-2 text-white">
            <p class="flex justify-between">
              <span class="text-blue-100/80">Monto enviado:</span>
              <span class="font-medium">{{ remesa.amount }} {{ remesa.currency }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-blue-100/80">Monto recibido:</span>
              <span class="font-medium">{{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-blue-100/80">Método de pago:</span>
              <span class="font-medium">{{ remesa.paymentMethod }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-blue-100/80">Método de recepción:</span>
              <span class="font-medium">{{ remesa.receiveMethod }}</span>
            </p>
          </div>
  
          <div class="mt-4 pt-4 border-t border-blue-500/20">
            <p class="text-blue-100/80 text-sm">
              Código de seguimiento: <span class="font-medium text-white">{{ remesa.trackingCode }}</span>
            </p>
          </div>
  
          <!-- Botones de acción -->
          <div class="mt-4 flex justify-end space-x-2">
            <button 
              v-if="remesa.status === 'En Progreso'"
              @click="confirmarCancelacion(remesa)"
              class="px-3 py-1.5 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="verDetalles(remesa)"
              class="px-3 py-1.5 bg-blue-500/20 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
  
      <!-- Modal de Detalles -->
      <div v-if="showDetailsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Detalles de la Remesa</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Información completa de la transacción</p>
            </div>
            <button @click="showDetailsModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
            <div v-if="selectedRemesa" class="space-y-4">
              <!-- ... existing modal content ... -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de Confirmación de Cancelación -->
      <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
          <div class="p-6 text-center">
            <div class="mb-4">
              <i class="fas fa-exclamation-triangle text-4xl text-yellow-500"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Cancelar Remesa?</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas cancelar esta remesa?
            </p>
            <div class="flex justify-center space-x-4">
              <button 
                @click="showCancelModal = false"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No, mantener
              </button>
              <button 
                @click="cancelarRemesa"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Toast Notification -->
      <div 
        v-if="showToast"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in"
      >
        <i class="fas fa-check-circle"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRemesaStore } from '../../../store/remesa'
  
  const store = useRemesaStore()
  const remesas = ref([])
  const showDetailsModal = ref(false)
  const showCancelModal = ref(false)
  const selectedRemesa = ref(null)
  const remesaToCancel = ref(null)
  const showToast = ref(false)
  const toastMessage = ref('')
  
  onMounted(() => {
    remesas.value = store.remesas
  })
  
  function verDetalles(remesa) {
    selectedRemesa.value = remesa
    showDetailsModal.value = true
  }
  
  function confirmarCancelacion(remesa) {
    remesaToCancel.value = remesa
    showCancelModal.value = true
  }
  
  function cancelarRemesa() {
    if (remesaToCancel.value) {
      // Aquí iría la lógica para cancelar la remesa en la base de datos
      const index = remesas.value.findIndex(r => r.id === remesaToCancel.value.id)
      if (index !== -1) {
        remesas.value[index].status = 'Cancelada'
      }
      
      // Mostrar toast
      showToast.value = true
      toastMessage.value = 'Remesa cancelada exitosamente'
      
      // Ocultar toast después de 3 segundos
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }
    
    showCancelModal.value = false
    remesaToCancel.value = null
  }
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>
  