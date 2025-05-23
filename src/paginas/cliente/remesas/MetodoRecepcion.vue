/**
 * Componente MetodoRecepcion.vue
 * 
 * Este componente maneja la selección del método de recepción.
 * Utiliza el store centralizado para manejar el estado.
 */

<script setup>
import { ref, watch, computed } from 'vue'
import { useRemesaStore } from '../../../store/remesa'
import BotonContinuar from '../../../components/BotonContinuar.vue'
import entidadesFinancieras from '../../../assets/entidades_financieras_bolivia.json'
import clientes from '../../../assets/clientes.json'

const store = useRemesaStore()

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

const emit = defineEmits(['seleccionado', 'siguiente-paso'])
const metodoSeleccionado = ref(null)
const tipoCuenta = ref('existente')
const cuentaSeleccionada = ref('')
const qrPreview = ref(null)
const nuevoQR = ref(null)
const nombreBeneficiario = ref('')
const mostrarFormularioNuevaCuenta = ref(true)
const nuevaCuenta = ref({
  titular: '',
  carnetIdentidad: '',
  complemento: '',
  banco: '',
  numeroCuenta: '',
  tipoCuenta: '',
  sucursal: '',
  guardarCuenta: false
})

const cuentasGuardadas = ref(clientes)

const ultimoQR = ref(null)
const botonUsado = ref(false)

const errores = ref({
  titular: '',
  ci: '',
  banco: '',
  numeroCuenta: '',
  tipoCuenta: '',
  sucursal: ''
})

const beneficiarioSeleccionado = ref('')
const mostrarNuevoBeneficiario = ref(false)

const qrSeleccionado = ref('existente') // 'existente' o 'nuevo'
const qrExistente = ref(null)
const qrNuevo = ref(null)

// Computed para filtrar beneficiarios con QR
const beneficiariosQR = computed(() => {
  return clientes.filter(cliente => cliente.viaPago === 'QR')
})

// Función para cargar el QR existente
const cargarQRExistente = async (idCliente) => {
  try {
    const response = await import(`../../../assets/clientes/${idCliente}/qr.png`)
    qrExistente.value = response.default
  } catch (error) {
    console.error('Error al cargar el QR:', error)
    qrExistente.value = null
  }
}

const scrollToTitulo = () => {
  setTimeout(() => {
    const titulo = document.querySelector('.metodo-recepcion-titulo')
    if (titulo) {
      const headerOffset = 80
      const elementPosition = titulo.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 100)
}

// Observar cambios en el beneficiario seleccionado
watch(beneficiarioSeleccionado, (nuevoValor) => {
  if (nuevoValor) {
    store.resetearPasosSiguientes(2)
    scrollToTitulo()
    if (nuevoValor && nuevoValor !== 'nuevo') {
      const beneficiario = beneficiariosQR.value.find(b => b.titular === nuevoValor)
      if (beneficiario) {
        cargarQRExistente(beneficiario.id)
      }
    } else {
      qrExistente.value = null
    }
    qrSeleccionado.value = 'existente'
  }
})

const validarFormulario = () => {
  let esValido = true
  errores.value = {
    titular: '',
    ci: '',
    banco: '',
    numeroCuenta: '',
    tipoCuenta: '',
    sucursal: ''
  }

  if (!nuevaCuenta.value.titular.trim()) {
    errores.value.titular = 'El nombre del titular es requerido'
    esValido = false
  }

  if (!nuevaCuenta.value.carnetIdentidad.trim()) {
    errores.value.ci = 'El C.I. es requerido'
    esValido = false
  } else if (!/^\d+$/.test(nuevaCuenta.value.carnetIdentidad)) {
    errores.value.ci = 'El C.I. debe contener solo números'
    esValido = false
  }

  if (!nuevaCuenta.value.banco) {
    errores.value.banco = 'Debe seleccionar una entidad financiera'
    esValido = false
  }

  if (!nuevaCuenta.value.numeroCuenta.trim()) {
    errores.value.numeroCuenta = 'El número de cuenta es requerido'
    esValido = false
  }

  if (!nuevaCuenta.value.tipoCuenta) {
    errores.value.tipoCuenta = 'Debe seleccionar un tipo de cuenta'
    esValido = false
  }

  if (!nuevaCuenta.value.sucursal) {
    errores.value.sucursal = 'Debe seleccionar una sucursal'
    esValido = false
  }

  return esValido
}

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

const confirmarQR = () => {
  if (qrSeleccionado.value === 'nuevo' && !qrPreview.value) {
    alert('Por favor, sube un código QR antes de continuar')
    return
  }
  // Aquí puedes agregar la lógica para guardar el QR si es necesario
  qrSeleccionado.value = 'confirmado'
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
  if (validarFormulario()) {
    mostrarFormularioNuevaCuenta.value = false
    setTimeout(() => {
      const detallesCuenta = document.querySelector('.p-4.bg-white')
      if (detallesCuenta) {
        detallesCuenta.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
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
  console.log('MetodoRecepcion: Iniciando función continuar')
  console.log('MetodoRecepcion: Estado actual:', {
    metodoSeleccionado: metodoSeleccionado.value,
    tipoCuenta: tipoCuenta.value,
    cuentaSeleccionada: cuentaSeleccionada.value,
    nuevaCuenta: nuevaCuenta.value,
    beneficiarioSeleccionado: beneficiarioSeleccionado.value,
    nombreBeneficiario: nombreBeneficiario.value
  })

  try {
    // Validar que se haya seleccionado un método
    if (!metodoSeleccionado.value) {
      console.log('MetodoRecepcion: No se ha seleccionado un método')
      return
    }

    let datosRecepcion = {
      tipo: metodoSeleccionado.value
    }

    // Validar según el método seleccionado
    if (metodoSeleccionado.value === 'qr') {
      // Si es un beneficiario existente
      if (beneficiarioSeleccionado.value && beneficiarioSeleccionado.value !== 'nuevo') {
        const beneficiario = beneficiariosQR.value.find(b => b.titular === beneficiarioSeleccionado.value)
        if (beneficiario) {
          datosRecepcion.nombreBeneficiario = beneficiario.titular
          datosRecepcion.qr = qrExistente.value
        }
      } 
      // Si es un nuevo beneficiario
      else if (mostrarNuevoBeneficiario.value) {
        if (!nombreBeneficiario.value) {
          console.log('MetodoRecepcion: Nombre del beneficiario requerido')
          return
        }
        datosRecepcion.nombreBeneficiario = nombreBeneficiario.value
        datosRecepcion.qr = qrPreview.value
      }
    } 
    // Si es cuenta bancaria
    else if (metodoSeleccionado.value === 'cuenta') {
      if (tipoCuenta.value === 'existente') {
        if (!cuentaSeleccionada.value) {
          console.log('MetodoRecepcion: Debe seleccionar una cuenta')
          return
        }
        datosRecepcion.cuenta = cuentaSeleccionada.value
      } else {
        if (!validarFormulario()) {
          console.log('MetodoRecepcion: Debe completar los datos de la nueva cuenta')
          return
        }
        datosRecepcion.cuenta = nuevaCuenta.value
      }
    }

    // Actualizar el store con los datos de recepción
    store.actualizarRecepcion(datosRecepcion)
    console.log('MetodoRecepcion: Store actualizado exitosamente')

    // Avanzar al siguiente paso
    store.setPasoActual(3)
    console.log('MetodoRecepcion: Paso actual actualizado a 3')

    // Emitir evento para mostrar el siguiente paso
    emit('siguiente-paso', 3)
    console.log('MetodoRecepcion: Evento siguiente-paso emitido con paso 3')

    // Scroll al siguiente paso
    setTimeout(() => {
      console.log('MetodoRecepcion: Iniciando scroll')
      const siguientePaso = document.querySelector('.paso-3')
      if (siguientePaso) {
        console.log('MetodoRecepcion: Elemento siguiente paso encontrado')
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
        console.log('MetodoRecepcion: No se encontró el elemento siguiente paso')
      }
    }, 100)
  } catch (error) {
    console.error('MetodoRecepcion: Error en la función continuar:', error)
  }
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

// Observar cambios en el método seleccionado
watch(metodoSeleccionado, (nuevoValor) => {
  if (nuevoValor) {
    store.resetearPasosSiguientes(2)
  }
})

// Observar cambios en el nombre del beneficiario
watch(nombreBeneficiario, (nuevoValor) => {
  if (nuevoValor) {
    store.resetearPasosSiguientes(2)
  }
})

// Observar cambios en la nueva cuenta
watch(nuevaCuenta, (nuevoValor) => {
  if (nuevoValor && Object.values(nuevoValor).some(valor => valor)) {
    store.resetearPasosSiguientes(2)
  }
}, { deep: true })
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 metodo-recepcion-titulo">Método de recepción</h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">Selecciona cómo deseas que el beneficiario reciba el dinero</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      <!-- Opción QR -->
      <button 
        @click="seleccionarMetodo('qr')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          metodoSeleccionado === 'qr' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-qrcode text-xl" :class="metodoSeleccionado === 'qr' ? 'text-blue-500' : 'text-gray-400'"></i>
          <span class="text-base font-medium" :class="metodoSeleccionado === 'qr' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
            Código QR
          </span>
        </div>
      </button>

      <!-- Opción Cuenta Bancaria -->
      <button 
        @click="seleccionarMetodo('cuenta')"
        class="p-3 rounded-xl border-2 transition-all duration-300"
        :class="[
          metodoSeleccionado === 'cuenta' 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
        ]"
      >
        <div class="flex items-center space-x-2">
          <i class="fas fa-university text-xl" :class="metodoSeleccionado === 'cuenta' ? 'text-blue-500' : 'text-gray-400'"></i>
          <span class="text-base font-medium" :class="metodoSeleccionado === 'cuenta' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'">
            Cuenta bancaria
          </span>
        </div>
      </button>
    </div>

    <!-- Sección QR -->
    <div v-if="metodoSeleccionado === 'qr'" id="seccion-qr" class="mb-6">
      <!-- Campo para el nombre del beneficiario -->
      <div class="mb-6">
        <select 
          v-model="beneficiarioSeleccionado"
          class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
          @change="mostrarNuevoBeneficiario = beneficiarioSeleccionado === 'nuevo'"
        >
          <option value="" disabled>Seleccione un beneficiario</option>
          <option value="nuevo">+ Añadir Nuevo Beneficiario</option>
          <option 
            v-for="beneficiario in beneficiariosQR" 
            :key="beneficiario.id" 
            :value="beneficiario.titular"
          >
            {{ beneficiario.titular }}
          </option>
        </select>

        <!-- Campo para nuevo beneficiario -->
        <div v-if="mostrarNuevoBeneficiario" class="mt-4">
          <input
            type="text"
            v-model="nombreBeneficiario"
            class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
            placeholder="Nombre completo del beneficiario"
            required
          />
        </div>
      </div>

      <!-- Sección de QR -->
      <div v-if="beneficiarioSeleccionado" class="mt-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- QR Existente -->
          <div class="flex-1">
            <div class="flex items-center mb-3">
              <input 
                type="radio" 
                id="qrExistente" 
                v-model="qrSeleccionado" 
                value="existente"
                class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              >
              <label for="qrExistente" class="ml-2 text-lg text-gray-700 dark:text-gray-300">
                Usar QR existente
              </label>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-2 border-blue-500">
              <div v-if="qrExistente" class="flex justify-center">
                <img :src="qrExistente" alt="QR Existente" class="w-40 h-40 object-contain">
              </div>
              <div v-else class="flex justify-center items-center h-40 text-gray-500">
                <p>No hay QR disponible</p>
              </div>
            </div>
          </div>

          <!-- QR Nuevo -->
          <div class="flex-1">
            <div class="flex items-center mb-3">
              <input 
                type="radio" 
                id="qrNuevo" 
                v-model="qrSeleccionado" 
                value="nuevo"
                class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              >
              <label for="qrNuevo" class="ml-2 text-lg text-gray-700 dark:text-gray-300">
                Cargar nuevo QR
              </label>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-2 border-blue-500">
              <div v-if="qrPreview" class="flex flex-col items-center">
                <img :src="qrPreview" alt="QR Nuevo" class="w-40 h-40 object-contain mb-4">
                <button 
                  @click="eliminarQR" 
                  class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <i class="fas fa-times mr-2"></i>Eliminar
                </button>
              </div>
              <div v-else class="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <label class="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <i class="fas fa-qrcode text-4xl text-gray-400 mb-2"></i>
                  <p class="text-base text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Haga clic para cargar</span> o arrastre y suelte
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">PNG o JPG (MAX. 10MB)</p>
                  <input type="file" accept="image/*" @change="subirQR" class="hidden">
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón Subir -->
        <div class="flex justify-center mt-6">
          <button 
            @click="confirmarQR"
            class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center"
            :disabled="qrSeleccionado === 'nuevo' && !qrPreview"
          >
            <i class="fas fa-upload mr-2"></i>
            Cargar QR
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
        <!-- <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccione cuenta:</label> -->
        <select 
          v-model="cuentaSeleccionada" 
          class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
        >
          <option value="" disabled>Seleccione una cuenta</option>
          <option v-for="cuenta in cuentasGuardadas" :key="cuenta.id" :value="cuenta">
            {{ cuenta.titular }} - {{ cuenta.banco }} - {{ cuenta.numeroCuenta }}
          </option>
        </select>

        <div v-if="cuentaSeleccionada" class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h4 class="text-xl font-semibold mb-3">Detalles de la cuenta</h4>
          <div class="space-y-2">
            <p class="text-lg"><span class="font-semibold">Titular:</span> {{ cuentaSeleccionada.titular }}</p>
            <p class="text-lg"><span class="font-semibold">C.I.:</span> {{ cuentaSeleccionada.carnetIdentidad }}{{ cuentaSeleccionada.complemento ? ' - ' + cuentaSeleccionada.complemento : '' }}</p>
            <p class="text-lg"><span class="font-semibold">Entidad Financiera:</span> {{ cuentaSeleccionada.banco }}</p>
            <p class="text-lg"><span class="font-semibold">Número de cuenta:</span> {{ cuentaSeleccionada.numeroCuenta }}</p>
            <p class="text-lg"><span class="font-semibold">Tipo de cuenta:</span> {{ cuentaSeleccionada.tipoCuenta === 'ahorro' ? 'Caja de ahorro' : 'Cuenta corriente' }}</p>
            <p class="text-lg"><span class="font-semibold">Sucursal:</span> {{ cuentaSeleccionada.sucursal }}</p>
          </div>
        </div>
      </div>

      <!-- Nueva cuenta -->
      <div v-if="tipoCuenta === 'nueva'">
        <div v-if="mostrarFormularioNuevaCuenta" id="formulario-nueva-cuenta" class="space-y-4">
          <!-- Primera línea: Titular y C.I. -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input 
                v-model="nuevaCuenta.titular" 
                type="text" 
                placeholder="Nombre Completo del titular de la cuenta" 
                class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
                :class="{'border-red-500': errores.titular}"
              >
              <p v-if="errores.titular" class="text-red-500 text-sm mt-1">{{ errores.titular }}</p>
            </div>
            <div class="flex gap-2">
              <div class="flex-1">
                <input 
                  v-model="nuevaCuenta.carnetIdentidad" 
                  type="text" 
                  placeholder="C.I." 
                  class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
                  :class="{'border-red-500': errores.ci}"
                >
                <p v-if="errores.ci" class="text-red-500 text-sm mt-1">{{ errores.ci }}</p>
              </div>
              <div class="w-20">
                <input 
                  v-model="nuevaCuenta.complemento" 
                  type="text" 
                  placeholder="Comp." 
                  class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
                >
              </div>
            </div>
          </div>

          <!-- Entidad Financiera -->
          <div>
            <select 
              v-model="nuevaCuenta.banco" 
              class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
              style="max-height: 200px; overflow-y: auto;"
              :class="{'border-red-500': errores.banco}"
            >
              <option value="" disabled>Seleccione la entidad financiera</option>
              <option 
                v-for="entidad in entidadesFinancieras" 
                :key="entidad.nombre" 
                :value="entidad.nombre"
              >
                {{ entidad.nombre }}
              </option>
            </select>
            <p v-if="errores.banco" class="text-red-500 text-sm mt-1">{{ errores.banco }}</p>
          </div>

          <!-- Número de cuenta -->
          <div>
            <input 
              v-model="nuevaCuenta.numeroCuenta" 
              type="text" 
              placeholder="Número de cuenta" 
              class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
              :class="{'border-red-500': errores.numeroCuenta}"
            >
            <p v-if="errores.numeroCuenta" class="text-red-500 text-sm mt-1">{{ errores.numeroCuenta }}</p>
          </div>

          <!-- Segunda línea: Tipo de cuenta y Sucursal -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <select 
                v-model="nuevaCuenta.tipoCuenta" 
                class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
                :class="{'border-red-500': errores.tipoCuenta}"
              >
                <option value="" disabled>Tipo de cuenta</option>
                <option value="ahorro">Caja de ahorro</option>
                <option value="corriente">Cuenta corriente</option>
              </select>
              <p v-if="errores.tipoCuenta" class="text-red-500 text-sm mt-1">{{ errores.tipoCuenta }}</p>
            </div>
            <div class="flex-1">
              <select 
                v-model="nuevaCuenta.sucursal" 
                class="w-full p-2 text-lg rounded-xl border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
                :class="{'border-red-500': errores.sucursal}"
              >
                <option value="" disabled>Seleccione sucursal</option>
                <option v-for="dep in departamentos" :key="dep" :value="dep">{{ dep }}</option>
              </select>
              <p v-if="errores.sucursal" class="text-red-500 text-sm mt-1">{{ errores.sucursal }}</p>
            </div>
          </div>

          <!-- Checkbox para guardar cuenta -->
          <label class="flex items-center mt-4 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="nuevaCuenta.guardarCuenta"
              class="w-5 h-5 rounded-md border-2 border-blue-500 dark:border-blue-400 bg-white dark:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md transition-all duration-200"
            >
            <span class="ml-2 text-lg text-gray-700 dark:text-gray-300">
              Guardar esta cuenta en mi lista de beneficiarios
            </span>
          </label>

          <!-- Botón confirmar -->
          <div class="flex justify-center mt-3">
            <button 
              @click="guardarNuevaCuenta"
              class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Confirmar cuenta
            </button>
          </div>
        </div>

        <div v-else class="mb-4">
          <div class="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h4 class="text-xl font-semibold mb-3">Detalles de la nueva cuenta</h4>
            <div class="space-y-2">
              <p class="text-lg"><span class="font-semibold">Titular:</span> {{ nuevaCuenta.titular }}</p>
              <p class="text-lg"><span class="font-semibold">C.I.:</span> {{ nuevaCuenta.carnetIdentidad }}{{ nuevaCuenta.complemento ? ' - ' + nuevaCuenta.complemento : '' }}</p>
              <p class="text-lg"><span class="font-semibold">Entidad Financiera:</span> {{ nuevaCuenta.banco }}</p>
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