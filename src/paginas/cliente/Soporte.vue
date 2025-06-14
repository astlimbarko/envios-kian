/**
 * Componente: Soporte.vue
 * 
 * Chat flotante de soporte al cliente.
 * Se despliega junto al ícono de chat y permite comunicación
 * con el equipo de soporte sin interrumpir la navegación.
 * 
 * Características:
 * - Chat flotante minimalista
 * - Se despliega junto al ícono
 * - No interrumpe la navegación
 * - Diseño responsivo
 * - Sonidos de notificación
 */

<script setup>
import { ref, onMounted } from 'vue'

// Estado del chat
const messages = ref([
  {
    id: 1,
    text: '¡Hola! ¿En qué podemos ayudarte hoy?',
    sender: 'support',
    timestamp: new Date()
  }
])
const newMessage = ref('')
const isMinimized = ref(true)
const hasUnreadMessages = ref(false)

// Sonido de notificación
const notificationSound = new Audio('/src/assets/sound/chat.mp3')

// Función para enviar mensaje
const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      text: newMessage.value,
      sender: 'user',
      timestamp: new Date()
    })
    newMessage.value = ''
    
    // Simular respuesta automática
    setTimeout(() => {
      messages.value.push({
        id: messages.value.length + 1,
        text: 'Gracias por tu mensaje. Un agente te responderá pronto.',
        sender: 'support',
        timestamp: new Date()
      })
      hasUnreadMessages.value = true
      // Reproducir sonido de notificación
      notificationSound.play().catch(error => {
        console.log('Error al reproducir sonido:', error)
      })
    }, 1000)
  }
}

// Scroll al último mensaje cuando se añade uno nuevo
onMounted(() => {
  const chatContainer = document.querySelector('.chat-messages')
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
})
</script>

<template>
  <!-- Ícono del chat (siempre visible) -->
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      @click="isMinimized = !isMinimized"
      class="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300"
    >
      <i class="fas fa-comments text-2xl"></i>
      <!-- Indicador de mensajes no leídos -->
      <div 
        v-if="hasUnreadMessages"
        class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
      ></div>
    </button>
  </div>

  <!-- Chat expandido -->
  <div 
    v-if="!isMinimized"
    class="fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300 h-96"
  >
    <!-- Barra de control -->
    <div class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        <i class="fas fa-headset text-blue-600 dark:text-blue-400"></i>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Soporte en Línea</span>
      </div>
      <button 
        @click="isMinimized = true"
        class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <i class="fas fa-minus"></i>
      </button>
    </div>

    <!-- Mensajes -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="[
          'max-w-[80%] p-3 rounded-lg text-sm',
          message.sender === 'user' 
            ? 'ml-auto bg-blue-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        ]"
      >
        {{ message.text }}
      </div>
    </div>

    <!-- Input de mensaje -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-700">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Escribe tu mensaje..."
          class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          @click="sendMessage"
          class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Solo estilos que no se pueden hacer con Tailwind */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.dark .chat-messages::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* Animaciones */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
