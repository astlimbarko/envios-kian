<script setup>
import { ref } from 'vue'

const props = defineProps({
  texto: {
    type: String,
    default: 'Ir al siguiente paso'
  },
  colorInicial: {
    type: String,
    default: 'blue'
  },
  deshabilitado: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  console.log('BotonContinuar: Click detectado')
  if (!props.deshabilitado) {
    console.log('BotonContinuar: Emitiendo evento click')
    emit('click')
  } else {
    console.log('BotonContinuar: Botón deshabilitado')
  }
}

const getColorClasses = (baseColor) => {
  return {
    [`bg-${baseColor}-600 hover:bg-${baseColor}-700 focus:ring-${baseColor}-500`]: true,
    'opacity-50 cursor-not-allowed': props.deshabilitado
  }
}
</script>

<template>
  <div class="flex justify-center mt-6">
    <button 
      @click.stop="handleClick"
      class="w-full py-3 px-6 rounded-xl text-white font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
      :class="getColorClasses(colorInicial)"
      :disabled="deshabilitado"
    >
      {{ texto }}
    </button>
  </div>
</template> 