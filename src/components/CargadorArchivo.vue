<script setup>
import { ref } from 'vue'

const props = defineProps({
  titulo: {
    type: String,
    default: 'Comprobante'
  },
  tiposPermitidos: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'application/pdf']
  },
  tamanoMaximo: {
    type: Number,
    default: 10 * 1024 * 1024 // 10MB
  },
  icono: {
    type: String,
    default: 'fa-file-alt'
  }
})

const emit = defineEmits(['archivo-cargado', 'archivo-eliminado'])

const archivo = ref(null)
const preview = ref(null)
const error = ref(null)

const subir = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > props.tamanoMaximo) {
      error.value = `El archivo es demasiado grande. El tamaño máximo permitido es ${props.tamanoMaximo / (1024 * 1024)}MB.`
      return
    }

    if (!props.tiposPermitidos.includes(file.type)) {
      error.value = 'Tipo de archivo no válido. Por favor, sube un archivo válido.'
      return
    }

    archivo.value = file
    error.value = null

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      preview.value = null
    }

    emit('archivo-cargado', file)
  }
}

const eliminarArchivo = () => {
  archivo.value = null
  preview.value = null
  error.value = null
  emit('archivo-eliminado')
}
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{{ titulo }}</h3>
    <div class="flex items-center justify-center w-full">
      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
        <div class="flex flex-col items-center justify-center pt-3 pb-4">
          <i :class="['fas', icono, 'text-3xl text-gray-400 mb-2']"></i>
          <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Haga clic para cargar</span> o arrastre y suelte
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG o PDF (MAX. 10MB)</p>
        </div>
        <input type="file" accept="image/*,.pdf" @change="subir" class="hidden">
      </label>
    </div>
    <div v-if="error" class="mt-2 text-red-500 text-sm">{{ error }}</div>
    <div v-if="archivo" class="mt-3 flex justify-center">
      <div class="relative">
        <img v-if="archivo.type.startsWith('image/')" :src="preview" class="w-32 h-32 object-contain rounded-xl border border-gray-200 dark:border-gray-700">
        <div v-else class="w-32 h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700">
          <i class="fas fa-file-pdf text-3xl text-red-500"></i>
        </div>
        <button 
          @click="eliminarArchivo" 
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template> 