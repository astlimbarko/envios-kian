<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Términos y Condiciones</h3>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="space-y-4 text-gray-700 dark:text-gray-300">
        <section>
          <h4 class="font-semibold text-lg mb-2">Tiempos de Procesamiento</h4>
          <ul class="list-disc list-inside space-y-2">
            <li>Remesas por código QR: Procesamiento en 30 minutos</li>
            <li>Transferencias bancarias: Procesamiento en 60 minutos</li>
          </ul>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Horarios de Atención</h4>
          <p>Nuestro servicio está disponible de lunes a sábado, de 7:00 AM a 7:00 PM.</p>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Protección de Datos</h4>
          <p>La información personal proporcionada es tratada con absoluta confidencialidad y no será compartida con terceros sin su consentimiento explícito. Todos los datos son almacenados de manera segura y en cumplimiento con las regulaciones de protección de datos vigentes.</p>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Responsabilidad</h4>
          <p>El remitente es el único responsable de la veracidad de los datos proporcionados y de la legitimidad de los fondos transferidos. KIAN se reserva el derecho de verificar la información y retener transacciones que no cumplan con nuestras políticas de seguridad.</p>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Limitaciones del Servicio</h4>
          <ul class="list-disc list-inside space-y-2">
            <li>Las transacciones están sujetas a límites diarios y mensuales</li>
            <li>Se pueden requerir documentos adicionales para transacciones de alto valor</li>
            <li>El servicio puede estar sujeto a restricciones según el país de destino</li>
          </ul>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Política de Cancelación</h4>
          <p>Las remesas pueden ser canceladas antes de su procesamiento. Una vez procesada, la cancelación estará sujeta a las políticas de la entidad financiera receptora y podrían aplicarse cargos adicionales.</p>
        </section>

        <section>
          <h4 class="font-semibold text-lg mb-2">Tarifas y Comisiones</h4>
          <p>Las tarifas aplicadas son claramente indicadas antes de la confirmación de la transacción. Estas pueden variar según el método de pago, el monto y el país de destino.</p>
        </section>
      </div>

      <div class="mt-6 flex justify-end">
        <button 
          @click="$emit('cerrar')"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mostrar: {
    type: Boolean,
    required: true
  }
})

defineEmits(['cerrar'])
</script> 