/**
 * Componente FormularioEnvio.vue
 * 
 * Este componente maneja el formulario inicial de la remesa.
 * Utiliza el store centralizado para manejar el estado.
 */

<script setup>
import { ref, computed, watch } from 'vue'
import { useRemesaStore } from '../../../stores/remesa'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const store = useRemesaStore()

const props = defineProps({
  cambioEstandar: {
    type: Number,
    required: true,
    default: 1.08
  },
  cambioEspecial: {
    type: Number,
    required: true,
    default: 1.09
  }
})

const emit = defineEmits(['datos', 'siguiente-paso'])

// Inicializar el estado local
const montoEnviar = ref('')
const montoRecibir = ref('')
const tipoCambio = ref(0)
const pais = ref(null)
const campoActivo = ref('enviar')
const botonUsado = ref(false)

// Computed properties para los montos formateados
const montoEnviarFormateado = computed(() => {
  return montoEnviar.value ? parseFloat(montoEnviar.value).toFixed(2) : '0.00'
})

const montoRecibirFormateado = computed(() => {
  return montoRecibir.value ? parseFloat(montoRecibir.value).toFixed(2) : '0.00'
})

// Lista de países (por ahora solo Bolivia)
const paises = ref([
  {
    nombre: 'Bolivia',
    codigo: 'BO',
    moneda: 'BOB',
    bandera: '/flags/flag_bo.svg'
  }
])

const paisSeleccionado = ref(paises.value[0])

// Bandera de Suecia
const banderaSuecia = '/flags/flag_sve.svg'

// Cálculo del tipo de cambio a usar
const tipoCambioComputed = computed(() => {
  if (props.cambioEstandar === props.cambioEspecial) return props.cambioEstandar
  if (Number(montoRecibir.value) >= 5000) return props.cambioEspecial
  return props.cambioEstandar
})

// Función para actualizar montos
const actualizarMontos = (valor, campo) => {
  if (campo === 'enviar' && valor) {
    montoEnviar.value = valor
    montoRecibir.value = (parseFloat(valor) * tipoCambioComputed.value).toFixed(2)
  } else if (campo === 'recibir' && valor) {
    montoRecibir.value = valor
    montoEnviar.value = (parseFloat(valor) / tipoCambioComputed.value).toFixed(2)
  }
}

// Función para continuar
const continuar = () => {
  console.log('FormularioEnvio: Iniciando función continuar')
  console.log('FormularioEnvio: Estado actual:', {
    montoEnviar: montoEnviar.value,
    montoRecibir: montoRecibir.value,
    tipoCambio: tipoCambioComputed.value,
    pais: paisSeleccionado.value
  })

  try {
    if (!montoEnviar.value || !montoRecibir.value || !paisSeleccionado.value) {
      console.log('FormularioEnvio: Faltan datos requeridos')
      return
    }

    // Actualizar el store con los datos finales
    store.actualizarTransaccion({
      montoEnviar: parseFloat(montoEnviar.value),
      montoRecibir: parseFloat(montoRecibir.value),
      tipoCambio: tipoCambioComputed.value,
      pais: paisSeleccionado.value
    })
    console.log('FormularioEnvio: Store actualizado exitosamente')

    // Avanzar al siguiente paso
    store.setPasoActual(2)
    console.log('FormularioEnvio: Paso actual actualizado a 2')

    // Emitir evento para mostrar el siguiente paso
    emit('siguiente-paso', 2)
    console.log('FormularioEnvio: Evento siguiente-paso emitido con paso 2')

    // Emitir evento con los datos
    emit('datos', {
      montoEnviar: parseFloat(montoEnviar.value),
      montoRecibir: parseFloat(montoRecibir.value),
      tipoCambio: tipoCambioComputed.value,
      pais: paisSeleccionado.value
    })
    console.log('FormularioEnvio: Evento datos emitido')

    // Scroll al siguiente paso
    setTimeout(() => {
      console.log('FormularioEnvio: Iniciando scroll')
      const siguientePaso = document.querySelector('.metodo-recepcion-titulo')
      if (siguientePaso) {
        console.log('FormularioEnvio: Elemento siguiente paso encontrado')
        const headerOffset = 80
        const elementPosition = siguientePaso.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        siguientePaso.classList.add('paso-activo')
        setTimeout(() => {
          siguientePaso.classList.remove('paso-activo')
        }, 2)
      } else {
        console.log('FormularioEnvio: No se encontró el elemento siguiente paso')
      }
    }, 100)
  } catch (error) {
    console.error('FormularioEnvio: Error en la función continuar:', error)
  }
}

// Observar cambios en los montos
watch([montoEnviar, montoRecibir], () => {
  if (botonUsado.value) {
    detectarCambios()
  }
})

const handleKeyPress = (event) => {
  if (montoEnviar.value && montoRecibir.value) {
    continuar()
  }
}
</script>

<template>
  <div 
    class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-4 border-4 border-gray-400 dark:border-gray-500"
    @keydown.enter.prevent="handleKeyPress"
  >
    <div class="text-center mb-3">
      <h2 class="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Nueva remesa</h2>
      <p class="text-[var(--color-text-secondary)]">Ingresa los detalles de tu envío</p>
    </div>

    <!-- Selector de país -->
    <div class="mb-3">
      <label class="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
        Dirección de la remesa
      </label>
      <div class="relative">
        <select 
          v-model="paisSeleccionado"
          class="w-full pl-32 pr-4 py-2 rounded-xl border-2 border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:border-[var(--color-blue-primary)] transition-colors"
        >
          <option 
            v-for="pais in paises" 
            :key="pais.codigo" 
            :value="pais"
          >
            {{ pais.nombre }}
          </option>
        </select>
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
          <img :src="banderaSuecia" alt="Bandera de Suecia" class="w-6 h-4 rounded shadow-sm">
          <span class="text-gray-400">→</span>
          <img :src="paisSeleccionado.bandera" alt="Bandera de Bolivia" class="w-6 h-4 rounded shadow-sm">
        </div>
      </div>
    </div>

    <!-- Campos de monto -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <!-- Campo SEK -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
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
            class="w-full pl-4 pr-12 py-2 rounded-xl border-2 border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-lg hover:border-[var(--color-blue-primary)] transition-colors" 
            placeholder="0.00"
            :class="{'ring-2 ring-[var(--color-blue-primary)] border-[var(--color-blue-primary)]': campoActivo === 'enviar'}"
          >
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] font-medium">
            SEK
          </span>
        </div>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Ingresa el monto que deseas enviar
        </p>
      </div>

      <!-- Campo BOB -->
      <div>
        <label class="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
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
            class="w-full pl-4 pr-12 py-2 rounded-xl border-2 border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-lg hover:border-[var(--color-blue-primary)] transition-colors" 
            placeholder="0.00"
            :class="{'ring-2 ring-[var(--color-blue-primary)] border-[var(--color-blue-primary)]': campoActivo === 'recibir'}"
          >
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] font-medium">
            {{ paisSeleccionado.moneda }}
          </span>
        </div>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Ingresa el monto que deseas recibir
        </p>
      </div>
    </div>

    <!-- Tipo de cambio -->
    <div class="mb-3">
      <div class="flex items-center justify-between">
        <div class="text-sm text-[var(--color-text-secondary)]">
          <span class="font-medium text-[var(--color-text-primary)]">1.00 SEK = {{ tipoCambioComputed.toFixed(4) }} {{ paisSeleccionado.moneda }}</span>
          <template v-if="cambioEstandar !== cambioEspecial">
            <span 
              v-if="tipoCambioComputed === cambioEspecial" 
              class="ml-2 px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-semibold"
            >
              Tipo especial aplicado
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Botón continuar -->
    <div class="w-full mt-6">
      <BotonContinuar
        :texto="'Continuar'"
        :colorInicial="'blue'"
        :deshabilitado="!montoEnviar || !montoRecibir"
        @click="continuar"
      />
    </div>
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

/* Animación para el paso activo */
.paso-activo {
  animation: highlight 2s ease-in-out;
  padding: 0.5rem;
  border-radius: 0.5rem;
  position: relative;
  z-index: 10;
}

@keyframes highlight {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2);
  }
  50% {
    background-color: rgba(59, 130, 246, 0.2);
    transform: scale(1.02);
    box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.2);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
</style> 