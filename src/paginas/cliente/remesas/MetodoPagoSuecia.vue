<script setup>
import { ref } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  metodos: {
    type: Array,
    default: () => [
      { nombre: 'Swish', valor: 'swish', icono: 'fas fa-mobile-alt' },
      { nombre: 'Transferencia Bancaria', valor: 'banco', icono: 'fas fa-university' }
    ]
  }
})

const emit = defineEmits(['seleccionado'])
const seleccionado = ref('')
const archivo = ref(null)
const preview = ref(null)
const error = ref(null)
const botonUsado = ref(false)
const nombreBeneficiario = ref('')

const cuentasBancarias = {
  suecia: {
    banco: 'Swedbank',
    cuenta: 'SE1234567890123456789012',
    swift: 'SWEDSESS',
    titular: 'KIAN AB'
  },
  estonia: {
    banco: 'SEB Bank Estonia',
    cuenta: 'EE123456789012345678',
    swift: 'SEBEE2X',
    titular: 'KIAN OÜ'
  }
}

const datosSwish = {
  numero: '0722729763',
  referencia: 'Gåva'
}

const seleccionarMetodo = (metodo) => {
  seleccionado.value = metodo
  emit('seleccionado', metodo)

  // Asegurar que el siguiente paso se muestre en la parte superior
  setTimeout(() => {
    const siguientePaso = document.getElementById('paso-4')
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

const continuar = () => {
  if (botonUsado.value) {
    return
  }
  
  botonUsado.value = true
  
  // Emitir el método seleccionado y el nombre del beneficiario si es swish
  emit('seleccionado', {
    metodo: seleccionado.value,
    nombreBeneficiario: seleccionado.value === 'swish' ? nombreBeneficiario.value : null
  })

  // Scroll al siguiente paso
  setTimeout(() => {
    const siguientePaso = document.getElementById('paso-4')
    if (siguientePaso) {
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
      }, 2000)
    }
  }, 100)
}

const subir = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB.'
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      error.value = 'Tipo de archivo no válido. Por favor, sube una imagen PNG, JPG o PDF.'
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
  }
}

const eliminarArchivo = () => {
  archivo.value = null
  preview.value = null
  error.value = null
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-8">
      <!-- Titulo y descripcion de Metodo de pago --> 
      <h2 id="metodo-pago-titulo" class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Método de pago</h2>
      <p class="text-gray-600 dark:text-gray-300">Selecciona cómo deseas realizar el pago</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <button 
        v-for="m in props.metodos" 
        :key="m.valor"
        @click="seleccionarMetodo(m.valor)"
        :class="[
          'flex flex-col items-center justify-center border-2 rounded-xl p-6 transition-all',
          seleccionado === m.valor 
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-100 dark:shadow-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
          'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md'
        ]"
      >
        <div 
          class="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4"
          :class="{ 'bg-blue-100 dark:bg-blue-900/30': seleccionado === m.valor }"
        >
          <i :class="[m.icono, 'text-3xl text-blue-600 dark:text-blue-400']"></i>
        </div>
        <span class="font-semibold text-gray-900 dark:text-white text-lg mb-2">{{ m.nombre }}</span>
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
          {{ m.valor === 'swish' ? 'Paga instantáneamente usando tu teléfono móvil' : 'Realiza una transferencia bancaria desde tu cuenta' }}
        </p>
      </button>
    </div>

    <!-- Información del método seleccionado -->
    <div v-if="seleccionado === 'swish'" class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Datos del Swish</h3>
      <div class="space-y-4">


        <div class="space-y-2">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-medium">Número:</span> {{ datosSwish.numero }}
          </p>
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-medium">Referencia:</span> {{ datosSwish.referencia }}
          </p>
        </div>

        <!-- Área de comprobante integrada -->
        <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Comprobante de pago</h4>
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
          <div v-if="preview" class="flex justify-center mb-4">
            <div class="relative">
              <img :src="preview" class="w-40 h-40 object-contain rounded-xl border border-gray-300 dark:border-gray-600">
              <button 
                @click="eliminarArchivo" 
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="seleccionado === 'banco'" class="space-y-4">
      <!-- Contenedor flex para las cuentas bancarias -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Cuenta en Suecia -->
        <div class="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
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

        <!-- Cuenta en Estonia -->
        <div class="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cuenta en Estonia</h3>
          <div class="space-y-2">
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Banco:</span> {{ cuentasBancarias.estonia.banco }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Cuenta:</span> {{ cuentasBancarias.estonia.cuenta }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">SWIFT:</span> {{ cuentasBancarias.estonia.swift }}
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Titular:</span> {{ cuentasBancarias.estonia.titular }}
            </p>
          </div>
        </div>
      </div>

      <!-- Área de comprobante integrada -->
      <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Comprobante de pago</h4>
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
        <div v-if="preview" class="flex justify-center mb-4">
          <div class="relative">
            <img :src="preview" class="w-40 h-40 object-contain rounded-xl border border-gray-300 dark:border-gray-600">
            <button 
              @click="eliminarArchivo" 
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Continuar -->
    <div v-if="seleccionado" class="w-full mt-6">
      <BotonContinuar
        :texto="'Seleccionar método de pago'"
        :textoCompletado="'Método de pago seleccionado'"
        :colorInicial="'blue'"
        :colorCompletado="'emerald'"
        :deshabilitado="false"
        @click="continuar"
      />
    </div>
  </div>
</template>

<style scoped>
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