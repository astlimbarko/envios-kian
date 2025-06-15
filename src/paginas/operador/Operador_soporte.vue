/**
 * Componente: Operador_soporte.vue
 * 
 * Este componente gestiona el soporte en línea para los clientes.
 * Permite ver y responder chats en tiempo real, clasificar por prioridad
 * y gestionar el estado de las conversaciones.
 */

<script setup>
import { ref, computed } from 'vue'

// Estado del módulo
const chats = ref([
  {
    id: 1,
    cliente: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    ultimoMensaje: 'Necesito ayuda con mi remesa #12345',
    timestamp: '2024-03-20 15:30',
    estado: 'pendiente',
    prioridad: 'alta',
    etiquetas: ['remesa', 'urgencia'],
    mensajes: [
      {
        id: 1,
        remitente: 'cliente',
        contenido: 'Hola, necesito ayuda con mi remesa #12345',
        timestamp: '2024-03-20 15:30'
      }
    ]
  },
  {
    id: 2,
    cliente: 'María García',
    email: 'maria@ejemplo.com',
    ultimoMensaje: '¿Cuánto tiempo tarda en procesarse una remesa?',
    timestamp: '2024-03-20 15:25',
    estado: 'en_proceso',
    prioridad: 'normal',
    etiquetas: ['consulta'],
    mensajes: [
      {
        id: 1,
        remitente: 'cliente',
        contenido: '¿Cuánto tiempo tarda en procesarse una remesa?',
        timestamp: '2024-03-20 15:25'
      },
      {
        id: 2,
        remitente: 'operador',
        contenido: 'Hola María, el tiempo de procesamiento es de 24-48 horas hábiles.',
        timestamp: '2024-03-20 15:26'
      }
    ]
  },
  {
    id: 3,
    cliente: 'Carlos Rodríguez',
    email: 'carlos@ejemplo.com',
    ultimoMensaje: 'No puedo acceder a mi cuenta',
    timestamp: '2024-03-20 15:20',
    estado: 'pendiente',
    prioridad: 'alta',
    etiquetas: ['cuenta', 'urgencia'],
    mensajes: [
      {
        id: 1,
        remitente: 'cliente',
        contenido: 'No puedo acceder a mi cuenta',
        timestamp: '2024-03-20 15:20'
      }
    ]
  }
])

// Estado para el chat actual
const chatSeleccionado = ref(null)
const nuevoMensaje = ref('')

// Filtros
const filtroEstado = ref('todos')
const filtroPrioridad = ref('todos')
const busqueda = ref('')

// Filtrar chats
const chatsFiltrados = computed(() => {
  return chats.value.filter(chat => {
    const matchEstado = filtroEstado.value === 'todos' || chat.estado === filtroEstado.value
    const matchPrioridad = filtroPrioridad.value === 'todos' || chat.prioridad === filtroPrioridad.value
    const matchBusqueda = chat.cliente.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                         chat.ultimoMensaje.toLowerCase().includes(busqueda.value.toLowerCase())
    return matchEstado && matchPrioridad && matchBusqueda
  })
})

// Funciones de gestión
const seleccionarChat = (chat) => {
  chatSeleccionado.value = chat
}

const enviarMensaje = () => {
  if (!nuevoMensaje.value.trim()) return
  
  const chat = chatSeleccionado.value
  chat.mensajes.push({
    id: chat.mensajes.length + 1,
    remitente: 'operador',
    contenido: nuevoMensaje.value,
    timestamp: new Date().toLocaleString()
  })
  
  chat.ultimoMensaje = nuevoMensaje.value
  nuevoMensaje.value = ''
}

const cambiarEstado = (chat, nuevoEstado) => {
  chat.estado = nuevoEstado
}

const cambiarPrioridad = (chat, nuevaPrioridad) => {
  chat.prioridad = nuevaPrioridad
}

const agregarEtiqueta = (chat, etiqueta) => {
  if (!chat.etiquetas.includes(etiqueta)) {
    chat.etiquetas.push(etiqueta)
  }
}

const quitarEtiqueta = (chat, etiqueta) => {
  chat.etiquetas = chat.etiquetas.filter(e => e !== etiqueta)
}

const getEstadoClass = (estado) => {
  const clases = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    en_proceso: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    resuelto: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return clases[estado] || clases.pendiente
}

const getPrioridadClass = (prioridad) => {
  const clases = {
    alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    baja: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return clases[prioridad] || clases.normal
}
</script>

<template>
  <div class="h-full flex">
    <!-- Lista de chats -->
    <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <!-- Filtros -->
      <div class="space-y-4">
        <input 
          v-model="busqueda"
          type="text" 
          placeholder="Buscar chats..." 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        
        <div class="flex space-x-2">
          <select 
            v-model="filtroEstado"
            class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="resuelto">Resuelto</option>
          </select>
          
          <select 
            v-model="filtroPrioridad"
            class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="normal">Normal</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      <!-- Lista de chats -->
      <div class="space-y-2">
        <div 
          v-for="chat in chatsFiltrados" 
          :key="chat.id"
          @click="seleccionarChat(chat)"
          class="p-3 rounded-lg cursor-pointer transition-colors"
          :class="chatSeleccionado?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ chat.cliente }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ chat.email }}</p>
            </div>
            <span class="px-2 py-1 text-xs rounded-full"
                  :class="getEstadoClass(chat.estado)">
              {{ chat.estado }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">
            {{ chat.ultimoMensaje }}
          </p>
          <div class="mt-2 flex items-center justify-between">
            <div class="flex space-x-1">
              <span v-for="etiqueta in chat.etiquetas" 
                    :key="etiqueta"
                    class="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {{ etiqueta }}
              </span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ chat.timestamp }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat seleccionado -->
    <div class="flex-1 flex flex-col">
      <div v-if="chatSeleccionado" class="flex-1 flex flex-col">
        <!-- Encabezado del chat -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ chatSeleccionado.cliente }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ chatSeleccionado.email }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <select 
                v-model="chatSeleccionado.estado"
                class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="resuelto">Resuelto</option>
              </select>
              
              <select 
                v-model="chatSeleccionado.prioridad"
                class="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="alta">Alta</option>
                <option value="normal">Normal</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Mensajes -->
        <div class="flex-1 p-4 overflow-y-auto space-y-4">
          <div v-for="mensaje in chatSeleccionado.mensajes" 
               :key="mensaje.id"
               class="flex"
               :class="mensaje.remitente === 'cliente' ? 'justify-start' : 'justify-end'">
            <div class="max-w-[70%] rounded-lg p-3"
                 :class="mensaje.remitente === 'cliente' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'">
              <p class="text-gray-900 dark:text-white">{{ mensaje.contenido }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ mensaje.timestamp }}
              </p>
            </div>
          </div>
        </div>

        <!-- Input de mensaje -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex space-x-4">
            <input 
              v-model="nuevoMensaje"
              type="text" 
              placeholder="Escribe un mensaje..." 
              class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="enviarMensaje"
            >
            <button 
              @click="enviarMensaje"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

      <!-- Estado cuando no hay chat seleccionado -->
      <div v-else class="flex-1 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">
          Selecciona un chat para comenzar
        </p>
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