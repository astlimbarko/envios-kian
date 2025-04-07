<script setup>
import { computed } from 'vue';

const props = defineProps({
  texto: {
    type: String,
    default: 'Botón'
  },
  icono: {
    type: String,
    default: ''
  },
  tipo: {
    type: String,
    default: 'primario', // primario, secundario, texto
    validator: (value) => ['primario', 'secundario', 'texto'].includes(value)
  },
  anchoCompleto: {
    type: Boolean,
    default: false
  },
  tamanio: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  deshabilitado: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const manejarClick = (event) => {
  if (!props.deshabilitado) {
    emit('click', event);
  }
};

// Clases dinámicas basadas en las props
const clasesBoton = computed(() => {
  let clases = 'flex items-center rounded-md transition-all duration-300 transform hover:-translate-y-0.5 ';

  // Tamaño
  if (props.tamanio === 'sm') {
    clases += 'py-1 px-3 text-xs ';
  } else if (props.tamanio === 'lg') {
    clases += 'py-3 px-6 text-base ';
  } else {
    // Tamaño por defecto md
    clases += 'py-2 px-4 text-sm ';
  }

  // Tipo
  if (props.tipo === 'primario') {
    clases += 'bg-gradient-to-r from-[#3073ad] to-[#4c9ed9] hover:from-[#146EBE] hover:to-[#d94cba] text-white shadow-md hover:shadow-lg ';
  } else if (props.tipo === 'secundario') {
    clases += 'bg-gradient-to-r from-[#4c9ed9] to-[#7fb6e6] hover:from-[#3073ad] hover:to-[#4c9ed9] text-white shadow-sm hover:shadow-md ';
  } else if (props.tipo === 'texto') {
    clases += 'bg-transparent ';
  }

  // Ancho completo
  if (props.anchoCompleto) {
    clases += 'w-full ';
  } else {
    clases += 'w-auto ';
  }

  // Deshabilitado
  if (props.deshabilitado) {
    clases += 'opacity-50 cursor-not-allowed ';
  }

  return clases;
});
</script>

<template>
  <button 
    :class="clasesBoton"
    @click="manejarClick"
    :disabled="deshabilitado"
  >
    <i v-if="icono" :class="'fas fa-' + icono + ' mr-2'"></i>
    <slot>{{ texto }}</slot>
  </button>
</template>

<style scoped>
button:active:not(:disabled) {
  transform: scale(0.98);
}

button:hover .bg-gradient-to-r {
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Mejorar sombras para mayor profundidad */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Modo oscuro para sombras */
.dark .shadow-md {
  box-shadow: 0 4px 10px -1px rgba(0, 0, 0, 0.2), 0 2px 6px -1px rgba(0, 0, 0, 0.1);
}
</style> 