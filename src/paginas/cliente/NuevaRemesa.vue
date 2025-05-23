<script setup>
import { ref, computed } from 'vue'
import BotonGradiente from '../../components/BotonGradiente.vue'
import FormularioEnvio from './remesas/FormularioEnvio.vue'
import MetodoPagoSuecia from './remesas/MetodoPagoSuecia.vue'
import ResumenRemesa from './remesas/ResumenRemesa.vue'
import MetodoRecepcion from './remesas/MetodoRecepcion.vue'
import { useRemesaStore } from '../../store/remesa'

// Estados para las remesas
const remesas = ref([
  {
    id: '12345',
    date: '21/04/2023',
    recipient: 'María González',
    location: 'Santa Cruz, Bolivia',
    amount: 850.00,
    currency: 'SEK',
    receivedAmount: 5865.00,
    receivedCurrency: 'BOB',
    status: 'En Progreso',
    statusClass: 'yellow',
    paymentMethod: 'Pendiente',
    receiveMethod: 'Pendiente',
    trackingCode: 'REF-1234-5678-90'
  }
])

// Estados para notificaciones y modales
const showSuccessNotification = ref(false)
const showRemittanceModal = ref(false)

// Métodos de pago para Suecia
const metodosPagoSuecia = ref([
  { nombre: 'Swish', valor: 'swish', icono: 'fas fa-mobile-alt' },
  { nombre: 'Transferencia Bancaria', valor: 'banco', icono: 'fas fa-university' }
])

// Datos para los tipos de cambio
const cambioEstandar = ref(1.08)
const cambioEspecial = ref(1.09)
const fechaActualizacion = ref(new Date().toLocaleDateString('es-ES', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric' 
}))

// Estados para el formulario
const currentStep = ref(1)
const datosRemesa = ref({
  montoEnviar: '',
  montoRecibir: '',
  tipoCambio: 0,
  pais: null,
  metodoRecepcion: null,
  metodoPago: null,
  destinatario: null,
  comprobante: null,
  qrCode: null,
  nombreBeneficiario: null,
  cuenta: null
})

// Lista de países (por ahora solo Bolivia)
const paises = ref([
  {
    nombre: 'Bolivia',
    codigo: 'BO',
    moneda: 'BOB',
    bandera: '/flag_bo.svg'
  }
])

// Lista de beneficiarios
const beneficiarios = ref([
  {
    id: 1,
    nombre: 'María González',
    documento: '12345678',
    telefono: '591-76543210',
    departamento: 'Santa Cruz'
  }
])

// Lista de departamentos
const departamentos = ref([
  'Santa Cruz',
  'La Paz',
  'Cochabamba',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando'
])

// Cálculo del tipo de cambio a usar
const tipoCambio = computed(() => {
  if (cambioEstandar.value === cambioEspecial.value) return cambioEstandar.value
  if (Number(datosRemesa.value.montoRecibir) >= 5000) return cambioEspecial.value
  return cambioEstandar.value
})

// Actualización automática de montos
const actualizarMontos = (valor, campo) => {
  if (campo === 'enviar' && valor) {
    datosRemesa.value.montoRecibir = (parseFloat(valor) * tipoCambio.value).toFixed(2)
  } else if (campo === 'recibir' && valor) {
    datosRemesa.value.montoEnviar = (parseFloat(valor) / tipoCambio.value).toFixed(2)
  }
}

// Función para avanzar al siguiente paso
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

// Función para retroceder al paso anterior
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Función para manejar los datos del formulario
const handleFormularioDatos = (datos) => {
  console.log('MisRemesas: Recibidos datos del formulario:', datos)
  try {
    datosRemesa.value = {
      ...datosRemesa.value,
      ...datos
    }
    currentStep.value = 2
    console.log('MisRemesas: Datos actualizados y paso cambiado a 2')
    centrarPaso(2)
  } catch (error) {
    console.error('MisRemesas: Error al manejar datos del formulario:', error)
  }
}

// Función para manejar la selección del método de recepción
const handleMetodoRecepcion = (datos) => {
  datosRemesa.value.metodoRecepcion = {
    tipo: datos.tipo,
    esQR: datos.esQR,
    qr: datos.qr,
    nombreBeneficiario: datos.nombreBeneficiario,
    cuenta: datos.cuenta
  }
  currentStep.value = 3
}

// Función para centrar el paso en la pantalla
const centrarPaso = (stepNumber) => {
  setTimeout(() => {
    const paso = document.getElementById(`paso-${stepNumber}`)
    if (paso) {
      const headerOffset = 80 // Ajustamos este valor para dejar espacio para el header
      const elementPosition = paso.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Agregar efecto de resaltado
      paso.classList.add('paso-activo')
      setTimeout(() => {
        paso.classList.remove('paso-activo')
      }, 2000)
    }
  }, 100)
}

// Función para manejar la selección del método de pago
const handleMetodoPago = (payload) => {
  datosRemesa.value.metodoPago = {
    tipo: payload.metodo,
    numero: payload.numero,
    referencia: payload.referencia,
    banco: payload.banco,
    cuenta: payload.cuenta,
    swift: payload.swift,
    titular: payload.titular,
    comprobante: payload.comprobantePago
  }
  currentStep.value = 4 // Cambiamos a 4 para ir directamente al resumen
  centrarPaso(4)
}

// Función para manejar el envío final
const handleSubmit = () => {
  // Aquí irá la lógica de envío
  console.log('Enviando remesa...')
}

// Función para cerrar el modal de remesa
const closeRemittanceModal = () => {
  showRemittanceModal.value = false
  currentStep.value = 1
}

// Función para agregar nueva remesa
const handleNewRemittance = (newRemittance) => {
  remesas.value.unshift(newRemittance)
  showSuccessNotification.value = true
  setTimeout(() => {
    showSuccessNotification.value = false
  }, 5000)
}

// Inicializar el store
const store = useRemesaStore()

// Función para manejar el siguiente paso
const handleSiguientePaso = (paso) => {
  console.log('MisRemesas: Recibido evento siguiente-paso', paso)
  try {
    // Actualizar el paso actual en el store
    store.setPasoActual(paso)
    console.log('MisRemesas: Paso actual actualizado a', paso)

    // Actualizar el paso actual local
    currentStep.value = paso
    console.log('MisRemesas: Paso local actualizado a', paso)

    // Centrar el paso en la pantalla
    setTimeout(() => {
      console.log('MisRemesas: Iniciando scroll al paso', paso)
      const pasoElement = document.querySelector(`.paso-${paso}`)
      if (pasoElement) {
        console.log('MisRemesas: Elemento del paso encontrado')
        const headerOffset = 80
        const elementPosition = pasoElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })

        pasoElement.classList.add('paso-activo')
        setTimeout(() => {
          pasoElement.classList.remove('paso-activo')
        }, 2000)
      } else {
        console.log('MisRemesas: No se encontró el elemento del paso')
      }
    }, 100)
  } catch (error) {
    console.error('MisRemesas: Error al manejar siguiente-paso:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Fecha de actualización -->
    <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
      Última actualización: {{ fechaActualizacion }}
    </div>

    <!-- Tarjetas de precios -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Tarjeta de precio estándar -->
      <div class="bg-indigo-600 dark:bg-indigo-700 rounded-xl shadow-lg p-4 border-2 border-indigo-500 dark:border-indigo-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-white">Precio Estándar</h3>
          <span class="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm font-medium">
            Normal
          </span>
        </div>
        <div class="text-3xl font-bold text-white mb-1">
          1 SEK = {{ cambioEstandar.toFixed(4) }} BOB
        </div>
        <p class="text-sm text-indigo-100">
          Para envíos menores a 5,000 BOB
        </p>
      </div>

      <!-- Tarjeta de precio especial -->
      <div class="bg-emerald-600 dark:bg-emerald-700 rounded-xl shadow-lg p-4 border-2 border-emerald-500 dark:border-emerald-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-white">Precio Especial</h3>
          <span class="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-medium">
            Especial
          </span>
        </div>
        <div class="text-3xl font-bold text-white mb-1">
          1 SEK = {{ cambioEspecial.toFixed(4) }} BOB
        </div>
        <p class="text-sm text-emerald-100">
          Para envíos de 5,000 BOB o más
        </p>
      </div>
    </div>

    <!-- Contenedor de pasos -->
    <div class="space-y-8">
      <!-- Paso 1: Formulario de envío -->
      <div v-show="currentStep >= 1" class="paso-1">
        <FormularioEnvio 
          :paises="paises"
          :cambioEstandar="cambioEstandar"
          :cambioEspecial="cambioEspecial"
          @siguiente-paso="handleSiguientePaso"
          @datos="handleFormularioDatos"
        />
      </div>

      <!-- Paso 2: Método de recepción -->
      <div v-show="currentStep >= 2" class="paso-2">
        <MetodoRecepcion 
          :beneficiarios="beneficiarios"
          :departamentos="departamentos"
          @siguiente-paso="handleSiguientePaso"
        />
      </div>

      <!-- Paso 3: Método de pago -->
      <div v-show="currentStep >= 3" class="paso-3">
        <MetodoPagoSuecia 
          @siguiente-paso="handleSiguientePaso"
        />
      </div>

      <!-- Paso 4: Resumen -->
      <div v-show="currentStep >= 4" class="paso-4">
        <ResumenRemesa 
          @siguiente-paso="handleSiguientePaso"
          @confirmado="handleSubmit"
        />
      </div>
    </div>

    <!-- Notificación de éxito -->
    <div 
      v-if="showSuccessNotification" 
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>¡Remesa enviada con éxito!</span>
      </div>
    </div>

    <!-- Modal de remesa -->
    <div 
      v-if="showRemittanceModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Encabezado del modal -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Nueva remesa
            </h2>
            <button 
              @click="closeRemittanceModal" 
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <!-- Barra de progreso -->
          <div class="mt-6">
            <div class="flex justify-between mb-2">
              <div 
                v-for="step in 4" 
                :key="step"
                class="flex-1 text-center"
              >
                <div 
                  class="w-8 h-8 mx-auto rounded-full flex items-center justify-center"
                  :class="[
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  ]"
                >
                  {{ step }}
                </div>
                <div 
                  class="text-xs mt-1"
                  :class="[
                    currentStep >= step 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  ]"
                >
                  {{ 
                    step === 1 ? 'Envío' :
                    step === 2 ? 'Recepción' :
                    step === 3 ? 'Pago' :
                    'Resumen'
                  }}
                </div>
              </div>
            </div>
            <div class="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                class="absolute h-2 bg-blue-600 rounded-full transition-all duration-300"
                :style="{ width: `${(currentStep - 1) * 33.33}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6">
          <!-- Paso 1: Formulario de envío -->
          <div v-if="currentStep === 1">
            <FormularioEnvio 
              :paises="paises"
              :cambioEstandar="cambioEstandar"
              :cambioEspecial="cambioEspecial"
              @siguiente-paso="handleSiguientePaso"
              @datos="handleFormularioDatos"
            />
          </div>

          <!-- Paso 2: Método de pago -->
          <div v-if="currentStep === 2">
            <MetodoPagoSuecia 
              @siguiente-paso="handleSiguientePaso"
            />
          </div>

          <!-- Paso 3: Resumen -->
          <div v-if="currentStep === 3">
            <ResumenRemesa 
              @siguiente-paso="handleSiguientePaso"
              @confirmado="handleSubmit"
            />
          </div>
        </div>

        <!-- Botones de navegación -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button 
            v-if="currentStep > 1"
            @click="prevStep"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Anterior
          </button>
          <div v-else></div>
          
          <button 
            v-if="currentStep < 4"
            @click="nextStep"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Siguiente
            <i class="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Asegurar que el contenido ocupe todo el ancho disponible */
.app-content {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* Ajustar el contenedor de la tabla para que sea responsive */
.overflow-x-auto {
  width: 100%;
  max-width: 100%;
}

/* Asegurar que la tabla ocupe todo el ancho disponible */
table {
  width: 100%;
  min-width: 100%;
}

/* Ajustar el contenedor de las tarjetas */
.grid {
  width: 100%;
  max-width: 100%;
}

/* Animaciones para el modal */
.fixed.inset-0 > div {
  animation: modalFadeIn 0.2s ease-out forwards;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Efecto de hover en botones */
button {
  transition: all 0.15s ease;
}

button:active:not(:disabled) {
  transform: scale(0.97);
}

/* Efectos de hover mejorados para las tarjetas */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Transición suave para el hover */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Efecto de elevación al hover */
.transform {
  transition: transform 0.3s ease-in-out;
}

/* Estilo para el campo activo */
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Animación suave para el cambio de campo activo */
input {
  transition: all 0.2s ease-in-out;
}

/* Efecto de brillo en los bordes */
.border-4 {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
}

/* Animación para los nuevos pasos */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  scroll-margin-top: 2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajustar el contenedor principal */
.container {
  min-height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-padding-top: 5rem; /* Ajustamos el padding superior para el scroll */
  padding-top: 0.5rem;
}

/* Asegurar que los pasos tengan un margen superior consistente */
.space-y-8 > * {
  margin-top: 1rem;
  scroll-margin-top: 5rem; /* Ajustamos el margen de scroll para cada paso */
}

/* Estilos para el paso activo */
.paso-activo {
  animation: highlight 2s ease-out;
}

@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Transiciones suaves para todos los pasos */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

/* Animación de entrada para nuevos pasos */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajustar la visibilidad de los pasos */
[v-show] {
  display: block !important;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

/* Efectos mejorados para las tarjetas de precios */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}
</style>