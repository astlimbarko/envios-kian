<template>
  <div class="min-h-screen py-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="remesa in remesas" 
        :key="remesa.id"
        class="bg-gradient-to-br from-teal-900/90 to-blue-900/90 rounded-xl shadow-xl p-6 border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-teal-100">{{ remesa.recipient }}</h3>
            <p class="text-teal-200/80">{{ remesa.date }}</p>
          </div>
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-yellow-500/20 text-yellow-200': remesa.status === 'En Progreso',
              'bg-green-500/20 text-green-200': remesa.status === 'Completada',
              'bg-red-500/20 text-red-200': remesa.status === 'Cancelada'
            }"
          >
            {{ remesa.status }}
          </span>
        </div>

        <div class="space-y-2 text-teal-100">
          <p class="flex justify-between">
            <span class="text-teal-200/80">Monto enviado:</span>
            <span class="font-medium">{{ remesa.amount }} {{ remesa.currency }}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-teal-200/80">Monto recibido:</span>
            <span class="font-medium">{{ remesa.receivedAmount }} {{ remesa.receivedCurrency }}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-teal-200/80">Método de pago:</span>
            <span class="font-medium">{{ remesa.paymentMethod }}</span>
          </p>
          <p class="flex justify-between">
            <span class="text-teal-200/80">Método de recepción:</span>
            <span class="font-medium">{{ remesa.receiveMethod }}</span>
          </p>
        </div>

        <div class="mt-4 pt-4 border-t border-teal-500/20">
          <p class="text-teal-200/80 text-sm">
            Código de seguimiento: <span class="font-medium text-teal-100">{{ remesa.trackingCode }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 