<script setup>
import { ref } from 'vue'

const props = defineProps({
  texto: {
    type: String,
    default: 'Continuar'
  },
  textoCompletado: {
    type: String,
    default: '¡Listo!'
  },
  colorInicial: {
    type: String,
    default: 'blue'
  },
  colorCompletado: {
    type: String,
    default: 'emerald'
  },
  deshabilitado: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
const botonUsado = ref(false)

const handleClick = () => {
  if (botonUsado.value || props.deshabilitado) return
  botonUsado.value = true
  emit('click')
}

const getColorClasses = (baseColor) => {
  return {
    [`bg-gradient-to-r from-${baseColor}-600 to-${baseColor}-700 hover:from-${baseColor}-700 hover:to-${baseColor}-800 focus:ring-${baseColor}-500`]: true
  }
}
</script>

<template>
  <div class="flex justify-center mt-6">
    <button 
      @click="handleClick"
      :disabled="deshabilitado || botonUsado"
      class="w-full py-2 px-4 rounded-xl text-white font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        !botonUsado ? getColorClasses(colorInicial) : getColorClasses(colorCompletado)
      ]"
    >
      {{ !botonUsado ? texto : textoCompletado }}
    </button>
  </div>
</template> 