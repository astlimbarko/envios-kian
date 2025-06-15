/**
 * Componente: Operador_usuarios.vue
 * 
 * Este componente permite a los operadores gestionar los usuarios del sistema,
 * incluyendo la creación, edición, eliminación y verificación de usuarios.
 */

<script setup>
import { ref, computed } from 'vue'

// Estado del módulo
const usuarios = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    telefono: '+34 123 456 789',
    estado: 'activo',
    tipo: 'cliente',
    fechaRegistro: '2024-03-01',
    ultimoAcceso: '2024-03-20 15:30',
    verificacion: {
      identidad: true,
      telefono: true,
      email: true
    },
    documentos: [
      {
        tipo: 'DNI',
        numero: '12345678A',
        estado: 'verificado'
      }
    ]
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    telefono: '+34 987 654 321',
    estado: 'pendiente',
    tipo: 'cliente',
    fechaRegistro: '2024-03-15',
    ultimoAcceso: '2024-03-20 14:45',
    verificacion: {
      identidad: false,
      telefono: true,
      email: true
    },
    documentos: [
      {
        tipo: 'Pasaporte',
        numero: 'AB123456',
        estado: 'pendiente'
      }
    ]
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    email: 'carlos@ejemplo.com',
    telefono: '+34 555 666 777',
    estado: 'bloqueado',
    tipo: 'cliente',
    fechaRegistro: '2024-02-28',
    ultimoAcceso: '2024-03-19 10:15',
    verificacion: {
      identidad: true,
      telefono: true,
      email: true
    },
    documentos: [
      {
        tipo: 'DNI',
        numero: '87654321B',
        estado: 'verificado'
      }
    ]
  }
])

// Estado para el formulario
const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const usuarioSeleccionado = ref(null)

const nuevoUsuario = ref({
  nombre: '',
  email: '',
  telefono: '',
  tipo: 'cliente',
  documentos: []
})

// Filtros
const filtroEstado = ref('todos')
const filtroTipo = ref('todos')
const busqueda = ref('')

// Filtrar usuarios
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(usuario => {
    const matchEstado = filtroEstado.value === 'todos' || usuario.estado === filtroEstado.value
    const matchTipo = filtroTipo.value === 'todos' || usuario.tipo === filtroTipo.value
    const matchBusqueda = usuario.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(busqueda.value.toLowerCase())
    return matchEstado && matchTipo && matchBusqueda
  })
})

// Funciones de gestión
const abrirFormulario = (usuario = null) => {
  if (usuario) {
    modoEdicion.value = true
    usuarioSeleccionado.value = usuario
    nuevoUsuario.value = { ...usuario }
  } else {
    modoEdicion.value = false
    usuarioSeleccionado.value = null
    nuevoUsuario.value = {
      nombre: '',
      email: '',
      telefono: '',
      tipo: 'cliente',
      documentos: []
    }
  }
  mostrarFormulario.value = true
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  modoEdicion.value = false
  usuarioSeleccionado.value = null
  nuevoUsuario.value = {
    nombre: '',
    email: '',
    telefono: '',
    tipo: 'cliente',
    documentos: []
  }
}

const guardarUsuario = () => {
  if (modoEdicion.value) {
    const index = usuarios.value.findIndex(u => u.id === usuarioSeleccionado.value.id)
    if (index !== -1) {
      usuarios.value[index] = { ...nuevoUsuario.value }
    }
  } else {
    const nuevoId = Math.max(...usuarios.value.map(u => u.id)) + 1
    usuarios.value.push({
      ...nuevoUsuario.value,
      id: nuevoId,
      estado: 'pendiente',
      fechaRegistro: new Date().toISOString().split('T')[0],
      ultimoAcceso: new Date().toLocaleString(),
      verificacion: {
        identidad: false,
        telefono: false,
        email: false
      }
    })
  }
  cerrarFormulario()
}

const eliminarUsuario = (usuario) => {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    usuarios.value = usuarios.value.filter(u => u.id !== usuario.id)
  }
}

const cambiarEstado = (usuario, nuevoEstado) => {
  usuario.estado = nuevoEstado
}

const verificarDocumento = (usuario, documento) => {
  documento.estado = 'verificado'
  usuario.verificacion.identidad = true
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
        Gestión de Usuarios
      </h1>
      <button 
        @click="abrirFormulario()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="relative">
        <input 
          v-model="busqueda"
          type="text" 
          placeholder="Buscar usuarios..." 
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
          <option value="cliente">Cliente</option>
          <option value="operador">Operador</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Verificación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Documentos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Último acceso
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <i class="fas fa-user text-gray-500 dark:text-gray-400"></i>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ usuario.nombre }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ usuario.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  v-model="usuario.estado"
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getEstadoClass(usuario.estado)"
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <span class="px-2 py-1 text-xs rounded-full"
                        :class="getVerificacionClass(usuario.verificacion.identidad)">
                    <i class="fas fa-id-card mr-1"></i>
                    ID
                  </span>
                  <span class="px-2 py-1 text-xs rounded-full"
                        :class="getVerificacionClass(usuario.verificacion.telefono)">
                    <i class="fas fa-phone mr-1"></i>
                    Tel
                  </span>
                  <span class="px-2 py-1 text-xs rounded-full"
                        :class="getVerificacionClass(usuario.verificacion.email)">
                    <i class="fas fa-envelope mr-1"></i>
                    Email
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <span v-for="doc in usuario.documentos" 
                        :key="doc.numero"
                        class="px-2 py-1 text-xs rounded-full"
                        :class="getVerificacionClass(doc.estado === 'verificado')">
                    {{ doc.tipo }}: {{ doc.numero }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ usuario.ultimoAcceso }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="abrirFormulario(usuario)"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="eliminarUsuario(usuario)"
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
            {{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h3>
          
          <form @submit.prevent="guardarUsuario" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input 
                v-model="nuevoUsuario.nombre"
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
                v-model="nuevoUsuario.email"
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
                v-model="nuevoUsuario.telefono"
                type="tel" 
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de usuario
              </label>
              <select 
                v-model="nuevoUsuario.tipo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="cliente">Cliente</option>
                <option value="operador">Operador</option>
                <option value="admin">Administrador</option>
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
                {{ modoEdicion ? 'Guardar cambios' : 'Crear usuario' }}
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