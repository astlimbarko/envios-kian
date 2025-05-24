<script setup>
import { ref } from 'vue'

// Estado para el chat
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

// Usar una FAQ predefinida
const usarFAQ = (faq) => {
  nuevoMensaje.value = faq.pregunta
}
</script>

<template>
  <div class="h-[calc(100vh-150px)] flex flex-col">
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
        Horario de atención: Lunes a Sábado 12:00 - 20:00 (Hora de Suecia)
      </p>
    </div>
  </div>
</template>
