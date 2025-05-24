<script setup>
// Componente de información de contacto
</script>

<template>
  <div>
    

    <div class="rounded-xl shadow-md border border-gray-300/30 backdrop-blur-md bg-white/80 overflow-hidden mb-6">
      <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-100/40">
        <h2 class="text-xl font-semibold text-gray-800">Contáctanos</h2>
      </div>

      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Contacto en Suecia -->
          <div class="space-y-4 transition-all duration-200 hover:-translate-y-0.5">
            <div class="flex items-center">
              <div class="w-12 h-8 flex items-center justify-center mr-3 hover:scale-110 transition-transform duration-300">
                <img src="/flags/flag_sve.svg" alt="Bandera de Suecia" class="h-6 w-10 rounded-full shadow-md border border-gray-300">
              </div>
              <h3 class="text-lg font-medium text-gray-800">Suecia</h3>
            </div>

            <div class="pl-3 border-l-4 border-blue-100 rounded-r-lg transition-all duration-200 hover:border-[#146EBE] hover:bg-[#146EBE]/5 hover:pl-6 space-y-3">
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                0722729763
              </p>
              <p class="text-gray-700">
                <i class="fas fa-envelope text-[#146EBE] mr-2"></i>
                kontakt@envioskian.com
              </p>
              <div class="pt-2">
                <p class="text-sm text-gray-600 mb-1 font-medium">Horario de atención:</p>
                <p class="text-sm text-gray-600">Lunes a Viernes: 12:00 - 20:00</p>
              </div>
            </div>
          </div>

          <!-- Contacto en Bolivia -->
          <div class="space-y-4 transition-all duration-200 hover:-translate-y-0.5">
            <div class="flex items-center">
              <div class="w-12 h-8 flex items-center justify-center mr-3 hover:scale-110 transition-transform duration-300">
                <img src="/flags/flag_bo.svg" alt="Bandera de Bolivia" class="h-6 w-10 rounded-full shadow-md border border-gray-300">
              </div>
              <h3 class="text-lg font-medium text-gray-800">Bolivia</h3>
            </div>

            <div class="pl-3 border-l-4 border-blue-100 rounded-r-lg transition-all duration-200 hover:border-[#146EBE] hover:bg-[#146EBE]/5 hover:pl-6 space-y-3">
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                78987891
              </p>
              <p class="text-gray-700">
                <i class="fas fa-envelope text-[#146EBE] mr-2"></i>
                contacto@envioskian.com
              </p>
              <div class="pt-2">
                <p class="text-sm text-gray-600 mb-1 font-medium">Horario de atención:</p>
                <p class="text-sm text-gray-600">Lunes a Viernes: 07:00 - 19:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
