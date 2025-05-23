<template>
  <transition name="fade">
    <div v-if="mostrar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-xl mx-4 max-h-[70vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        
        <!-- Encabezado -->
        <div class="flex justify-between items-center px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">Términos y Condiciones</h3>
          <button @click="$emit('cerrar')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <i class="fas fa-times text-base"></i>
          </button>
        </div>

        <!-- Contenido -->
        <div class="px-5 py-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 space-y-3 leading-snug text-left">
          <section v-for="(seccion, index) in secciones" :key="index">
            <h4 class="font-medium text-sm mb-1">{{ seccion.titulo }}</h4>
            <div v-if="seccion.lista">
              <div v-for="(item, i) in seccion.lista" :key="i" class="pl-2">{{ item }}</div>
            </div>
            <p v-else class="pl-2">{{ seccion.texto }}</p>
          </section>
        </div>

        <!-- Botón de cierre -->
        <div class="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-end">
          <button 
            @click="$emit('cerrar')"
            class="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
})

defineEmits(['cerrar'])

const secciones = [
  {
    titulo: 'Tiempos de Procesamiento',
    lista: [
      'Remesas por código QR: 30 minutos',
      'Transferencias bancarias: 60 minutos'
    ]
  },
  {
    titulo: 'Horarios de Atención',
    texto: 'Lunes a sábado, de 7:00 AM a 7:00 PM.'
  },
  {
    titulo: 'Protección de Datos',
    texto: 'Tratamos tu información con confidencialidad y seguridad, cumpliendo con las normativas vigentes.'
  },
  {
    titulo: 'Responsabilidad',
    texto: 'El remitente es responsable de la veracidad de los datos y la legitimidad de los fondos.'
  },
  {
    titulo: 'Limitaciones del Servicio',
    lista: [
      'Límites diarios y mensuales',
      'Documentación adicional para montos altos',
      'Restricciones según país de destino'
    ]
  },
  {
    titulo: 'Política de Cancelación',
    texto: 'Las remesas pueden cancelarse antes del procesamiento. Después, dependerá de la entidad receptora.'
  },
  {
    titulo: 'Tarifas y Comisiones',
    texto: 'Las tarifas se muestran antes de confirmar la transacción y pueden variar según el método y destino.'
  }
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
