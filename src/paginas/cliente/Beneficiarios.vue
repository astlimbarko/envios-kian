<script setup>
import { ref, computed } from 'vue'
import BeneficiariosModales from './BeneficiariosModales.vue'
import clientesData from '../../assets/clientes.json'

// Estados para los modales
const showAddModal = ref(false)
const showQuickAccessModal = ref(false)
const showEditModal = ref(false)
const selectedBeneficiario = ref(null)

// Búsqueda
const searchTerm = ref('')

// Cargar beneficiarios desde el JSON
const beneficiarios = ref(clientesData)

// Formulario para editar beneficiario
const formData = ref({
  titular: '',
  carnetIdentidad: '',
  complemento: '',
  banco: '',
  numeroCuenta: '',
  tipoCuenta: '',
  sucursal: '',
  QR: false,
  cuentaBancaria: false
})

// Código de acceso rápido
const accessCode = ref('')
const isCodeValid = ref(false)
const codePattern = /^\d{3}-\d{3}$/

// Validación del código de acceso rápido
const validateAccessCode = () => {
  isCodeValid.value = codePattern.test(accessCode.value)
}

// Resetear formulario
const resetForm = () => {
  formData.value = {
    titular: '',
    carnetIdentidad: '',
    complemento: '',
    banco: '',
    numeroCuenta: '',
    tipoCuenta: '',
    sucursal: '',
    QR: false,
    cuentaBancaria: false
  }
}

// Abrir el modal de nuevos beneficiarios
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

// Abrir el modal de edición
const openEditModal = (beneficiario) => {
  selectedBeneficiario.value = beneficiario
  formData.value = { ...beneficiario }
  showEditModal.value = true
}

// Abrir el modal de acceso rápido
const openQuickAccessModal = () => {
  accessCode.value = ''
  isCodeValid.value = false
  showQuickAccessModal.value = true
}

// Filtrar beneficiarios según término de búsqueda
const filteredBeneficiarios = computed(() => {
  if (!searchTerm.value) return beneficiarios.value
  
  const term = searchTerm.value.toLowerCase()
  return beneficiarios.value.filter(b => 
    b.titular.toLowerCase().includes(term) ||
    b.banco?.toLowerCase().includes(term)
  )
})

// Guardar nuevo beneficiario
const saveBeneficiario = () => {
  // Aquí iría la lógica para guardar en la base de datos
  beneficiarios.value.push({
    id: beneficiarios.value.length + 1,
    ...formData.value
  })
  showAddModal.value = false
}

// Modificar beneficiario existente
const updateBeneficiario = () => {
  const index = beneficiarios.value.findIndex(b => b.id === selectedBeneficiario.value.id)
  if (index !== -1) {
    beneficiarios.value[index] = { ...selectedBeneficiario.value, ...formData.value }
  }
  showEditModal.value = false
}

// Procesar código de acceso rápido
const processAccessCode = () => {
  if (isCodeValid.value) {
    // Aquí iría la lógica para verificar el código en el backend
    showQuickAccessModal.value = false
    showAddModal.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Beneficiarios</h1>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="openQuickAccessModal"
            class="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded flex items-center justify-center text-sm transition-colors"
          >
            <i class="fas fa-qrcode mr-2"></i> Registro Rápido
          </button>
          <button 
            @click="openAddModal" 
            class="w-full sm:w-auto bg-[#146EBE] hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center text-sm transition-colors"
          >
            <i class="fas fa-plus mr-2"></i> Nuevo Beneficiario
          </button>
        </div>
      </div>
      
      <!-- Panel de búsqueda -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row gap-2">
            <div class="relative flex-grow">
              <input 
                v-model="searchTerm"
                type="text" 
                placeholder="Buscar beneficiario..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
              <div class="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <button class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <i class="fas fa-filter"></i>
            </button>
          </div>
        </div>
        
        <!-- Lista de beneficiarios -->
        <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-[calc(100vh-300px)] overflow-y-auto">
          <div v-if="beneficiarios.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No hay beneficiarios registrados.
          </div>
          
          <div v-for="beneficiario in filteredBeneficiarios" 
               :key="beneficiario.id" 
               @click="openEditModal(beneficiario)"
               class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <i class="fas fa-user text-blue-600 dark:text-blue-300"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ beneficiario.titular }}</h3>
                  <div class="flex items-center space-x-2 mt-1">
                    <span v-if="beneficiario.QR === 'true'" class="text-green-600 dark:text-green-400 flex items-center">
                      <i class="fas fa-qrcode mr-1"></i> QR
                    </span>
                    <span v-if="beneficiario.cuentaBancaria === 'true'" class="text-blue-600 dark:text-blue-400 flex items-center">
                      <i class="fas fa-university mr-1"></i> Cuenta Bancaria
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div v-if="beneficiario.banco" class="text-sm text-gray-600 dark:text-gray-300">
                  {{ beneficiario.banco }}
                </div>
                <div v-if="beneficiario.numeroCuenta" class="text-sm text-gray-500 dark:text-gray-400">
                  {{ beneficiario.numeroCuenta }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Importar componente de modales -->
    <BeneficiariosModales
      v-model:showAddModal="showAddModal"
      v-model:showQuickAccessModal="showQuickAccessModal"
      v-model:showEditModal="showEditModal"
      v-model:formData="formData"
      v-model:accessCode="accessCode"
      v-model:isCodeValid="isCodeValid"
      :isEditing="!!selectedBeneficiario"
      @saveBeneficiario="saveBeneficiario"
      @updateBeneficiario="updateBeneficiario"
      @validateAccessCode="validateAccessCode"
      @processAccessCode="processAccessCode"
    />
  </div>
</template>

<style scoped>
/* Estilo Windows 11 para toda la interfaz */
.bg-white, .dark .bg-gray-800 {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(209, 213, 219, 0.3);
  backdrop-filter: blur(10px);
}

/* Estilo para botones */
button {
  transition: all 0.15s ease;
  border-radius: 6px;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Estilo para inputs y selects */
input, select, textarea {
  border-radius: 6px;
  transition: all 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(20, 110, 190, 0.2);
}

.dark input:focus, .dark select:focus, .dark textarea:focus {
  box-shadow: 0 0 0 3px rgba(20, 110, 190, 0.4);
}

/* Efectos hover para items de beneficiarios */
div[class*='p-4 hover:bg-gray-50'] {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0.15rem 0;
}

div[class*='p-4 hover:bg-gray-50']:hover {
  background-color: rgba(20, 110, 190, 0.05);
  transform: translateX(2px);
}

/* Estilo para scrollbar */
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

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
</style> 