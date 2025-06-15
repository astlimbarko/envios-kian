/**
 * Componente: Operador_beneficiarios.vue
 * 
 * Este componente permite a los operadores gestionar los beneficiarios del sistema,
 * incluyendo la creación, edición, eliminación y verificación de beneficiarios.
 */

<script setup>
import { ref, computed } from 'vue'

// Estado del módulo
const beneficiarios = ref([
  {
    id: 1,
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    telefono: '+34 987 654 321',
    pais: 'España',
    ciudad: 'Madrid',
    direccion: 'Calle Mayor 123',
    estado: 'activo',
    tipo: 'persona',
    fechaRegistro: '2024-03-01',
    ultimaActualizacion: '2024-03-20 15:30',
    verificacion: {
      identidad: true,
      direccion: true
    },
    documentos: [
      {
        tipo: 'DNI',
        numero: '12345678A',
        estado: 'verificado'
      }
    ],
    clientes: ['Juan Pérez', 'Ana Martínez']
  },
  {
    id: 2,
    nombre: 'Pedro López',
    email: 'pedro@ejemplo.com',
    telefono: '+34 555 666 777',
    pais: 'España',
    ciudad: 'Barcelona',
    direccion: 'Avenida Diagonal 456',
    estado: 'pendiente',
    tipo: 'persona',
    fechaRegistro: '2024-03-15',
    ultimaActualizacion: '2024-03-20 14:45',
    verificacion: {
      identidad: false,
      direccion: true
    },
    documentos: [
      {
        tipo: 'Pasaporte',
        numero: 'AB123456',
        estado: 'pendiente'
      }
    ],
    clientes: ['Carlos Rodríguez']
  },
  {
    id: 3,
    nombre: 'Empresa XYZ S.L.',
    email: 'info@xyz.com',
    telefono: '+34 999 888 777',
    pais: 'España',
    ciudad: 'Valencia',
    direccion: 'Calle Comercial 789',
    estado: 'activo',
    tipo: 'empresa',
    fechaRegistro: '2024-02-28',
    ultimaActualizacion: '2024-03-19 10:15',
    verificacion: {
      identidad: true,
      direccion: true
    },
    documentos: [
      {
        tipo: 'CIF',
        numero: 'B12345678',
        estado: 'verificado'
      }
    ],
    clientes: ['Roberto Díaz', 'Elena Vargas']
  }
])

// Estado para el formulario
const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const beneficiarioSeleccionado = ref(null)

const nuevoBeneficiario = ref({
  nombre: '',
  email: '',
  telefono: '',
  pais: '',
  ciudad: '',
  direccion: '',
  tipo: 'persona',
  documentos: []
})

// Filtros
const filtroEstado = ref('todos')
const filtroTipo = ref('todos')
const busqueda = ref('')

// Filtrar beneficiarios
const beneficiariosFiltrados = computed(() => {
  return beneficiarios.value.filter(beneficiario => {
    const matchEstado = filtroEstado.value === 'todos' || beneficiario.estado === filtroEstado.value
    const matchTipo = filtroTipo.value === 'todos' || beneficiario.tipo === filtroTipo.value
    const matchBusqueda = beneficiario.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                         beneficiario.email.toLowerCase().includes(busqueda.value.toLowerCase())
    return matchEstado && matchTipo && matchBusqueda
  })
})

// Funciones de gestión
const abrirFormulario = (beneficiario = null) => {
  if (beneficiario) {
    modoEdicion.value = true
    beneficiarioSeleccionado.value = beneficiario
    nuevoBeneficiario.value = { ...beneficiario }
  } else {
    modoEdicion.value = false
    beneficiarioSeleccionado.value = null
    nuevoBeneficiario.value = {
      nombre: '',
      email: '',
      telefono: '',
      pais: '',
      ciudad: '',
      direccion: '',
      tipo: 'persona',
      documentos: []
    }
  }
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  modoEdicion.value = false
  beneficiarioSeleccionado.value = null
  nuevoBeneficiario.value = {
    nombre: '',
    email: '',
    telefono: '',
    pais: '',
    ciudad: '',
    direccion: '',
    tipo: 'persona',
    documentos: []
  }
}

const guardarBeneficiario = () => {
  if (modoEdicion.value) {
    const index = beneficiarios.value.findIndex(b => b.id === beneficiarioSeleccionado.value.id)
    if (index !== -1) {
      beneficiarios.value[index] = { 
        ...beneficiarios.value[index],
        ...nuevoBeneficiario.value,
        ultimaActualizacion: new Date().toLocaleString()
      }
    }
  } else {
    const nuevoId = Math.max(...beneficiarios.value.map(b => b.id)) + 1
    beneficiarios.value.push({
      ...nuevoBeneficiario.value,
      id: nuevoId,
      estado: 'pendiente',
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimaActualizacion: new Date().toLocaleString(),
      verificacion: {
        identidad: false,
        direccion: false
      },
      clientes: []
    })
  }
  cerrarFormulario()
}

const eliminarBeneficiario = (beneficiario) => {
  if (confirm('¿Estás seguro de que deseas eliminar este beneficiario?')) {
    beneficiarios.value = beneficiarios.value.filter(b => b.id !== beneficiario.id)
  }
}

const cambiarEstado = (beneficiario, nuevoEstado) => {
  beneficiario.estado = nuevoEstado
  beneficiario.ultimaActualizacion = new Date().toLocaleString()
}

const verificarDocumento = (beneficiario, documento) => {
  documento.estado = 'verificado'
  beneficiario.verificacion.identidad = true
  beneficiario.ultimaActualizacion = new Date().toLocaleString()
}

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    bloqueado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return clases[estado] || clases.pendiente
}

const getTipoClass = (tipo) => {
  const clases = {
    persona: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    empresa: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return clases[tipo] || clases.persona
}

const getVerificacionClass = (verificado) => {
  return verificado 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Gestión de Beneficiarios
      </h1>
      <button 
        @click="abrirFormulario()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>
        Nuevo Beneficiario
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="relative">
        <input 
          v-model="busqueda"
          type="text" 
          placeholder="Buscar beneficiarios..." 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>

      <div class="relative">
        <select 
          v-model="filtroEstado"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
      </div>

      <div class="relative">
        <select 
          v-model="filtroTipo"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="todos">Todos los tipos</option>
          <option value="persona">Persona</option>
          <option value="empresa">Empresa</option>
        </select>
      </div>
    </div>

    <!-- Lista de beneficiarios -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Beneficiario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ubicación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Documentos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Clientes
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="beneficiario in beneficiariosFiltrados" :key="beneficiario.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <i class="fas fa-user text-gray-500 dark:text-gray-400"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ beneficiario.nombre }}
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full mt-1"
                          :class="getTipoClass(beneficiario.tipo)">
                      {{ beneficiario.tipo }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.email }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ beneficiario.telefono }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ beneficiario.ciudad }}, {{ beneficiario.pais }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ beneficiario.direccion }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  v-model="beneficiario.estado"
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getEstadoClass(beneficiario.estado)"
                  @change="cambiarEstado(beneficiario, $event.target.value)"
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <span v-for="doc in beneficiario.documentos" 
                        :key="doc.numero"
                        class="px-2 py-1 text-xs rounded-full"
                        :class="getVerificacionClass(doc.estado === 'verificado')">
                    {{ doc.tipo }}: {{ doc.numero }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span v-for="cliente in beneficiario.clientes" 
                        :key="cliente"
                        class="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {{ cliente }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="abrirFormulario(beneficiario)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="eliminarBeneficiario(beneficiario)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de formulario -->
    <div v-if="mostrarFormulario" 
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ modoEdicion ? 'Editar Beneficiario' : 'Nuevo Beneficiario' }}
          </h3>
          
          <form @submit.prevent="guardarBeneficiario" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input 
                v-model="nuevoBeneficiario.nombre"
                type="text" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input 
                v-model="nuevoBeneficiario.email"
                type="email" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono
              </label>
              <input 
                v-model="nuevoBeneficiario.telefono"
                type="tel" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                País
              </label>
              <input 
                v-model="nuevoBeneficiario.pais"
                type="text" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ciudad
              </label>
              <input 
                v-model="nuevoBeneficiario.ciudad"
                type="text" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dirección
              </label>
              <input 
                v-model="nuevoBeneficiario.direccion"
                type="text" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo
              </label>
              <select 
                v-model="nuevoBeneficiario.tipo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="persona">Persona</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 mt-5">
              <button 
                type="button"
                @click="cerrarFormulario"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {{ modoEdicion ? 'Guardar cambios' : 'Crear beneficiario' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 