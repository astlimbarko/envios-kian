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

const flagSuecia = '/flags/flag_sve.svg'
const flagEstonia = '/flags/flag_est.svg'

const seleccionarMetodo = (metodo) => {
  seleccionado.value = metodo
  // Scroll al título del paso actual
  setTimeout(() => {
    const tituloPaso = document.querySelector('.metodo-pago-titulo')
    if (tituloPaso) {
      const headerOffset = 80
      const elementPosition = tituloPaso.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      tituloPaso.classList.add('paso-activo')
      setTimeout(() => {
        tituloPaso.classList.remove('paso-activo')
      }, 2000)
    }
  }, 100)
}

const emit = defineEmits(['seleccionado', 'siguiente-paso'])

const continuar = () => {
  console.log('MetodoPagoSuecia: Iniciando función continuar')
  console.log('MetodoPagoSuecia: Estado actual:', {
    seleccionado: seleccionado.value
  })

  try {
    if (!seleccionado.value) {
      console.log('MetodoPagoSuecia: Método no seleccionado')
      return
    }

    if (seleccionado.value === 'swish') {
      store.actualizarPago({
        tipo: 'swish',
        numero: datosSwish.numero,
        referencia: datosSwish.referencia
      })
    } else if (seleccionado.value === 'banco') {
      store.actualizarPago({
        tipo: 'banco',
        banco: cuentasBancarias.suecia.banco,
        cuenta: cuentasBancarias.suecia.cuenta,
        swift: cuentasBancarias.suecia.swift,
        titular: cuentasBancarias.suecia.titular
      })
    }

    console.log('MetodoPagoSuecia: Store actualizado exitosamente')

    // Avanzar al siguiente paso
    store.setPasoActual(4)
    console.log('MetodoPagoSuecia: Paso actual actualizado a 4')

    // Emitir evento para mostrar el siguiente paso
    emit('siguiente-paso', 4)
    console.log('MetodoPagoSuecia: Evento siguiente-paso emitido con paso 4')

    // Scroll al siguiente paso
    setTimeout(() => {
      console.log('MetodoPagoSuecia: Iniciando scroll')
      const siguientePaso = document.querySelector('.resumen-titulo')
      if (siguientePaso) {
        console.log('MetodoPagoSuecia: Elemento siguiente paso encontrado')
        const headerOffset = 120
        const elementPosition = siguientePaso.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20

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
  } catch (error) {
    console.error('MetodoPagoSuecia: Error en la función continuar:', error)
  }
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

// Observar cambios en el método seleccionado
watch(seleccionado, (nuevoValor) => {
  if (nuevoValor) {
    store.resetearPasosSiguientes(3)
  }
})
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 metodo-pago-titulo">Método de pago</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Selecciona cómo deseas realizar el pago</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      <button 
        @click="seleccionarMetodo('swish')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          seleccionado === 'swish'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-white' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-mobile-alt text-xl" :class="seleccionado === 'swish' ? 'text-blue-500 dark:text-white' : 'text-gray-400 dark:text-gray-500'"></i>
          <span class="text-base font-medium">Swish</span>
        </div>
      </button>

      <button 
        @click="seleccionarMetodo('banco')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          seleccionado === 'banco'
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-white' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-university text-xl" :class="seleccionado === 'banco' ? 'text-blue-500 dark:text-white' : 'text-gray-400 dark:text-gray-500'"></i>
          <span class="text-base font-medium">Transferencia bancaria</span>
        </div>
      </button>
    </div>

    <!-- Detalles del método seleccionado -->
    <div v-if="seleccionado" class="mt-6">
      <!-- Detalles Transferencia Bancaria -->
      <template v-if="seleccionado === 'banco'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 class="text-xl font-semibold mb-4">Detalles de transferencia bancaria</h3>
          
          <!-- Cuentas en grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cuenta Suecia -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2 mb-4">
                <img :src="flagSuecia" alt="Bandera Suecia" class="w-8 h-8 rounded-full shadow-md">
                <h4 class="text-lg font-medium">Suecia</h4>
              </div>
              
              <div class="space-y-3">
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

            <!-- Cuenta Estonia -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2 mb-4">
                <img :src="flagEstonia" alt="Bandera Estonia" class="w-8 h-8 rounded-full shadow-md">
                <h4 class="text-lg font-medium">Estonia</h4>
              </div>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banco</label>
                  <div class="flex items-center space-x-2">
                    <input 
                      type="text" 
                      :value="cuentasBancarias.estonia.banco" 
                      readonly 
                      class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                    <button 
                      @click="copiarAlPortapapeles(cuentasBancarias.estonia.banco)"
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
                      :value="cuentasBancarias.estonia.cuenta" 
                      readonly 
                      class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                    <button 
                      @click="copiarAlPortapapeles(cuentasBancarias.estonia.cuenta)"
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
                      :value="cuentasBancarias.estonia.swift" 
                      readonly 
                      class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                    <button 
                      @click="copiarAlPortapapeles(cuentasBancarias.estonia.swift)"
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
                      :value="cuentasBancarias.estonia.titular" 
                      readonly 
                      class="flex-1 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                    <button 
                      @click="copiarAlPortapapeles(cuentasBancarias.estonia.titular)"
                      class="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Detalles Swish -->
      <template v-if="seleccionado === 'swish'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 class="text-xl font-semibold mb-4">Detalles de pago Swish</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        :deshabilitado="!seleccionado"
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