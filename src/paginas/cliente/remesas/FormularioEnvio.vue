<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  cambioEstandar: {
    type: Number,
    required: true
  },
  cambioEspecial: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['datos'])

// Estados para el formulario
const montoEnviar = ref('')
const montoRecibir = ref('')
const campoActivo = ref('enviar') // 'enviar' o 'recibir'
const botonUsado = ref(false)
const valoresIniciales = ref({ enviar: '', recibir: '' })
const hayCambios = ref(false)
const paisSeleccionado = ref({
  nombre: 'Bolivia',
  codigo: 'BO',
  moneda: 'BOB',
  bandera: '/flag_bo.svg'
})

// Lista de países (por ahora solo Bolivia)
const paises = ref([
  {
    nombre: 'Bolivia',
    codigo: 'BO',
    moneda: 'BOB',
    bandera: '/flag_bo.svg'
  }
])

// Cálculo del tipo de cambio a usar
const tipoCambio = computed(() => {
  if (props.cambioEstandar === props.cambioEspecial) return props.cambioEstandar
  if (Number(montoRecibir.value) >= 5000) return props.cambioEspecial
  return props.cambioEstandar
})

// Actualización automática de montos
const actualizarMontos = (valor, campo) => {
  if (campo === 'enviar' && valor) {
    montoRecibir.value = (parseFloat(valor) * tipoCambio.value).toFixed(2)
  } else if (campo === 'recibir' && valor) {
    montoEnviar.value = (parseFloat(valor) / tipoCambio.value).toFixed(2)
  }
}

// Función para detectar cambios
const detectarCambios = () => {
  hayCambios.value = montoEnviar.value !== valoresIniciales.value.enviar || 
                     montoRecibir.value !== valoresIniciales.value.recibir
}

// Función para continuar
const continuar = () => {
  if (botonUsado.value) {
    // Si hay cambios, actualizar los valores iniciales
    valoresIniciales.value = {
      enviar: montoEnviar.value,
      recibir: montoRecibir.value
    }
    hayCambios.value = false
    return
  }
  
  botonUsado.value = true
  valoresIniciales.value = {
    enviar: montoEnviar.value,
    recibir: montoRecibir.value
  }
  emit('datos', {
    montoEnviar: montoEnviar.value,
    montoRecibir: montoRecibir.value,
    tipoCambio: tipoCambio.value,
    pais: paisSeleccionado.value
  })

  // Asegurar que el siguiente paso se muestre en la parte superior
  setTimeout(() => {
    const siguientePaso = document.getElementById('paso-2')
    if (siguientePaso) {
      const headerOffset = 80
      const elementPosition = siguientePaso.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Agregar efecto de resaltado
      siguientePaso.classList.add('paso-activo')
      setTimeout(() => {
        siguientePaso.classList.remove('paso-activo')
      }, 2000)
    }
  }, 100)
}

// Observar cambios en los montos
watch([montoEnviar, montoRecibir], () => {
  if (botonUsado.value) {
    detectarCambios()
  }
})

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !botonUsado.value && montoEnviar.value) {
    continuar()
  }
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-400 dark:border-gray-500" @keypress="handleKeyPress">
    <div class="text-center mb-3">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Nueva remesa</h2>
      <p class="text-gray-600 dark:text-gray-300">Ingresa los detalles de tu envío</p>
    </div>

    <!-- Selector de país -->
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        País de destino
      </label>
      <div class="relative">
        <select 
          v-model="paisSeleccionado"
          class="w-full pl-20 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white hover:border-blue-500 transition-colors bg-white dark:bg-gray-800"
          :style="{
            backgroundImage: `url(${paisSeleccionado.bandera})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0% center',
            backgroundSize: '6% auto',
            '@media (max-width: 768px)': {
              backgroundSize: '12% auto'
            }
          }"
        >
          <option 
            v-for="pais in paises" 
            :key="pais.codigo" 
            :value="pais"
          >
            {{ pais.nombre }}
          </option>
        </select>
      </div>
    </div>

    <!-- Campos de monto -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <!-- Campo SEK -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monto en SEK
        </label>
        <div class="relative">
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            v-model="montoEnviar"
            @focus="campoActivo = 'enviar'"
            @input="e => actualizarMontos(e.target.value, 'enviar')"
            class="w-full pl-4 pr-12 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white text-lg hover:border-blue-500 transition-colors bg-white dark:bg-gray-800" 
            placeholder="0.00"
            :class="{'ring-2 ring-blue-500 border-blue-500': campoActivo === 'enviar'}"
          >
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium">
            SEK
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingresa el monto que deseas enviar
        </p>
      </div>

      <!-- Campo BOB -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monto en {{ paisSeleccionado.moneda }}
        </label>
        <div class="relative">
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            v-model="montoRecibir"
            @focus="campoActivo = 'recibir'"
            @input="e => actualizarMontos(e.target.value, 'recibir')"
            class="w-full pl-4 pr-12 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white text-lg hover:border-blue-500 transition-colors bg-white dark:bg-gray-800" 
            placeholder="0.00"
            :class="{'ring-2 ring-blue-500 border-blue-500': campoActivo === 'recibir'}"
          >
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-400 font-medium">
            {{ paisSeleccionado.moneda }}
          </span>
        </div>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingresa el monto que deseas recibir
        </p>
      </div>
    </div>

    <!-- Tipo de cambio -->
    <div class="mb-3">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium text-gray-900 dark:text-white">1.00 SEK = {{ tipoCambio.toFixed(4) }} {{ paisSeleccionado.moneda }}</span>
          <template v-if="cambioEstandar !== cambioEspecial">
            <span 
              v-if="tipoCambio === cambioEspecial" 
              class="ml-2 px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-semibold"
            >
              Tipo especial aplicado
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Botón de continuar -->
    <button 
      @click="continuar"
      :disabled="(!montoEnviar && !montoRecibir) || (!botonUsado && hayCambios)"
      class="w-full py-2 px-4 rounded-xl text-white font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        !botonUsado ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500' :
        hayCambios ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500' :
        'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:ring-emerald-500'
      ]"
    >
      {{ 
        !botonUsado ? 'Continuar' : 
        hayCambios ? 'Cambiar cantidad' : 
        'Completa los siguientes pasos ...' 
      }}
    </button>
  </div>
</template>

<style scoped>
/* Efectos de hover mejorados para las tarjetas */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Transición suave para el hover */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Efecto de elevación al hover */
.transform {
  transition: transform 0.3s ease-in-out;
}

/* Estilo para el campo activo */
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Animación suave para el cambio de campo activo */
input {
  transition: all 0.2s ease-in-out;
}

/* Efecto de brillo en los bordes */
.border-4 {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

/* Estilos para la bandera en diferentes dispositivos */
@media (max-width: 768px) {
  select {
    background-size: 15% auto !important;
  }
}

@media (max-width: 480px) {
  select {
    background-size: 18% auto !important;
  }
}
</style> 