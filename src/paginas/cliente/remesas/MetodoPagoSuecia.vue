/**
 * Componente MetodoPagoSuecia.vue
 * 
 * Este componente maneja la selección del método de pago.
 * Utiliza el store centralizado para manejar el estado.
 */

<script setup>
import { ref, watch } from 'vue'
import { useRemesaStore } from '../../../store/remesa'
import BotonContinuar from '../../../components/BotonContinuar.vue'
import CargadorArchivo from '../../../components/CargadorArchivo.vue'

const store = useRemesaStore()
const emit = defineEmits(['siguiente-paso'])

// Estado local
const metodoSeleccionado = ref(null)
const error = ref(null)

// Watcher para actualizar el store
watch(metodoSeleccionado, (nuevoValor) => {
  if (nuevoValor) {
    actualizarStore()
  }
}, { immediate: true })

// Función para actualizar el store
const actualizarStore = () => {
  if (!metodoSeleccionado.value) return

  const datosPago = {
    tipo: metodoSeleccionado.value
  }

  console.log('Actualizando store con datos de pago:', datosPago)
  store.actualizarPago(datosPago)
}

// Función para seleccionar método
const seleccionarMetodo = (metodo) => {
  console.log('Seleccionando método de pago:', metodo)
  metodoSeleccionado.value = metodo
  error.value = null
}

// Función para continuar
const continuar = () => {
  console.log('Validando datos antes de continuar...')
  console.log('Método de pago seleccionado:', metodoSeleccionado.value)

  if (!metodoSeleccionado.value) {
    error.value = 'Por favor, seleccione un método de pago'
    return
  }

  actualizarStore()
  store.setPasoActual(4)
  emit('siguiente-paso', 4)
  scrollToNextStep()
}

// Función para scroll al siguiente paso
const scrollToNextStep = () => {
  setTimeout(() => {
    console.log('MetodoPagoSuecia: Iniciando scroll')
    const siguientePaso = document.querySelector('.paso-4')
    if (siguientePaso) {
      console.log('MetodoPagoSuecia: Elemento siguiente paso encontrado')
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
    } else {
      console.log('MetodoPagoSuecia: No se encontró el elemento siguiente paso')
    }
  }, 100)
}

const archivo = ref(null)
const preview = ref(null)
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

const flagSuecia = '/flags/flag_sve.svg'
const flagEstonia = '/flags/flag_est.svg'

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

// Función para copiar al portapapeles
const copiarAlPortapapeles = (texto) => {
  navigator.clipboard.writeText(texto).then(() => {
    // Mostrar notificación de éxito
    const notificacion = document.createElement('div')
    notificacion.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50'
    notificacion.innerHTML = '<div class="flex items-center"><i class="fas fa-check-circle mr-2"></i><span>¡Copiado al portapapeles!</span></div>'
    document.body.appendChild(notificacion)
    setTimeout(() => {
      notificacion.remove()
    }, 3000)
  })
}
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 metodo-pago-titulo">Método de pago</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Selecciona cómo deseas realizar el pago</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      <!-- Opción Swish -->
      <button 
        @click="seleccionarMetodo('swish')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          metodoSeleccionado === 'swish' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-mobile-alt text-xl" :class="metodoSeleccionado === 'swish' ? 'text-blue-500' : 'text-gray-400'"></i>
          <span class="text-base font-medium" :class="metodoSeleccionado === 'swish' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
            Swish
          </span>
        </div>
      </button>

      <!-- Opción Transferencia Bancaria -->
      <button 
        @click="seleccionarMetodo('banco')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          metodoSeleccionado === 'banco' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-university text-xl" :class="metodoSeleccionado === 'banco' ? 'text-blue-500' : 'text-gray-400'"></i>
          <span class="text-base font-medium" :class="metodoSeleccionado === 'banco' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
            Transferencia Bancaria
          </span>
        </div>
      </button>
    </div>

    <!-- Detalles del método seleccionado -->
    <div v-if="metodoSeleccionado" class="mt-6">
      <!-- Detalles Swish -->
      <template v-if="metodoSeleccionado === 'swish'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 class="text-xl font-semibold mb-4">Detalles de pago Swish</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número Swish</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="datosSwish.numero" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(datosSwish.numero)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referencia</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="datosSwish.referencia" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(datosSwish.referencia)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Detalles Transferencia Bancaria -->
      <template v-if="metodoSeleccionado === 'banco'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 class="text-xl font-semibold mb-4">Detalles de transferencia bancaria</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banco</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="cuentasBancarias.suecia.banco" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(cuentasBancarias.suecia.banco)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Número de cuenta</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="cuentasBancarias.suecia.cuenta" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(cuentasBancarias.suecia.cuenta)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SWIFT/BIC</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="cuentasBancarias.suecia.swift" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(cuentasBancarias.suecia.swift)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titular</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  :value="cuentasBancarias.suecia.titular" 
                  readonly 
                  class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                <button 
                  @click="copiarAlPortapapeles(cuentasBancarias.suecia.titular)"
                  class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Comprobante de pago -->
      <CargadorArchivo
        titulo="Comprobante de pago"
        :tiposPermitidos="['image/jpeg', 'image/png', 'application/pdf']"
        :tamanoMaximo="10 * 1024 * 1024"
        icono="fa-file-alt"
        @archivo-cargado="archivo = $event"
        @archivo-eliminado="archivo = null"
      />
    </div>

    <!-- Botón continuar -->
    <div class="w-full mt-6">
      <BotonContinuar
        :texto="'Continuar'"
        :colorInicial="'blue'"
        :deshabilitado="!metodoSeleccionado"
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