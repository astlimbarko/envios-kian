<script setup>
import { ref, watch, computed } from 'vue'
import BotonContinuar from '../../../components/BotonContinuar.vue'

const props = defineProps({
  metodo: String,
  beneficiarios: {
    type: Array,
    default: () => [
      { id: 1, nombre: 'María González', documento: '1234567' },
      { id: 2, nombre: 'Juan Pérez', documento: '7654321' }
    ]
  },
  departamentos: {
    type: Array,
    default: () => [
      'Santa Cruz', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí', 'Tarija', 'Chuquisaca', 'Beni', 'Pando'
    ]
  }
})

const emit = defineEmits(['datos'])
const tipoPersona = ref('existente')
const seleccionado = ref(null)
const datos = ref({
  nombre: '',
  documento: '',
  qr: null,
  banco: '',
  tipoCuenta: '',
  sucursal: '',
  numeroCuenta: ''
})
const qrPreview = ref(null)

const formularioValido = computed(() => {
  if (tipoPersona.value === 'existente') {
    return seleccionado.value !== null
  } else {
    const camposBasicos = datos.value.nombre && datos.value.documento
    if (props.metodo === 'qr') {
      return camposBasicos && datos.value.qr
    } else if (props.metodo === 'banco') {
      return camposBasicos && datos.value.banco && datos.value.tipoCuenta && 
             datos.value.sucursal && datos.value.numeroCuenta
    }
    return camposBasicos
  }
})

watch(() => datos.value.qr, (nuevo) => {
  if (nuevo) {
    const reader = new FileReader()
    reader.onload = e => { qrPreview.value = e.target.result }
    reader.readAsDataURL(nuevo)
  } else {
    qrPreview.value = null
  }
})

const seleccionarBeneficiario = (id) => {
  const b = props.beneficiarios.find(x => x.id === Number(id))
  if (b) {
    datos.value.nombre = b.nombre
    datos.value.documento = b.documento
    seleccionado.value = id
  }
}

const handleSubmit = () => {
  if (formularioValido.value) {
    emit('datos', {
      nombre: datos.value.nombre,
      documento: datos.value.documento,
      qr: datos.value.qr,
      banco: datos.value.banco,
      tipoCuenta: datos.value.tipoCuenta,
      sucursal: datos.value.sucursal,
      numeroCuenta: datos.value.numeroCuenta
    })

    // Asegurar que el siguiente paso se muestre en la parte superior
    setTimeout(() => {
      const siguientePaso = document.getElementById('paso-6')
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
</script>

<template>
  <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-4 mb-4 border-4 border-gray-400 dark:border-gray-500">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Datos del destinatario</h2>
      <p class="text-gray-600 dark:text-gray-300">Ingresa la información del beneficiario</p>
    </div>
    
    <!-- Selector de tipo de persona -->
    <div class="flex gap-6 mb-8 justify-center">
      <label class="flex items-center cursor-pointer group">
        <input type="radio" v-model="tipoPersona" value="existente" class="sr-only peer">
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Beneficiario existente</span>
      </label>
      <label class="flex items-center cursor-pointer group">
        <input type="radio" v-model="tipoPersona" value="nuevo" class="sr-only peer">
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Nuevo beneficiario</span>
      </label>
    </div>

    <!-- Formulario para beneficiario existente -->
    <div v-if="tipoPersona==='existente'" class="mb-8">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seleccione beneficiario</label>
      <select 
        v-model="seleccionado" 
        @change="seleccionarBeneficiario(seleccionado)" 
        class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      >
        <option value="">Seleccione un beneficiario</option>
        <option v-for="b in props.beneficiarios" :key="b.id" :value="b.id">{{ b.nombre }}</option>
      </select>
    </div>

    <!-- Formulario para nuevo beneficiario -->
    <div v-if="tipoPersona==='nuevo'" class="space-y-6 mb-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
        <input 
          v-model="datos.nombre" 
          type="text" 
          placeholder="Ingrese el nombre completo" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de documento</label>
        <input 
          v-model="datos.documento" 
          type="text" 
          placeholder="Ingrese el número de documento" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
      </div>
    </div>

    <!-- Datos específicos según método de recepción -->
    <div v-if="props.metodo==='qr'" class="space-y-6 mb-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen QR</label>
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <i class="fas fa-qrcode text-4xl text-gray-400 mb-3"></i>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">Haga clic para subir</span> o arrastre y suelte
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG o PDF (MAX. 10MB)</p>
            </div>
            <input type="file" accept="image/*" @change="e=>datos.qr=e.target.files[0]" class="hidden">
          </label>
        </div>
      </div>
      <div v-if="qrPreview" class="flex justify-center">
        <div class="relative">
          <img :src="qrPreview" class="w-40 h-40 object-contain rounded-xl border border-gray-200 dark:border-gray-700">
          <button 
            @click="datos.qr = null" 
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="props.metodo==='banco'" class="space-y-6 mb-8">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre del banco</label>
        <input 
          v-model="datos.banco" 
          type="text" 
          placeholder="Ingrese el nombre del banco" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de cuenta</label>
        <select 
          v-model="datos.tipoCuenta" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
          <option value="">Seleccione tipo de cuenta</option>
          <option value="ahorro">Cuenta de ahorro</option>
          <option value="corriente">Cuenta corriente</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sucursal</label>
        <select 
          v-model="datos.sucursal" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
          <option value="">Seleccione sucursal</option>
          <option v-for="d in props.departamentos" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de cuenta</label>
        <input 
          v-model="datos.numeroCuenta" 
          type="text" 
          placeholder="Ingrese el número de cuenta" 
          class="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
      </div>
    </div>

    <!-- Botón Continuar -->
    <div v-if="formularioValido" class="w-full mt-6">
      <BotonContinuar
        :texto="'Ir al siguiente paso'"
        :colorInicial="'blue'"
        @click="handleSubmit"
      />
    </div>
  </div>
</template> 