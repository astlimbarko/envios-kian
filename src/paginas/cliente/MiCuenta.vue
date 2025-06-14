<script setup>
import { ref } from 'vue'
import Navbar from './navbar.vue'

// Estado para los modales
const showEditPhoneModal = ref(false)
const showEditAddressModal = ref(false)
const showEditEmailModal = ref(false)
const showEditPasswordModal = ref(false)
const showEditDocumentModal = ref(false)

// Estado para las notificaciones toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Estado para las preferencias
const emailNotifications = ref(true)
const newsletter = ref(true)

// Datos del perfil
const profile = ref({
  name: 'Juan Pérez',
  email: 'juan.perez@ejemplo.com',
  phone: '+52 555 123 4567',
  address: 'Calle Principal #123, Colonia Centro, Ciudad de México',
  documentType: 'DNI',
  documentNumber: '12345678'
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
  profile.value.phone = newPhone
  showEditPhoneModal.value = false
  showToastNotification('Número de teléfono actualizado correctamente')
}

const updateAddress = (newAddress) => {
  profile.value.address = newAddress
  showEditAddressModal.value = false
  showToastNotification('Dirección actualizada correctamente')
}

const updateEmail = (newEmail) => {
  profile.value.email = newEmail
  showEditEmailModal.value = false
  showToastNotification('Correo electrónico actualizado correctamente')
}

const updatePassword = (newPassword) => {
  showEditPasswordModal.value = false
  showToastNotification('Contraseña actualizada correctamente')
}

const updateDocument = (newDocument) => {
  profile.value.documentNumber = newDocument
  showEditDocumentModal.value = false
  showToastNotification('Documento de identidad actualizado correctamente')
}

const updatePreferences = () => {
  showToastNotification('Preferencias actualizadas correctamente')
}

// Función para manejar la tecla Enter
const handleKeyPress = (event, action) => {
  if (event.key === 'Enter') {
    action()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <Navbar />
    
    <main class="container mx-auto px-4 py-6 max-w-6xl">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mi Cuenta</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Información del perfil -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Información Personal -->
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-user text-xl text-white"></i>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ profile.name }}</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Cliente desde 2022</p>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Correo electrónico</h3>
                      <p class="text-gray-900 dark:text-gray-100">{{ profile.email }}</p>
                    </div>
                    <button @click="showEditEmailModal = true"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</h3>
                      <p class="text-gray-900 dark:text-gray-100">{{ profile.phone }}</p>
                    </div>
                    <button @click="showEditPhoneModal = true"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Documento de Identidad</h3>
                      <p class="text-gray-900 dark:text-gray-100">{{ profile.documentType }}: {{ profile.documentNumber }}</p>
                    </div>
                    <button @click="showEditDocumentModal = true"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Información Adicional -->
              <div class="space-y-3">
                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</h3>
                      <p class="text-gray-900 dark:text-white">{{ profile.address }}</p>
                    </div>
                    <button @click="showEditAddressModal = true"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Contraseña</h3>
                      <p class="text-gray-900 dark:text-white">••••••••</p>
                    </div>
                    <button @click="showEditPasswordModal = true"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Preferencias -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferencias</h2>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Notificaciones por correo</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Recibe actualizaciones sobre tus envíos</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="emailNotifications" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">Recibir noticias por correo</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Mantente al día con nuestras actualizaciones</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="newsletter" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
            
            <button @click="updatePreferences"
                    class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
              Guardar Preferencias
            </button>
          </div>
        </div>
      </div>
    </main>

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
                     v-model="profile.phone"
                     @keyup.enter="updatePhone(profile.phone)"
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditPhoneModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updatePhone(profile.phone)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Dirección -->
    <div v-if="showEditAddressModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Dirección</h2>
            <button @click="showEditAddressModal = false" 
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva dirección
              </label>
              <textarea v-model="profile.address"
                        @keyup.enter="updateAddress(profile.address)"
                        rows="2"
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditAddressModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updateAddress(profile.address)"
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

    <!-- Modal Editar Documento -->
    <div v-if="showEditDocumentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Editar Documento de Identidad</h2>
            <button @click="showEditDocumentModal = false" 
                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de documento
              </label>
              <select v-model="profile.documentType"
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Cédula">Cédula</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de documento
              </label>
              <input type="text" 
                     v-model="profile.documentNumber"
                     @keyup.enter="updateDocument(profile.documentNumber)"
                     class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showEditDocumentModal = false"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button @click="updateDocument(profile.documentNumber)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast"
         class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
      <i class="fas fa-check-circle"></i>
      <span>{{ toastMessage }}</span>
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