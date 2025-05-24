<script setup>
import { ref, computed } from 'vue'
import entidadesFinancieras from '../../assets/entidades_financieras_bolivia.json'

const props = defineProps({
  showAddModal: Boolean,
  showQuickAccessModal: Boolean,
  showEditModal: Boolean,
  formData: Object,
  accessCode: String,
  isCodeValid: Boolean,
  isEditing: Boolean
})

const emit = defineEmits([
  'update:showAddModal',
  'update:showQuickAccessModal',
  'update:showEditModal',
  'update:formData',
  'update:accessCode',
  'update:isCodeValid',
  'saveBeneficiario',
  'updateBeneficiario',
  'validateAccessCode',
  'processAccessCode'
])

const selectedMethod = ref('QR')
const qrImage = ref(null)

const departamentos = [
  'La Paz',
  'Cochabamba',
  'Santa Cruz',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando'
]

const updateFormData = (field, value) => {
  const updatedFormData = { ...props.formData }
  updatedFormData[field] = value
  emit('update:formData', updatedFormData)
}

const updateAccessCode = (value) => {
  emit('update:accessCode', value)
  emit('validateAccessCode')
}

const closeAddModal = () => {
  emit('update:showAddModal', false)
}

const closeEditModal = () => {
  emit('update:showEditModal', false)
}

const closeQuickAccessModal = () => {
  emit('update:showQuickAccessModal', false)
}

const saveBeneficiario = () => {
  emit('saveBeneficiario')
}

const updateBeneficiario = () => {
  emit('updateBeneficiario')
}

const processAccessCode = () => {
  emit('processAccessCode')
}

const handleQRUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      qrImage.value = e.target.result
      updateFormData('qrImage', e.target.result)
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <!-- Modal para agregar/editar beneficiario -->
  <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col dark:bg-gray-800 dark:text-gray-100">
      <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
          {{ isEditing ? 'Modificar Beneficiario' : 'Nuevo Beneficiario' }}
        </h3>
        <button @click="isEditing ? closeEditModal() : closeAddModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="overflow-y-auto flex-grow">
        <form @submit.prevent="isEditing ? updateBeneficiario() : saveBeneficiario()" class="p-6 space-y-6">
          <!-- Selección de método -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Método de Recepción</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input 
                  type="radio" 
                  id="method_qr" 
                  v-model="selectedMethod" 
                  value="QR"
                  class="hidden peer"
                >
                <label 
                  for="method_qr" 
                  class="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="text-center">
                    <i class="fas fa-qrcode text-2xl mb-2 text-gray-600 dark:text-gray-400"></i>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Código QR</div>
                  </div>
                </label>
              </div>
              <div>
                <input 
                  type="radio" 
                  id="method_bank" 
                  v-model="selectedMethod" 
                  value="BANCO"
                  class="hidden peer"
                >
                <label 
                  for="method_bank" 
                  class="flex items-center justify-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="text-center">
                    <i class="fas fa-university text-2xl mb-2 text-gray-600 dark:text-gray-400"></i>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Cuenta Bancaria</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Campos para QR -->
          <div v-if="selectedMethod === 'QR'" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre del Beneficiario *</label>
              <input 
                :value="formData.titular"
                @input="e => updateFormData('titular', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Código QR *</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                <div class="space-y-1 text-center">
                  <div v-if="!qrImage" class="flex flex-col sm:flex-row text-sm text-gray-600 dark:text-gray-400">
                    <label class="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                      <span>Subir una imagen</span>
                      <input type="file" class="sr-only" accept="image/*" @change="handleQRUpload">
                    </label>
                    <p class="pl-1">o arrastrar y soltar</p>
                  </div>
                  <div v-else class="flex flex-col items-center">
                    <img :src="qrImage" alt="QR Code" class="h-32 w-32 object-contain">
                    <button 
                      type="button"
                      @click="qrImage = null; updateFormData('qrImage', null)"
                      class="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Campos para Cuenta Bancaria -->
          <div v-if="selectedMethod === 'BANCO'" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Titular o Beneficiario *</label>
                <input 
                  :value="formData.titular"
                  @input="e => updateFormData('titular', e.target.value)"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">C.I. *</label>
                <input 
                  :value="formData.carnetIdentidad"
                  @input="e => updateFormData('carnetIdentidad', e.target.value)"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Complemento</label>
                <input 
                  :value="formData.complemento"
                  @input="e => updateFormData('complemento', e.target.value)"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Entidad Financiera *</label>
                <select 
                  :value="formData.banco"
                  @change="e => updateFormData('banco', e.target.value)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
                  <option value="">Seleccione un banco</option>
                  <option v-for="entidad in entidadesFinancieras" :key="entidad.nombre" :value="entidad.nombre">
                    {{ entidad.nombre }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Número de cuenta *</label>
                <input 
                  :value="formData.numeroCuenta"
                  @input="e => updateFormData('numeroCuenta', e.target.value)"
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tipo de cuenta *</label>
                <select 
                  :value="formData.tipoCuenta"
                  @change="e => updateFormData('tipoCuenta', e.target.value)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
                  <option value="">Seleccione tipo de cuenta</option>
                  <option value="Caja de Ahorro">Caja de Ahorro</option>
                  <option value="Cuenta Corriente">Cuenta Corriente</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Sucursal *</label>
                <select 
                  :value="formData.sucursal"
                  @change="e => updateFormData('sucursal', e.target.value)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                  required
                >
                  <option value="">Seleccione sucursal</option>
                  <option v-for="departamento in departamentos" :key="departamento" :value="departamento">
                    {{ departamento }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div class="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button"
          @click="isEditing ? closeEditModal() : closeAddModal()" 
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          class="px-4 py-2 bg-[#146EBE] text-white rounded hover:bg-blue-700"
        >
          {{ isEditing ? 'Modificar' : 'Guardar' }} Beneficiario
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal para registro rápido con código -->
  <div v-if="showQuickAccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Registro Rápido por Código</h3>
        <button @click="closeQuickAccessModal" class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="mb-6">
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Ingrese el código de acceso rápido proporcionado por el beneficiario para registrarlo automáticamente.
        </p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">Código de Acceso Rápido</label>
            <div class="relative">
              <input 
                :value="accessCode"
                @input="e => updateAccessCode(e.target.value)"
                type="text" 
                placeholder="XXX-XXX" 
                class="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent text-center text-lg tracking-widest font-medium dark:bg-gray-700 dark:text-white"
                maxlength="7"
              >
              <div v-if="accessCode" class="absolute right-3 top-3">
                <i v-if="isCodeValid" class="fas fa-check-circle text-green-500"></i>
                <i v-else class="fas fa-times-circle text-red-500"></i>
              </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Formato: XXX-XXX (ejemplo: 123-456)
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button 
          @click="closeQuickAccessModal" 
          class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
        >
          Cancelar
        </button>
        <button 
          @click="processAccessCode"
          :disabled="!isCodeValid"
          :class="[
            'px-4 py-2 rounded transition-colors',
            isCodeValid 
              ? 'bg-[#146EBE] text-white hover:bg-blue-700' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          ]"
        >
          Verificar Código
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para modales */
.fixed.inset-0 div[class*='bg-white'], .fixed.inset-0 div[class*='dark:bg-gray-800'] {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(209, 213, 219, 0.5);
  backdrop-filter: blur(10px);
  overflow: hidden;
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

/* Estilo para radio buttons personalizados */
input[type="radio"]:checked + label {
  border-color: #146EBE;
  background-color: rgba(20, 110, 190, 0.1);
}

.dark input[type="radio"]:checked + label {
  border-color: #146EBE;
  background-color: rgba(20, 110, 190, 0.2);
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