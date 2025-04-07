<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  showAddModal: Boolean,
  showQuickAccessModal: Boolean,
  formData: Object,
  accessCode: String,
  isCodeValid: Boolean,
  paises: Array
})

const emit = defineEmits([
  'update:showAddModal',
  'update:showQuickAccessModal',
  'update:formData',
  'update:accessCode',
  'update:isCodeValid',
  'saveBeneficiario',
  'validateAccessCode',
  'processAccessCode'
])

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

const closeQuickAccessModal = () => {
  emit('update:showQuickAccessModal', false)
}

const saveBeneficiario = () => {
  emit('saveBeneficiario')
}

const processAccessCode = () => {
  emit('processAccessCode')
}
</script>

<template>
  <!-- Modal para agregar beneficiario -->
  <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:text-gray-100">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">Nuevo Beneficiario</h3>
        <button @click="closeAddModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="saveBeneficiario" class="space-y-6">
        <!-- Datos personales -->
        <div>
          <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-4">Datos Personales</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre(s) *</label>
              <input 
                :value="formData.nombre"
                @input="e => updateFormData('nombre', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Apellido(s) *</label>
              <input 
                :value="formData.apellido"
                @input="e => updateFormData('apellido', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">ID / DNI / CI *</label>
              <input 
                :value="formData.dni"
                @input="e => updateFormData('dni', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Teléfono *</label>
              <input 
                :value="formData.telefono"
                @input="e => updateFormData('telefono', e.target.value)"
                type="tel" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
              <input 
                :value="formData.correo"
                @input="e => updateFormData('correo', e.target.value)"
                type="email" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
            </div>
          </div>
        </div>
        
        <!-- Dirección -->
        <div>
          <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-4">Dirección</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Dirección de domicilio *</label>
              <input 
                :value="formData.direccion"
                @input="e => updateFormData('direccion', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Ciudad *</label>
              <input 
                :value="formData.ciudad"
                @input="e => updateFormData('ciudad', e.target.value)"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">País *</label>
              <select 
                :value="formData.pais"
                @change="e => updateFormData('pais', e.target.value)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white" 
                required
              >
                <option v-for="pais in paises" :key="pais" :value="pais">{{ pais }}</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Información de pago -->
        <div>
          <h4 class="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-4">Información de Pago</h4>
          <div class="space-y-4">
            <div>
              <div class="flex items-center mb-2">
                <input 
                  id="has_qr" 
                  :checked="formData.hasQR"
                  @change="e => updateFormData('hasQR', e.target.checked)"
                  type="checkbox" 
                  class="text-[#146EBE]"
                >
                <label for="has_qr" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Tiene código QR para recibir pagos</label>
              </div>
              <div v-if="formData.hasQR" class="ml-6 mt-2">
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <i class="fas fa-qrcode text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Haz clic para subir una imagen del código QR</p>
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex items-center mb-2">
                <input 
                  id="has_bank" 
                  :checked="formData.hasBankAccount"
                  @change="e => updateFormData('hasBankAccount', e.target.checked)"
                  type="checkbox" 
                  class="text-[#146EBE]"
                >
                <label for="has_bank" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Tiene cuenta bancaria</label>
              </div>
              <div v-if="formData.hasBankAccount" class="ml-6 mt-2 space-y-3">
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Banco</label>
                  <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="">Seleccione un banco</option>
                    <option value="banco_union">Banco Unión</option>
                    <option value="banco_fassil">Banco Fassil</option>
                    <option value="banco_bcp">Banco BCP</option>
                    <option value="banco_nacional">Banco Nacional de Bolivia</option>
                    <option value="banco_mercantil">Banco Mercantil Santa Cruz</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Número de cuenta</label>
                  <input type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tipo de cuenta</label>
                  <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white">
                    <option value="savings">Caja de Ahorro</option>
                    <option value="checking">Cuenta Corriente</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button"
            @click="closeAddModal" 
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-[#146EBE] text-white rounded hover:bg-blue-700"
          >
            Guardar Beneficiario
          </button>
        </div>
      </form>
    </div>
  </div>
  
  <!-- Modal para registro rápido con código -->
  <div v-if="showQuickAccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
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
</style> 