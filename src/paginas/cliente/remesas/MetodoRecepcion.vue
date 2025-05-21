<script setup>
import { ref, watch } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  beneficiarios: {
    type: Array,
    default: () => []
  },
  departamentos: {
    type: Array,
    default: () => [
      'Santa Cruz', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí', 
      'Tarija', 'Chuquisaca', 'Beni', 'Pando'
    ]
  }
})

const emit = defineEmits(['seleccionado'])
const metodoSeleccionado = ref(null)
const tipoCuenta = ref('existente')
const cuentaSeleccionada = ref(null)
const qrPreview = ref(null)
const nuevoQR = ref(null)
const nombreBeneficiario = ref('')
const mostrarFormularioNuevaCuenta = ref(true)
const nuevaCuenta = ref({
  banco: '',
  numeroCuenta: '',
  tipoCuenta: '',
  sucursal: '',
  guardarCuenta: false
})

const cuentasGuardadas = ref([
  {
    id: 1,
    titular: 'Juan Perez',
    banco: 'Banco Mercantil Santa Cruz',
    numeroCuenta: '1234567890',
    tipoCuenta: 'ahorro',
    sucursal: 'Santa Cruz'
  },
  {
    id: 2,
    titular: 'Maria Lopez',
    banco: 'Banco Bisa',
    numeroCuenta: '0987654321',
    tipoCuenta: 'corriente',
    sucursal: 'La Paz'
  }
])

const ultimoQR = ref(null)
const botonUsado = ref(false)

const subirQR = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 10MB.')
      return
    }

    const validTypes = ['image/jpeg', 'image/png']
    if (!validTypes.includes(file.type)) {
      alert('Tipo de archivo no válido. Por favor, sube una imagen PNG o JPG.')
      return
    }

    nuevoQR.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      qrPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const eliminarQR = () => {
  nuevoQR.value = null
  qrPreview.value = null
}

const seleccionarMetodo = (metodo) => {
  metodoSeleccionado.value = metodo
  setTimeout(() => {
    const seccion = document.getElementById(metodo === 'qr' ? 'seccion-qr' : 'seccion-cuenta')
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const guardarNuevaCuenta = () => {
  mostrarFormularioNuevaCuenta.value = false
  setTimeout(() => {
    const detallesCuenta = document.querySelector('.p-4.bg-white')
    if (detallesCuenta) {
      detallesCuenta.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const editarNuevaCuenta = () => {
  mostrarFormularioNuevaCuenta.value = true
  setTimeout(() => {
    const formulario = document.getElementById('formulario-nueva-cuenta')
    if (formulario) {
      formulario.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

const continuar = () => {
  if (metodoSeleccionado.value === 'qr') {
    emit('seleccionado', {
      metodo: 'qr',
      qr: nuevoQR.value,
      nombreBeneficiario: nombreBeneficiario.value
    })
  } else if (metodoSeleccionado.value === 'cuenta') {
    if (tipoCuenta.value === 'existente' && cuentaSeleccionada.value) {
      emit('seleccionado', {
        metodo: 'banco',
        cuenta: {
          titular: cuentaSeleccionada.value.titular,
          banco: cuentaSeleccionada.value.banco,
          numeroCuenta: cuentaSeleccionada.value.numeroCuenta,
          tipoCuenta: cuentaSeleccionada.value.tipoCuenta,
          sucursal: cuentaSeleccionada.value.sucursal
        }
      })
    } else if (tipoCuenta.value === 'nueva' && nuevaCuenta.value) {
      emit('seleccionado', {
        metodo: 'banco',
        cuenta: {
          titular: nuevaCuenta.value.titular,
          banco: nuevaCuenta.value.banco,
          numeroCuenta: nuevaCuenta.value.numeroCuenta,
          tipoCuenta: nuevaCuenta.value.tipoCuenta,
          sucursal: nuevaCuenta.value.sucursal
        }
      })
    }
  }

  // Scroll al siguiente paso
  setTimeout(() => {
    const siguientePaso = document.querySelector('.metodo-pago-titulo')
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

// Observar cambios en cuentaSeleccionada
watch(cuentaSeleccionada, (nuevaCuenta) => {
  if (nuevaCuenta) {
    setTimeout(() => {
      const seccion = document.getElementById('seccion-cuenta-existente')
      if (seccion) {
        seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
})

// Observar cambios en tipoCuenta
watch(tipoCuenta, (nuevoTipo) => {
  setTimeout(() => {
    const seccion = document.getElementById(nuevoTipo === 'existente' ? 'seccion-cuenta-existente' : 'formulario-nueva-cuenta')
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
})
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Método de recepción</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Selecciona cómo deseas que el beneficiario reciba el dinero</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <!-- Opción QR -->
      <button 
        @click="seleccionarMetodo('qr')"
        class="p-6 rounded-xl border-2 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
        :class="[
          metodoSeleccionado === 'qr' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-400 dark:border-gray-500 hover:border-blue-300'
        ]"
      >
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v4m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Código QR</h3>
          <p class="text-base text-gray-600 dark:text-gray-400 text-center">
            Entregas un código QR de depósito
          </p>
        </div>
      </button>

      <!-- Opción Cuenta Bancaria -->
      <button 
        @click="seleccionarMetodo('cuenta')"
        class="p-6 rounded-xl border-2 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
        :class="[
          metodoSeleccionado === 'cuenta' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-400 dark:border-gray-500 hover:border-blue-300'
        ]"
      >
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">Cuenta Bancaria</h3>
          <p class="text-base text-gray-600 dark:text-gray-400 text-center">
            Entregas el número de cuenta bancaria
          </p>
        </div>
      </button>
    </div>

    <!-- Sección QR -->
    <div v-if="metodoSeleccionado === 'qr'" id="seccion-qr" class="mb-6">
      <!-- Campo para el nombre del beneficiario -->
      <div class="mb-6">
        <label for="nombreBeneficiario" class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre completo del beneficiario
        </label>
        <input
          type="text"
          id="nombreBeneficiario"
          v-model="nombreBeneficiario"
          class="w-full px-4 py-2.5 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Ingrese el nombre completo del beneficiario"
          required
        />
      </div>

      <div v-if="ultimoQR" class="mb-4">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Último código QR registrado</h3>
        <div class="flex justify-center">
          <img :src="ultimoQR" alt="Último QR" class="w-40 h-40 object-contain rounded-xl border border-gray-300 dark:border-gray-600">
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">Subir nuevo código QR</label>
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
            <div class="flex flex-col items-center justify-center pt-4 pb-4">
              <i class="fas fa-qrcode text-4xl text-gray-400 mb-2"></i>
              <p class="mb-1 text-base text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Haga clic para subir</span> o arrastre y suelte
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">PNG o JPG (MAX. 10MB)</p>
            </div>
            <input type="file" accept="image/*" @change="subirQR" class="hidden">
          </label>
        </div>
      </div>

      <div v-if="qrPreview" class="flex justify-center mb-4">
        <div class="relative">
          <img :src="qrPreview" class="w-40 h-40 object-contain rounded-xl border border-gray-300 dark:border-gray-600">
          <button 
            @click="eliminarQR" 
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Sección Cuenta Bancaria -->
    <div v-if="metodoSeleccionado === 'cuenta'" id="seccion-cuenta" class="mb-6">
      <div class="flex gap-6 mb-4 justify-center">
        <label class="flex items-center cursor-pointer group">
          <input type="radio" v-model="tipoCuenta" value="existente" class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500">
          <span class="ml-3 text-lg text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Cuenta existente</span>
        </label>
        <label class="flex items-center cursor-pointer group">
          <input type="radio" v-model="tipoCuenta" value="nueva" class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500">
          <span class="ml-3 text-lg text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Nueva cuenta</span>
        </label>
      </div>

      <!-- Cuenta existente -->
      <div v-if="tipoCuenta === 'existente'" id="seccion-cuenta-existente" class="mb-4">
        <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccione cuenta:</label>
        <select 
          v-model="cuentaSeleccionada" 
          class="w-full p-3 text-lg rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
          <option value="">Seleccione una cuenta</option>
          <option v-for="cuenta in cuentasGuardadas" :key="cuenta.id" :value="cuenta">
            {{ cuenta.titular }} - {{ cuenta.banco }}
          </option>
        </select>

        <div v-if="cuentaSeleccionada" class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h4 class="text-xl font-semibold mb-3">Detalles de la cuenta</h4>
          <div class="space-y-2">
            <p class="text-lg"><span class="font-semibold">Titular:</span> {{ cuentaSeleccionada.titular }}</p>
            <p class="text-lg"><span class="font-semibold">Banco:</span> {{ cuentaSeleccionada.banco }}</p>
            <p class="text-lg"><span class="font-semibold">Número de cuenta:</span> {{ cuentaSeleccionada.numeroCuenta }}</p>
            <p class="text-lg"><span class="font-semibold">Tipo de cuenta:</span> {{ cuentaSeleccionada.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</p>
            <p class="text-lg"><span class="font-semibold">Sucursal:</span> {{ cuentaSeleccionada.sucursal }}</p>
          </div>
        </div>
      </div>

      <!-- Nueva cuenta -->
      <div v-if="tipoCuenta === 'nueva'">
        <div v-if="mostrarFormularioNuevaCuenta" id="formulario-nueva-cuenta" class="space-y-3">
          <div>
            <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre del banco</label>
            <input 
              v-model="nuevaCuenta.banco" 
              type="text" 
              placeholder="Ingrese el nombre del banco" 
              class="w-full p-2.5 text-lg rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1.5">Número de cuenta</label>
            <input 
              v-model="nuevaCuenta.numeroCuenta" 
              type="text" 
              placeholder="Ingrese el número de cuenta" 
              class="w-full p-2.5 text-lg rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de cuenta</label>
            <select 
              v-model="nuevaCuenta.tipoCuenta" 
              class="w-full p-2.5 text-lg rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">Seleccione tipo de cuenta</option>
              <option value="ahorro">Caja de ahorro</option>
              <option value="corriente">Cuenta corriente</option>
            </select>
          </div>
          <div>
            <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sucursal</label>
            <select 
              v-model="nuevaCuenta.sucursal" 
              class="w-full p-2.5 text-lg rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">Seleccione sucursal</option>
              <option v-for="dep in departamentos" :key="dep" :value="dep">{{ dep }}</option>
            </select>
          </div>
          <div class="flex items-center mt-4">
            <input 
              type="checkbox" 
              v-model="nuevaCuenta.guardarCuenta"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            >
            <label class="ml-2 text-lg text-gray-700 dark:text-gray-300">
              Guardar esta cuenta en mi lista de beneficiarios
            </label>
          </div>
          <div class="flex justify-center mt-3">
            <button 
              @click="guardarNuevaCuenta"
              class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Guardar cuenta
            </button>
          </div>
        </div>

        <div v-else class="mb-4">
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h4 class="text-xl font-semibold mb-3">Detalles de la nueva cuenta</h4>
            <div class="space-y-2">
              <p class="text-lg"><span class="font-semibold">Banco:</span> {{ nuevaCuenta.banco }}</p>
              <p class="text-lg"><span class="font-semibold">Número de cuenta:</span> {{ nuevaCuenta.numeroCuenta }}</p>
              <p class="text-lg"><span class="font-semibold">Tipo de cuenta:</span> {{ nuevaCuenta.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</p>
              <p class="text-lg"><span class="font-semibold">Sucursal:</span> {{ nuevaCuenta.sucursal }}</p>
              <p v-if="nuevaCuenta.guardarCuenta" class="text-lg text-blue-600 dark:text-blue-400">
                <i class="fas fa-check-circle mr-2"></i>Esta cuenta será guardada en tu lista de beneficiarios
              </p>
            </div>
          </div>

          <div class="flex justify-center gap-3 mt-4">
            <button 
              @click="editarNuevaCuenta"
              class="px-6 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors text-lg font-semibold"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Continuar unificado -->
    <div class="w-full mt-6">
      <BotonContinuar
        :texto="'Ir al siguiente paso'"
        :colorInicial="'blue'"
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