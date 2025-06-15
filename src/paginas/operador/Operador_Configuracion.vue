/**
 * Componente: Operador_Configuracion.vue
 * 
 * Página de configuración del operador que permite gestionar:
 * - Información personal
 * - Seguridad de la cuenta
 * - Preferencias de notificaciones
 * - Configuración de la interfaz
 */

<script setup>
import { ref, onMounted } from 'vue'
import { useLayoutStore } from '../../stores/layoutStore'

// Store para el tema
const layoutStore = useLayoutStore()

// Estado para los modales
const showEditPhoneModal = ref(false)
const showEditEmailModal = ref(false)
const showEditPasswordModal = ref(false)

// Estado para las notificaciones toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Datos del perfil
const profile = ref({
  nombre: 'Eliana Sánchez',
  email: 'eliana.sanchez@envioskian.com',
  telefono: '+507 6789 1234',
  cargo: 'Operador'
})

// Función para mostrar toast
const showToastNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Funciones para actualizar datos
const updatePhone = (newPhone) => {
  profile.value.telefono = newPhone
  showEditPhoneModal.value = false
  showToastNotification('Número de teléfono actualizado correctamente')
}

const updateEmail = (newEmail) => {
  profile.value.email = newEmail
  showEditEmailModal.value = false
  showToastNotification('Correo electrónico actualizado correctamente')
}

const updatePassword = () => {
  showEditPasswordModal.value = false
  showToastNotification('Contraseña actualizada correctamente')
}

// Función para cambiar el tema
const toggleTheme = () => {
  layoutStore.toggleTheme()
  showToastNotification('Tema actualizado correctamente')
}

// Cargar tema guardado al montar el componente
onMounted(() => {
  layoutStore.loadTheme()
})
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configuración de la Cuenta</h1>
      
      <div class="max-w-3xl">
        <!-- Información Personal -->
        <div class="space-y-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fas fa-user text-2xl text-white"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ profile.nombre }}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ profile.cargo }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</h3>
                  <p class="text-gray-900 dark:text-gray-100 truncate">{{ profile.email }}</p>
                </div>
                <button @click="showEditEmailModal = true"
                        class="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</h3>
                  <p class="text-gray-900 dark:text-gray-100 truncate">{{ profile.telefono }}</p>
                </div>
                <button @click="showEditPhoneModal = true"
                        class="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Contraseña</h3>
                  <p class="text-gray-900 dark:text-white">••••••••</p>
                </div>
                <button @click="showEditPasswordModal = true"
                        class="text-blue-500 hover:text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="showToast" 
         class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
         :class="{
           'bg-green-500 text-white': toastType === 'success',
           'bg-red-500 text-white': toastType === 'error'
         }">
      {{ toastMessage }}
    </div>

    <!-- Modal Editar Teléfono -->
    <div v-if="showEditPhoneModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Teléfono</h2>
            <button @click="showEditPhoneModal = false" 
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nuevo número de teléfono
              </label>
              <input type="tel" 
                     v-model="profile.telefono"
                     @keyup.enter="updatePhone(profile.telefono)"
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditPhoneModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updatePhone(profile.telefono)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Correo -->
    <div v-if="showEditEmailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Correo Electrónico</h2>
            <button @click="showEditEmailModal = false" 
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p class="text-sm text-yellow-800 dark:text-yellow-200">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Al cambiar tu correo electrónico, deberás verificar la nueva dirección.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nuevo correo electrónico
              </label>
              <input type="email" 
                     v-model="profile.email"
                     @keyup.enter="updateEmail(profile.email)"
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditEmailModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updateEmail(profile.email)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Contraseña -->
    <div v-if="showEditPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Cambiar Contraseña</h2>
            <button @click="showEditPasswordModal = false" 
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña actual
              </label>
              <input type="password" 
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva contraseña
              </label>
              <input type="password" 
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar nueva contraseña
              </label>
              <input type="password" 
                     @keyup.enter="updatePassword"
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditPasswordModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updatePassword"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 