verificar/**
 * Componente: Operador_remesas.vue
 * 
 * Este componente permite a los operadores gestionar las remesas del sistema,
 * incluyendo la creación, edición, seguimiento y procesamiento de remesas.
 */

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import DetalleRemesa from './DetalleRemesa.vue'

// Estado del módulo
const remesas = ref([
  {
    id: 1,
    numero: 'REM-2024-001',
    cliente: 'Juan Pérez',
    beneficiario: 'María García',
    monto: 1500,
    moneda: 'SEK',
    estado: 'pendiente',
    fechaCreacion: '2024-03-20 15:30',
    fechaProcesamiento: null,
    fechaCompletada: null,
    prioridad: 'normal',
    tipoPago: 'qr', // 'qr' o 'transferencia'
    datosBancarios: {
      entidad: 'Banco Nacional de Bolivia',
      numeroCuenta: '1234567890',
      tipoCuenta: 'Cuenta Corriente',
      sucursal: 'La Paz'
    },
    documentos: [
      {
        tipo: 'DNI',
        numero: '12345678A',
        estado: 'verificado'
      }
    ],
    historial: [
      {
        fecha: '2024-03-20 15:30',
        accion: 'Remesa creada',
        operador: 'Carlos Rodríguez'
      }
    ]
  },
  {
    id: 2,
    numero: 'REM-2024-002',
    cliente: 'Ana Martínez',
    beneficiario: 'Pedro López',
    monto: 2000,
    moneda: 'SEK',
    estado: 'en_proceso',
    fechaCreacion: '2024-03-20 14:45',
    fechaProcesamiento: '2024-03-20 15:00',
    fechaCompletada: null,
    tipo: 'nacional',
    prioridad: 'alta',
    documentos: [
      {
        tipo: 'Pasaporte',
        numero: 'AB123456',
        estado: 'verificado'
      }
    ],
    historial: [
      {
        fecha: '2024-03-20 14:45',
        accion: 'Remesa creada',
        operador: 'Laura Sánchez'
      },
      {
        fecha: '2024-03-20 15:00',
        accion: 'Remesa con insidenciass',
        operador: 'Carlos Rodríguez'
      }
    ]
  },
  {
    id: 3,
    numero: 'REM-2024-003',
    cliente: 'Roberto Díaz',
    beneficiario: 'Sofía Ruiz',
    monto: 3000,
    moneda: 'SEK',
    estado: 'completada',
    fechaCreacion: '2024-03-20 13:30',
    fechaProcesamiento: '2024-03-20 14:00',
    fechaCompletada: '2024-03-20 15:00',
    tipo: 'internacional',
    prioridad: 'normal',
    documentos: [
      {
        tipo: 'DNI',
        numero: '87654321B',
        estado: 'verificado'
      }
    ],
    historial: [
      {
        fecha: '2024-03-20 13:30',
        accion: 'Remesa creada',
        operador: 'Miguel Torres'
      },
      {
        fecha: '2024-03-20 14:00',
        accion: 'Remesa con insidencias',
        operador: 'Carlos Rodríguez'
      },
      {
        fecha: '2024-03-20 15:00',
        accion: 'Remesa completada',
        operador: 'Carlos Rodríguez'
      }
    ]
  }
])

// Estado para el detalle
const mostrarDetalle = ref(false)
const remesaSeleccionada = ref(null)
const tabActiva = ref('lista')
const mostrarConfirmacionCierre = ref(false)

// Filtros
const filtroEstado = ref('todos')
const busqueda = ref('')

// Estadísticas
const estadisticas = computed(() => {
  return {
    pendientes: remesas.value.filter(r => r.estado === 'pendiente').length,
    incidencias: remesas.value.filter(r => r.estado === 'incidencia').length,
    anuladas: remesas.value.filter(r => r.estado === 'cancelada').length
  }
})

// Filtrar remesas
const remesasFiltradas = computed(() => {
  return remesas.value.filter(remesa => {
    const matchEstado = filtroEstado.value === 'todos' || remesa.estado === filtroEstado.value
    const matchBusqueda = remesa.numero.toLowerCase().includes(busqueda.value.toLowerCase()) ||
                         remesa.cliente.toLowerCase().includes(busqueda.value.toLowerCase())
    return matchEstado && matchBusqueda
  })
})

// Estado de procesamiento
const procesando = ref(false)
const remesaPausada = ref(false)
const estadoProcesamiento = ref(null)

// Funciones de gestión
const verDetalle = (remesa) => {
  console.log('=== INICIO verDetalle ===')
  console.log('Remesa seleccionada:', remesa)
  console.log('Estado antes:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  
  remesaSeleccionada.value = remesa
  procesando.value = true
  remesaPausada.value = false
  estadoProcesamiento.value = null
  tabActiva.value = 'detalle'
  
  // Guardar estado en localStorage
  guardarEstado()
  
  console.log('Estado después:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  console.log('=== FIN verDetalle ===')
}

const cerrarDetalle = () => {
  console.log('=== INICIO cerrarDetalle ===')
  console.log('Estado antes:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  
  mostrarDetalle.value = false
  remesaSeleccionada.value = null
  tabActiva.value = 'lista'
  
  // Limpiar estado guardado
  localStorage.removeItem('estadoOperador')
  
  console.log('Estado después:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  console.log('=== FIN cerrarDetalle ===')
}

const solicitarCierreDetalle = () => {
  mostrarConfirmacionCierre.value = true
}

const confirmarCierreDetalle = () => {
  mostrarConfirmacionCierre.value = false
  cerrarDetalle()
}

const cancelarCierreDetalle = () => {
  mostrarConfirmacionCierre.value = false
}

const actualizarEstadoRemesa = (id, nuevoEstado, descripcion = '') => {
  const remesa = remesas.value.find(r => r.id === id)
  if (remesa) {
    remesa.estado = nuevoEstado
    estadoProcesamiento.value = nuevoEstado
    const fecha = new Date().toLocaleString()
    
    switch (nuevoEstado) {
      case 'en_proceso':
        remesa.fechaProcesamiento = fecha
        break
      case 'completada':
        remesa.fechaCompletada = fecha
        break
    }
    
    remesa.historial.push({
      fecha,
      accion: `Remesa ${nuevoEstado}`,
      operador: 'Operador Actual'
    })

    // Guardar estado después de actualizar
    guardarEstado()
  }
}

// Funciones de persistencia
const guardarEstado = () => {
  const estado = {
    remesaSeleccionada: remesaSeleccionada.value,
    tabActiva: tabActiva.value,
    procesando: procesando.value,
    remesaPausada: remesaPausada.value,
    estadoProcesamiento: estadoProcesamiento.value,
    filtroEstado: filtroEstado.value,
    busqueda: busqueda.value
  }
  localStorage.setItem('estadoOperador', JSON.stringify(estado))
}

const cargarEstado = () => {
  const estadoGuardado = localStorage.getItem('estadoOperador')
  if (estadoGuardado) {
    const estado = JSON.parse(estadoGuardado)
    remesaSeleccionada.value = estado.remesaSeleccionada
    tabActiva.value = estado.tabActiva
    procesando.value = estado.procesando
    remesaPausada.value = estado.remesaPausada
    estadoProcesamiento.value = estado.estadoProcesamiento
    filtroEstado.value = estado.filtroEstado
    busqueda.value = estado.busqueda
  }
}

// Cargar estado al montar el componente
onMounted(() => {
  cargarEstado()
})

// Guardar estado cuando cambie
watch([remesaSeleccionada, tabActiva, procesando, remesaPausada, estadoProcesamiento], () => {
  guardarEstado()
})

// Funciones de utilidad
const getEstadoClass = (estado) => {
  const clases = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    en_proceso: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completada: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelada: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return clases[estado] || clases.pendiente
}

const formatearMoneda = (monto, moneda) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: moneda
  }).format(monto)
}

// Verificar el estado del componente
const verificarEstado = () => {
  console.log('=== Estado del Componente ===')
  console.log('mostrarDetalle:', mostrarDetalle.value)
  console.log('remesaSeleccionada:', remesaSeleccionada.value)
  console.log('remesasFiltradas:', remesasFiltradas.value)
  console.log('========================')
}

// Función para pausar el procesamiento
const pausarProcesamiento = () => {
  procesando.value = false
  remesaPausada.value = true
  // Guardar el estado actual en localStorage
  localStorage.setItem('remesaPausada', JSON.stringify({
    remesaId: remesaSeleccionada.value.id,
    estado: estadoProcesamiento.value,
    timestamp: new Date().toISOString()
  }))
}

// Función para reanudar el procesamiento
const reanudarProcesamiento = () => {
  procesando.value = true
  remesaPausada.value = false
  // Cargar el estado guardado
  const estadoGuardado = JSON.parse(localStorage.getItem('remesaPausada'))
  if (estadoGuardado) {
    estadoProcesamiento.value = estadoGuardado.estado
    // Mostrar resumen de acciones pendientes
    mostrarResumenAccionesPendientes()
  }
}

// Función para mostrar resumen de acciones pendientes
const mostrarResumenAccionesPendientes = () => {
  // Implementar lógica para mostrar resumen
}

// Agregar verificación al montar el componente
onMounted(() => {
  console.log('Componente Operador_remesas montado')
  verificarEstado()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Dashboard Superior -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800">
      <!-- Remesas Pendientes -->
      <button 
        @click="filtroEstado = 'pendiente'"
        class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Remesas Pendientes</p>
            <p class="text-2xl font-bold text-white mt-1">{{ estadisticas.pendientes }}</p>
          </div>
          <div class="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-white text-lg"></i>
          </div>
        </div>
      </button>

      <!-- Remesas con Incidencias -->
      <button 
        @click="filtroEstado = 'incidencia'"
        class="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Con Incidencias</p>
            <p class="text-2xl font-bold text-white mt-1">{{ estadisticas.incidencias }}</p>
          </div>
          <div class="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-white text-lg"></i>
          </div>
        </div>
      </button>

      <!-- Remesas Anuladas -->
      <button 
        @click="filtroEstado = 'cancelada'"
        class="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Remesas Anuladas</p>
            <p class="text-2xl font-bold text-white mt-1">{{ estadisticas.anuladas }}</p>
          </div>
          <div class="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-ban text-white text-lg"></i>
          </div>
        </div>
      </button>
    </div>

    <!-- Pestañas -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="flex space-x-8 px-4">
        <button
          @click="tabActiva = 'lista'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm relative',
            tabActiva === 'lista'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <i class="fas fa-list mr-2"></i>
          Remesas Pendientes
        </button>
        <button
          v-if="remesaSeleccionada"
          @click="tabActiva = 'detalle'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm relative group',
            tabActiva === 'detalle'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          ]"
        >
          <i class="fas fa-file-alt mr-2"></i>
          Remesa en Proceso
          <span class="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
            {{ remesaSeleccionada.numero }}
          </span>
          <button
            @click.stop="solicitarCierreDetalle"
            class="absolute -right-2 -top-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </button>
      </div>
    </div>

    <!-- Modal de Confirmación de Cierre -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="mostrarConfirmacionCierre" 
           class="fixed inset-0 z-[70] overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Cierre
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ¿Estás seguro de que deseas cerrar esta remesa? Se perderá el progreso no guardado.
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="cancelarCierreDetalle"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                @click="confirmarCierreDetalle"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Cerrar Remesa
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Contenido de las Pestañas -->
    <div class="flex-1 overflow-hidden">
      <!-- Pestaña Lista de Remesas -->
      <div v-if="tabActiva === 'lista'" class="h-full p-4 overflow-y-auto">
        <!-- Filtros -->
        <div class="flex space-x-4 mb-4">
          <div class="flex-1">
            <input 
              v-model="busqueda"
              type="text" 
              placeholder="Buscar remesas..." 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div class="w-48">
            <select 
              v-model="filtroEstado"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="incidencia">Con incidencias</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <!-- Lista de Remesas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Remesa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beneficiario</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="remesa in remesasFiltradas" 
                  :key="remesa.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  @click="verDetalle(remesa)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ remesa.numero }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ remesa.cliente }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatearMoneda(remesa.monto, remesa.moneda) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getEstadoClass(remesa.estado)" class="px-2 py-1 text-xs rounded-full">{{ remesa.estado }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ remesa.fechaCreacion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña Detalle de Remesa -->
      <div v-if="tabActiva === 'detalle' && remesaSeleccionada" class="h-full p-4 overflow-y-auto">
        <div class="h-full">
          <!-- Barra de Estado -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Remesa {{ remesaSeleccionada.numero }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Creada el {{ remesaSeleccionada.fechaCreacion }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="procesando" class="text-sm text-blue-600 dark:text-blue-400">
                <i class="fas fa-circle-notch fa-spin mr-1"></i>
                Procesando...
              </span>
              <button 
                v-if="procesando"
                @click="pausarProcesamiento"
                class="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
              >
                <i class="fas fa-pause mr-1"></i>
                Pausar
              </button>
              <button 
                v-else-if="remesaPausada"
                @click="reanudarProcesamiento"
                class="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                <i class="fas fa-play mr-1"></i>
                Reanudar
              </button>
            </div>
          </div>

          <!-- Contenido del Detalle -->
          <div class="space-y-4">
            <DetalleRemesa 
              :remesa="remesaSeleccionada"
              :mostrar="true"
              @cerrar="cerrarDetalle"
              @actualizarEstado="actualizarEstadoRemesa"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> 