<script setup>
// Componente de información de contacto
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Información de Contacto</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Nuestras Oficinas</h2>
      </div>
      
      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Oficina en Suecia -->
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-12 h-8 flex items-center justify-center mr-3">
                <img src="https://upload.wikimedia.org/wikipedia/en/4/4c/Flag_of_Sweden.svg" alt="Bandera de Suecia" class="h-6 rounded shadow">
              </div>
              <h3 class="text-lg font-medium text-gray-800">Suecia</h3>
            </div>
            
            <div class="pl-3 border-l-4 border-blue-100 space-y-3">
              <p class="text-gray-700">
                <i class="fas fa-map-marker-alt text-[#146EBE] mr-2"></i>
                Gärdesgatan 12, 412 50 Göteborg, Sverige
              </p>
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                +46 700 123 456 (Sueco)
              </p>
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                +46 700 456 789 (Español)
              </p>
              <p class="text-gray-700">
                <i class="fab fa-whatsapp text-[#146EBE] mr-2"></i>
                +46 700 789 012 (Atención en Sueco y Español)
              </p>
              <p class="text-gray-700">
                <i class="fas fa-envelope text-[#146EBE] mr-2"></i>
                suecia@envioskian.com
              </p>
              <div class="pt-2">
                <p class="text-sm text-gray-600 mb-1 font-medium">Horario de atención:</p>
                <p class="text-sm text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                <p class="text-sm text-gray-600">Sábados: 10:00 - 14:00</p>
              </div>
            </div>
          </div>
          
          <!-- Oficina en Bolivia -->
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-12 h-8 flex items-center justify-center mr-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/1200px-Flag_of_Bolivia.svg.png" alt="Bandera de Bolivia" class="h-6 rounded shadow">
              </div>
              <h3 class="text-lg font-medium text-gray-800">Bolivia</h3>
            </div>
            
            <div class="pl-3 border-l-4 border-blue-100 space-y-3">
              <p class="text-gray-700">
                <i class="fas fa-map-marker-alt text-[#146EBE] mr-2"></i>
                Av. Cristóbal de Mendoza #358, Santa Cruz de la Sierra, Bolivia
              </p>
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                +591 3 346 7890 (Oficina Central)
              </p>
              <p class="text-gray-700">
                <i class="fas fa-phone text-[#146EBE] mr-2"></i>
                +591 70223456 (Atención al Cliente)
              </p>
              <p class="text-gray-700">
                <i class="fab fa-whatsapp text-[#146EBE] mr-2"></i>
                +591 75556789 (WhatsApp - Atención Rápida)
              </p>
              <p class="text-gray-700">
                <i class="fas fa-envelope text-[#146EBE] mr-2"></i>
                bolivia@envioskian.com
              </p>
              <div class="pt-2">
                <p class="text-sm text-gray-600 mb-1 font-medium">Horario de atención:</p>
                <p class="text-sm text-gray-600">Lunes a Viernes: 8:30 - 17:30</p>
                <p class="text-sm text-gray-600">Sábados: 9:00 - 13:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Formulario de contacto -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div class="p-5 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Envíanos un mensaje</h2>
      </div>
      
      <div class="p-5">
        <form class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Nombre completo *</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" required>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Correo electrónico *</label>
              <input type="email" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" required>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Asunto *</label>
            <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" required>
          </div>
          <div>
            <label class="block text-sm text-gray-700 mb-1">Mensaje *</label>
            <textarea rows="4" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#146EBE] focus:border-transparent" required></textarea>
          </div>
          <div>
            <button type="submit" class="px-4 py-2 bg-[#146EBE] text-white rounded hover:bg-blue-700 transition-colors">
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </div>
    
    
  </div>
</template>

<style scoped>
/* Efecto Mica (Windows 11) */
.bg-white {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(209, 213, 219, 0.3);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* Encabezados con gradiente */
.border-b {
  border-bottom-width: 1px;
  background: linear-gradient(to right, rgba(249, 250, 251, 0.8), rgba(252, 252, 252, 0.4));
}

/* Efecto de elevación para los paneles de país */
.space-y-4 > div:first-of-type,
.space-y-4 > div:last-of-type {
  transition: all 0.2s ease;
}

.space-y-4 > div:hover {
  transform: translateY(-2px);
}

/* Estilos para bordes con acento */
.border-l-4 {
  border-radius: 0 8px 8px 0;
  transition: all 0.2s ease;
}

.border-l-4:hover {
  border-left-color: #146EBE;
  background-color: rgba(20, 110, 190, 0.03);
  padding-left: 1.5rem;
}

/* Estilo botones */
button {
  transition: all 0.15s ease;
  border-radius: 6px;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Estilo inputs y formularios */
input, textarea, select {
  border-radius: 6px;
  transition: all 0.2s ease;
}

input:focus, textarea:focus, select:focus {
  box-shadow: 0 0 0 3px rgba(20, 110, 190, 0.2);
}

/* Iconos con efecto hover */
i[class^="text-"] {
  transition: all 0.2s ease;
}

p:hover i[class^="text-"] {
  transform: translateX(2px);
}

/* Animaciones para preguntas frecuentes */
.py-3 {
  transition: all 0.3s ease;
  border-radius: 6px;
}

.py-3:hover {
  background-color: rgba(243, 244, 246, 0.5);
  padding-left: 0.5rem;
  transform: translateX(2px);
}

/* Efecto para banderas */
img.rounded {
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.w-12:hover img {
  transform: scale(1.1);
}
</style> 