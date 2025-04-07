<script setup>
import { ref } from 'vue'

// Estado para el chat y los tickets
const activeTab = ref('chat')
const mensajes = ref([
  {
    id: 1,
    emisor: 'sistema',
    texto: 'Bienvenido al soporte en línea de Envíos KIAN. ¿En qué podemos ayudarte hoy?',
    fecha: new Date(Date.now() - 2 * 60000)
  },
  {
    id: 2,
    emisor: 'agente',
    nombre: 'Carlos',
    texto: 'Hola, soy Carlos, tu asistente. ¿Cómo puedo ayudarte con tus envíos hoy?',
    fecha: new Date(Date.now() - 1 * 60000)
  }
])

const nuevoMensaje = ref('')

// FAQ predefinidas
const faqs = [
  {
    pregunta: '¿Cuánto tiempo tarda en llegar una remesa a Bolivia?',
    respuesta: 'Las remesas a Bolivia generalmente se procesan en 10-20 minutos durante el horario de atención.'
  },
  {
    pregunta: '¿Cómo puedo enviar dinero a una cuenta bancaria?',
    respuesta: 'Para enviar a una cuenta bancaria, selecciona esta opción al crear una nueva remesa y proporciona los datos bancarios del beneficiario.'
  },
  {
    pregunta: '¿Dónde puede mi beneficiario retirar el dinero enviado por QR?',
    respuesta: 'Los beneficiarios pueden retirar el dinero en cualquier sucursal de BCP, Banco Unión o Banco FIE presentando su QR y documento de identidad.'
  }
]

// Enviar un mensaje
const enviarMensaje = () => {
  if (!nuevoMensaje.value.trim()) return
  
  mensajes.value.push({
    id: mensajes.value.length + 1,
    emisor: 'cliente',
    texto: nuevoMensaje.value,
    fecha: new Date()
  })
  
  nuevoMensaje.value = ''
  
  // Simular respuesta después de un breve retraso
  setTimeout(() => {
    mensajes.value.push({
      id: mensajes.value.length + 1,
      emisor: 'agente',
      nombre: 'Carlos',
      texto: 'Gracias por tu mensaje. Un agente revisará tu consulta y te responderá a la brevedad.',
      fecha: new Date()
    })
  }, 1000)
}

// Tickets de soporte
const tickets = ref([
  {
    id: 'TIC-2023-001',
    asunto: 'Problema con remesa a Bolivia',
    estado: 'resuelto',
    fecha: '15/04/2023',
    ultimaActualizacion: '18/04/2023'
  },
  {
    id: 'TIC-2023-002',
    asunto: 'Consulta sobre tipos de cambio',
    estado: 'en_proceso',
    fecha: '20/04/2023',
    ultimaActualizacion: '21/04/2023'
  }
])

// Usar una FAQ predefinida
const usarFAQ = (faq) => {
  nuevoMensaje.value = faq.pregunta
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Soporte en Línea</h1>
    
    <!-- Pestañas -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div class="flex border-b">
        <button 
          @click="activeTab = 'chat'" 
          :class="[
            'py-3 px-6 focus:outline-none',
            activeTab === 'chat' 
              ? 'text-[#146EBE] border-b-2 border-[#146EBE] font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="fas fa-comments mr-2"></i> Chat en Vivo
        </button>
        <button 
          @click="activeTab = 'tickets'" 
          :class="[
            'py-3 px-6 focus:outline-none',
            activeTab === 'tickets' 
              ? 'text-[#146EBE] border-b-2 border-[#146EBE] font-medium' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="fas fa-ticket-alt mr-2"></i> Mis Tickets
        </button>
      </div>
      
      <!-- Chat en vivo -->
      <div v-if="activeTab === 'chat'" class="h-[calc(100vh-250px)] flex flex-col">
        <!-- Mensajes -->
        <div class="flex-1 p-4 overflow-y-auto space-y-4">
          <div 
            v-for="mensaje in mensajes" 
            :key="mensaje.id" 
            :class="[
              'max-w-[80%] p-3 rounded-lg',
              mensaje.emisor === 'cliente' 
                ? 'bg-blue-100 ml-auto' 
                : mensaje.emisor === 'agente'
                  ? 'bg-gray-100'
                  : 'bg-gray-50 border border-gray-200'
            ]"
          >
            <!-- Cabecera del mensaje -->
            <div v-if="mensaje.emisor === 'agente'" class="flex items-center mb-1">
              <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {{ mensaje.nombre[0] }}
              </div>
              <span class="ml-2 font-medium text-blue-700">{{ mensaje.nombre }}</span>
              <span class="ml-auto text-xs text-gray-500">
                {{ mensaje.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </span>
            </div>
            
            <div v-else-if="mensaje.emisor === 'sistema'" class="flex items-center mb-1 text-gray-500 text-xs">
              <i class="fas fa-info-circle mr-1"></i>
              <span>Sistema</span>
              <span class="ml-auto">
                {{ mensaje.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </span>
            </div>
            
            <div v-else class="flex justify-end mb-1 text-xs text-gray-500">
              <span>
                {{ mensaje.fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </span>
            </div>
            
            <!-- Contenido del mensaje -->
            <div :class="{ 'text-gray-800': mensaje.emisor !== 'sistema' }">
              {{ mensaje.texto }}
            </div>
          </div>
        </div>
        
        <!-- Sugerencias de preguntas frecuentes -->
        <div class="p-3 bg-gray-50 border-t border-gray-200">
          <p class="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="(faq, index) in faqs" 
              :key="index"
              @click="usarFAQ(faq)"
              class="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
            >
              {{ faq.pregunta }}
            </button>
          </div>
        </div>
        
        <!-- Input para nuevo mensaje -->
        <div class="p-4 border-t border-gray-200">
          <form @submit.prevent="enviarMensaje" class="flex">
            <input 
              v-model="nuevoMensaje"
              type="text" 
              placeholder="Escribe tu mensaje..." 
              class="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent"
            >
            <button 
              type="submit"
              class="bg-[#146EBE] text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          <p class="text-xs text-gray-500 mt-2">
            Horario de atención: Lunes a Viernes 8:00 - 20:00, Sábados 9:00 - 14:00 (Hora de Suecia)
          </p>
        </div>
      </div>
      
      <!-- Tickets de soporte -->
      <div v-if="activeTab === 'tickets'" class="p-4">
        <div class="mb-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Mis Tickets de Soporte</h3>
          <button class="bg-[#146EBE] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
            <i class="fas fa-plus mr-2"></i> Nuevo Ticket
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Ticket
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asunto
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ticket in tickets" :key="ticket.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ ticket.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ ticket.asunto }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      ticket.estado === 'resuelto' 
                        ? 'bg-green-100 text-green-800' 
                        : ticket.estado === 'en_proceso'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ ticket.estado === 'resuelto' ? 'Resuelto' : ticket.estado === 'en_proceso' ? 'En proceso' : 'Nuevo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Creado: {{ ticket.fecha }}</div>
                  <div class="text-xs">Actualizado: {{ ticket.ultimaActualizacion }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="tickets.length === 0" class="py-8 text-center text-gray-500">
          <i class="fas fa-ticket-alt text-4xl mb-3 text-gray-300"></i>
          <p>No tienes tickets de soporte activos.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mica effect (Windows 11) */
.bg-white {
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(209, 213, 219, 0.3);
  backdrop-filter: blur(10px);
}

/* Estilo para chat */
div[class*='p-3 rounded-lg'] {
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid rgba(209, 213, 219, 0.3);
}

/* Estilo para mensajes del cliente */
div[class*='bg-blue-100 ml-auto'] {
  border-radius: 12px 12px 2px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Estilo para mensajes del agente */
div[class*='bg-gray-100']:not(.border) {
  border-radius: 2px 12px 12px 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(209, 213, 219, 0.5);
}

/* Estilo para mensajes del sistema */
div[class*='bg-gray-50 border'] {
  border-radius: 8px;
}

/* Estilos para pestañas */
button[class*='py-3 px-6'] {
  transition: all 0.3s ease;
}

.border-b-2 {
  border-bottom-width: 3px;
  border-radius: 0;
}

/* Botones y controles */
button, input, textarea {
  transition: all 0.15s ease;
  border-radius: 6px;
}

button:active:not(:disabled) {
  transform: scale(0.98);
}

input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(20, 110, 190, 0.2);
}

/* Estilo para preguntas frecuentes */
button[class*='text-xs bg-white border'] {
  transition: all 0.2s ease;
}

button[class*='text-xs bg-white border']:hover {
  background-color: rgba(20, 110, 190, 0.1);
  transform: translateY(-1px);
}

/* Estilos para la tabla */
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead {
  background: linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(249, 250, 251, 0.6));
}

tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  background-color: rgba(20, 110, 190, 0.05);
}

/* Estilo para badges de estado */
span[class*='px-2 inline-flex text-xs'] {
  padding: 0.2rem 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style> 