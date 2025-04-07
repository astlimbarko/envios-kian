<script setup>
import Navbar from './navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="container mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Mi Cuenta</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Información del perfil -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex flex-col items-center mb-6">
              <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-user text-4xl text-blue-500"></i>
              </div>
              <h2 class="text-xl font-semibold text-gray-800">Juan Pérez</h2>
              <p class="text-gray-600">Cliente desde 2022</p>
            </div>
            
            <div class="border-t pt-4">
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 mb-1">Correo electrónico</h3>
                <p class="text-gray-800">juan.perez@ejemplo.com</p>
              </div>
              <div class="mb-4">
                <h3 class="text-sm font-medium text-gray-500 mb-1">Teléfono</h3>
                <p class="text-gray-800">+52 555 123 4567</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Dirección</h3>
                <p class="text-gray-800">Calle Principal #123, Colonia Centro, Ciudad de México</p>
              </div>
            </div>
            
            <button class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>
        
        <!-- Información adicional -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Mis Direcciones</h2>
            
            <div class="space-y-4">
              <div class="border rounded p-4">
                <div class="flex justify-between">
                  <h3 class="font-medium text-gray-800">Casa</h3>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600">Calle Principal #123, Colonia Centro, Ciudad de México</p>
              </div>
              
              <div class="border rounded p-4">
                <div class="flex justify-between">
                  <h3 class="font-medium text-gray-800">Oficina</h3>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600">Av. Reforma #456, Piso 10, Colonia Juárez, Ciudad de México</p>
              </div>
            </div>
            
            <button class="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
              <i class="fas fa-plus mr-2"></i> Añadir dirección
            </button>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Preferencias</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-800">Notificaciones por correo</h3>
                  <p class="text-gray-600 text-sm">Recibe actualizaciones sobre tus envíos</p>
                </div>
                <div class="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transform translate-x-6"></div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-800">Notificaciones por SMS</h3>
                  <p class="text-gray-600 text-sm">Recibe alertas en tu teléfono</p>
                </div>
                <div class="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                  <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-800">Boletín de noticias</h3>
                  <p class="text-gray-600 text-sm">Mantente al día con nuestras actualizaciones</p>
                </div>
                <div class="relative inline-block w-12 h-6 rounded-full bg-blue-500">
                  <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transform translate-x-6"></div>
                </div>
              </div>
            </div>
            
            <button class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
              Guardar Preferencias
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 