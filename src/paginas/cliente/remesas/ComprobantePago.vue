<script setup>
import { ref, computed } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  metodo: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['comprobante'])

const archivo = ref(null)
const preview = ref(null)
const error = ref(null)

// Datos de las cuentas bancarias
const cuentasBancarias = {
  suecia: {
    banco: 'Swedbank',
    cuenta: 'SE1234567890123456789012',
    swift: 'SWEDSESS',
    titular: 'KIAN AB'
  },
  lituania: {
    banco: 'SEB Bank',
    cuenta: 'LT123456789012345678',
    swift: 'SEBLT2X',
    titular: 'KIAN UAB'
  }
}

// Datos del Switch
const datosSwitch = {
  numero: '123456789',
  referencia: 'KIAN-SWITCH'
}

const archivoValido = computed(() => {
  if (!archivo.value) return false
  const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf']
  const maxSize = 10 * 1024 * 1024 // 10MB
  return tiposPermitidos.includes(archivo.value.type) && archivo.value.size <= maxSize
})

const subir = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.')
      return
    }

    const validTypes = ['image/png', 'image/jpeg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      alert('Tipo de archivo no válido. Por favor, sube una imagen PNG, JPG o un archivo PDF.')
      return
    }

    archivo.value = file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        preview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      preview.value = null
    }

    // Asegurar que el siguiente paso se muestre en la parte superior
    setTimeout(() => {
      const siguientePaso = document.getElementById('paso-5')
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
}

const eliminarArchivo = () => {
  archivo.value = null
  preview.value = null
  error.value = null
  emit('comprobante', null)
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Comprobante de pago</h2>
      <p class="text-gray-600 dark:text-gray-300">Sube el comprobante de tu pago</p>
    </div>

    <!-- Información del método de pago -->
    <div class="mb-6">
      <template v-if="metodo === 'switch'">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Datos del Switch</h3>
          <div class="space-y-2">
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Número:</span> {{ datosSwitch.numero }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Referencia:</span> {{ datosSwitch.referencia }}
            </p>
          </div>
        </div>
      </template>

      <template v-else-if="metodo === 'transferencia'">
        <div class="space-y-4">
          <!-- Cuenta en Suecia -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cuenta en Suecia</h3>
            <div class="space-y-2">
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Banco:</span> {{ cuentasBancarias.suecia.banco }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Cuenta:</span> {{ cuentasBancarias.suecia.cuenta }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">SWIFT:</span> {{ cuentasBancarias.suecia.swift }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Titular:</span> {{ cuentasBancarias.suecia.titular }}
              </p>
            </div>
          </div>

          <!-- Cuenta en Lituania -->
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cuenta en Lituania</h3>
            <div class="space-y-2">
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Banco:</span> {{ cuentasBancarias.lituania.banco }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Cuenta:</span> {{ cuentasBancarias.lituania.cuenta }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">SWIFT:</span> {{ cuentasBancarias.lituania.swift }}
              </p>
              <p class="text-gray-700 dark:text-gray-300">
                <span class="font-medium">Titular:</span> {{ cuentasBancarias.lituania.titular }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Área de subida de archivo -->
    <div class="mb-4">
      <label 
        class="block w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        :class="{'border-red-500 dark:border-red-400': error}"
      >
        <input 
          type="file" 
          class="hidden" 
          accept=".jpg,.jpeg,.png,.pdf"
          @change="subir"
        >
        <div class="space-y-2">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div class="text-gray-600 dark:text-gray-400">
            <span class="font-medium">Haz clic para subir</span> o arrastra y suelta
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            PNG, JPG o PDF (máx. 10MB)
          </p>
        </div>
      </label>
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Vista previa -->
    <div v-if="preview" class="mb-4">
      <div class="relative">
        <img 
          v-if="archivo?.type.startsWith('image/')" 
          :src="preview" 
          class="w-full h-48 object-contain rounded-lg"
          alt="Vista previa"
        >
        <div 
          v-else 
          class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
        >
          <span class="text-gray-500 dark:text-gray-400">PDF seleccionado</span>
        </div>
        <button 
          @click="eliminarArchivo"
          class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="archivoValido" class="w-full mt-6">
      <BotonContinuar
        :texto="'Subir comprobante'"
        :textoCompletado="'Comprobante subido correctamente'"
        :colorInicial="'blue'"
        :colorCompletado="'emerald'"
        :deshabilitado="!archivoValido"
        @click="continuar"
      />
    </div>
  </div>
</template>

<style scoped>
/* ... existing styles ... */
</style> 