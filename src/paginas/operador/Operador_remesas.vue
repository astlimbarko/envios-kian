/**
 * Componente: Operador_remesas.vue
 * 
 * Este componente permite a los operadores gestionar las remesas del sistema,
 * incluyendo la creación, edición, seguimiento y procesamiento de remesas.
 */

<script setup>
import { ref, computed, onMounted } from 'vue'
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

// Funciones de gestión
const verDetalle = (remesa) => {
  console.log('=== INICIO verDetalle ===')
  console.log('Remesa seleccionada:', remesa)
  console.log('Estado antes:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  
  remesaSeleccionada.value = remesa
  mostrarDetalle.value = true
  
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
  
  console.log('Estado después:', {
    mostrarDetalle: mostrarDetalle.value,
    remesaSeleccionada: remesaSeleccionada.value
  })
  console.log('=== FIN cerrarDetalle ===')
}

const actualizarEstadoRemesa = (id, nuevoEstado) => {
  const remesa = remesas.value.find(r => r.id === id)
  if (remesa) {
    remesa.estado = nuevoEstado
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
  }
}

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

// Agregar verificación al montar el componente
onMounted(() => {
  console.log('Componente Operador_remesas montado')
  verificarEstado()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Botón de prueba temporal -->
    <button 
      @click="verificarEstado"
      class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
    >
      Verificar Estado
    </button>

    <!-- Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Remesas Pendientes -->
      <button 
        @click="filtroEstado = 'pendiente'"
        class="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Remesas Pendientes</p>
            <p class="text-3xl font-bold text-white mt-2">
              {{ estadisticas.pendientes }}
            </p>
          </div>
          <div class="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-clock text-white text-xl"></i>
          </div>
        </div>
      </button>

      <!-- Remesas con Incidencias -->
      <button 
        @click="filtroEstado = 'incidencia'"
        class="bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Con Incidencias</p>
            <p class="text-3xl font-bold text-white mt-2">
              {{ estadisticas.incidencias }}
            </p>
          </div>
          <div class="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-white text-xl"></i>
          </div>
        </div>
      </button>

      <!-- Remesas Anuladas -->
      <button 
        @click="filtroEstado = 'cancelada'"
        class="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-white">Remesas Anuladas</p>
            <p class="text-3xl font-bold text-white mt-2">
              {{ estadisticas.anuladas }}
            </p>
          </div>
          <div class="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-ban text-white text-xl"></i>
          </div>
        </div>
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex space-x-4">
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

    <!-- Lista de remesas -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Remesa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="remesa in remesasFiltradas" 
                :key="remesa.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                @click="verDetalle(remesa)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ remesa.numero }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ remesa.cliente }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatearMoneda(remesa.monto, remesa.moneda) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getEstadoClass(remesa.estado)" class="px-2 py-1 text-xs rounded-full">
                  {{ remesa.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ remesa.fechaCreacion }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de detalles -->
    <Teleport to="body">
      <DetalleRemesa 
        v-if="mostrarDetalle"
        :remesa="remesaSeleccionada"
        :mostrar="mostrarDetalle"
        @cerrar="cerrarDetalle"
        @actualizarEstado="actualizarEstadoRemesa"
      />
    </Teleport>
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