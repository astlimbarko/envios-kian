<script setup>
import { ref, computed } from 'vue'
import BeneficiariosModales from './BeneficiariosModales.vue'

// Estados para los modales
const showAddModal = ref(false)
const showQuickAccessModal = ref(false)
const activeTab = ref('list')
const beneficiarios = ref([
  {
    id: 1,
    nombre: 'María González',
    apellido: 'López',
    dni: '12345678',
    telefono: '+591 73015689',
    correo: 'maria.gonzalez@gmail.com',
    direccion: 'Av. Cristóbal de Mendoza #123',
    ciudad: 'Santa Cruz de la Sierra',
    pais: 'Bolivia',
    hasQR: true,
    hasBankAccount: true
  },
  {
    id: 2,
    nombre: 'Juan Carlos',
    apellido: 'Martínez Rodríguez',
    dni: '87654321',
    telefono: '+591 71023458',
    correo: 'juancarlos.martinez@outlook.com',
    direccion: 'Calle Junín #456',
    ciudad: 'La Paz',
    pais: 'Bolivia',
    hasQR: true,
    hasBankAccount: false
  },
  {
    id: 3,
    nombre: 'Ana María',
    apellido: 'Flores Castro',
    dni: '56781234',
    telefono: '+57 3015698741',
    correo: 'ana.flores@hotmail.com',
    direccion: 'Carrera 7 #45-32',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    hasQR: false,
    hasBankAccount: true
  }
])

// Búsqueda
const searchTerm = ref('')

// Formulario para nuevo beneficiario
const formData = ref({
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  correo: '',
  direccion: '',
  ciudad: '',
  pais: 'Bolivia',
  hasQR: false,
  hasBankAccount: false
})

const paises = [
  'Bolivia',
  'Colombia',
  'Perú',
  'Ecuador',
  'Argentina',
  'Chile',
  'Brasil',
  'Paraguay',
  'Uruguay',
  'Venezuela'
]

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
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    correo: '',
    direccion: '',
    ciudad: '',
    pais: 'Bolivia',
    hasQR: false,
    hasBankAccount: false
  }
}

// Abrir el modal de nuevos beneficiarios
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
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
    b.nombre.toLowerCase().includes(term) ||
    b.apellido.toLowerCase().includes(term) ||
    b.ciudad.toLowerCase().includes(term) ||
    b.pais.toLowerCase().includes(term)
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

// Procesar código de acceso rápido
const processAccessCode = () => {
  if (isCodeValid.value) {
    // Aquí iría la lógica para verificar el código en el backend
    // y obtener los datos del beneficiario
    
    // Simulación de éxito:
    resetForm()
    formData.value = {
      nombre: 'Beneficiario',
      apellido: 'Acceso Rápido',
      dni: '99887766',
      telefono: '+591 70123456',
      correo: 'beneficiario.rapido@gmail.com',
      direccion: 'Dirección Automática',
      ciudad: 'Cochabamba',
      pais: 'Bolivia',
      hasQR: true,
      hasBankAccount: false
    }
    
    showQuickAccessModal.value = false
    showAddModal.value = true
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Beneficiarios</h1>
      <div class="flex space-x-3">
        <button 
          @click="openQuickAccessModal"
          class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded flex items-center text-sm transition-colors"
        >
          <i class="fas fa-qrcode mr-2"></i> Registro Rápido
        </button>
        <button 
          @click="openAddModal" 
          class="bg-[#146EBE] hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center text-sm transition-colors"
        >
          <i class="fas fa-plus mr-2"></i> Nuevo Beneficiario
        </button>
      </div>
    </div>
    
    <!-- Pestañas -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button 
          @click="activeTab = 'list'" 
          :class="[
            'py-3 px-6 focus:outline-none',
            activeTab === 'list' 
              ? 'text-[#146EBE] border-b-2 border-[#146EBE] font-medium' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          <i class="fas fa-list mr-2"></i> Lista de Beneficiarios
        </button>
        <button 
          @click="activeTab = 'favorites'" 
          :class="[
            'py-3 px-6 focus:outline-none',
            activeTab === 'favorites' 
              ? 'text-[#146EBE] border-b-2 border-[#146EBE] font-medium' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          <i class="fas fa-star mr-2"></i> Favoritos
        </button>
      </div>
      
      <!-- Panel de búsqueda -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex">
          <div class="relative flex-grow">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Buscar beneficiario..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
            <div class="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
              <i class="fas fa-search"></i>
            </div>
          </div>
          <button class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 rounded-r border-y border-r border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
            <i class="fas fa-filter"></i>
          </button>
        </div>
      </div>
      
      <!-- Lista de beneficiarios -->
      <div v-if="activeTab === 'list'" class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-if="beneficiarios.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          No hay beneficiarios registrados.
        </div>
        
        <div v-for="beneficiario in filteredBeneficiarios" :key="beneficiario.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="flex justify-between">
            <div>
              <div class="font-medium text-gray-900 dark:text-gray-100">{{ beneficiario.nombre }} {{ beneficiario.apellido }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ beneficiario.ciudad }}, {{ beneficiario.pais }}</div>
              <div class="mt-1 flex items-center space-x-4 text-sm">
                <span v-if="beneficiario.hasQR" class="text-green-600 dark:text-green-400 flex items-center">
                  <i class="fas fa-qrcode mr-1"></i> QR
                </span>
                <span v-if="beneficiario.hasBankAccount" class="text-blue-600 dark:text-blue-400 flex items-center">
                  <i class="fas fa-university mr-1"></i> Cuenta Bancaria
                </span>
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Favoritos (ejemplo) -->
      <div v-if="activeTab === 'favorites'" class="p-6">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <i class="fas fa-star text-4xl mb-2 text-gray-300 dark:text-gray-600"></i>
          <p>No tienes beneficiarios marcados como favoritos.</p>
          <p class="text-sm mt-1">Marca tus beneficiarios más frecuentes como favoritos para acceder rápidamente a ellos.</p>
        </div>
      </div>
    </div>
    
    <!-- Importar componente de modales -->
    <BeneficiariosModales
      v-model:showAddModal="showAddModal"
      v-model:showQuickAccessModal="showQuickAccessModal"
      v-model:formData="formData"
      v-model:accessCode="accessCode"
      v-model:isCodeValid="isCodeValid"
      :paises="paises"
      @saveBeneficiario="saveBeneficiario"
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

/* Estilo para pestañas */
button[class*='py-3 px-6'] {
  transition: all 0.3s ease;
}

.border-b-2 {
  border-bottom-width: 3px;
  border-radius: 0;
}

/* Efecto de hover para botones de acciones */
button.p-1 {
  border-radius: 6px;
  transition: all 0.2s ease;
}

button.p-1:hover {
  transform: translateY(-1px);
  background-color: rgba(209, 213, 219, 0.2);
}
</style> 