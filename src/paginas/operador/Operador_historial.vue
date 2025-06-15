/**
 * Componente: Operador_historial.vue
 * 
 * Este componente muestra el historial de todas las actividades realizadas
 * por los operadores en el sistema.
 */

<script setup>
import { ref, computed } from 'vue'

// Estado del módulo
const actividades = ref([
  {
    id: 1,
    tipo: 'remesa',
    accion: 'Procesamiento de remesa',
    detalles: 'Remesa #12345 procesada exitosamente',
    operador: 'Juan Pérez',
    timestamp: '2024-03-20 15:30',
    estado: 'completado',
    datos: {
      cliente: 'María García',
      monto: 1500,
      moneda: 'SEK'
    }
  },
  {
    id: 2,
    tipo: 'usuario',
    accion: 'Verificación de identidad',
    detalles: 'Verificación de identidad completada para usuario #789',
    operador: 'Carlos Rodríguez',
    timestamp: '2024-03-20 15:25',
    estado: 'completado',
    datos: {
      usuario: 'Ana Martínez',
      documento: 'DNI-12345678'
    }
  },
  {
    id: 3,
    tipo: 'beneficiario',
    accion: 'Actualización de beneficiario',
    detalles: 'Datos de beneficiario actualizados',
    operador: 'Laura Sánchez',
    timestamp: '2024-03-20 15:20',
    estado: 'completado',
    datos: {
      cliente: 'Pedro López',
      beneficiario: 'Sofía Ruiz'
    }
  },
  {
    id: 4,
    tipo: 'soporte',
    accion: 'Chat de soporte',
    detalles: 'Chat iniciado y resuelto',
    operador: 'Miguel Torres',
    timestamp: '2024-03-20 15:15',
    estado: 'completado',
    datos: {
      cliente: 'Elena Vargas',
      duracion: '15 minutos',
      satisfaccion: 'alta'
    }
  },
  {
    id: 5,
    tipo: 'remesa',
    accion: 'Anulación de remesa',
    detalles: 'Remesa #12346 anulada por solicitud del cliente',
    operador: 'Juan Pérez',
    timestamp: '2024-03-20 15:10',
    estado: 'completado',
    datos: {
      cliente: 'Roberto Díaz',
      monto: 2000,
      moneda: 'SEK'
    }
  }
])

// Filtros
const filtroFecha = ref('')
const filtroTipo = ref('')
const filtroOperador = ref('')

// Filtrar actividades
const actividadesFiltradas = computed(() => {
  return actividades.value.filter(actividad => {
    const matchFecha = !filtroFecha.value || actividad.timestamp.includes(filtroFecha.value)
    const matchTipo = !filtroTipo.value || actividad.tipo === filtroTipo.value
    const matchOperador = !filtroOperador.value || 
                         actividad.operador.toLowerCase().includes(filtroOperador.value.toLowerCase())
    return matchFecha && matchTipo && matchOperador
  })
})

// Funciones de utilidad
const getTipoClass = (tipo) => {
  const clases = {
    remesa: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    usuario: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    beneficiario: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    soporte: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  }
  return clases[tipo] || clases.remesa
}

const getTipoIcon = (tipo) => {
  const iconos = {
    remesa: 'fa-money-bill-transfer',
    usuario: 'fa-user',
    beneficiario: 'fa-users',
    soporte: 'fa-headset'
  }
  return iconos[tipo] || 'fa-circle'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Historial de Actividad
      </h1>
      <div class="flex space-x-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <i class="fas fa-sync-alt mr-2"></i>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Filtro por fecha -->
      <div class="relative">
        <input 
          v-model="filtroFecha"
          type="date" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
      </div>
      
      <!-- Filtro por tipo de acción -->
      <div class="relative">
        <select 
          v-model="filtroTipo"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas las acciones</option>
          <option value="remesa">Remesas</option>
          <option value="usuario">Usuarios</option>
          <option value="beneficiario">Beneficiarios</option>
          <option value="soporte">Soporte</option>
        </select>
      </div>

      <!-- Filtro por operador -->
      <div class="relative">
        <input 
          v-model="filtroOperador"
          type="text" 
          placeholder="Buscar por operador..." 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>
    </div>

    <!-- Lista de actividades -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div class="space-y-4">
        <div v-for="actividad in actividadesFiltradas" 
             :key="actividad.id"
             class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <!-- Icono -->
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <i :class="['fas', getTipoIcon(actividad.tipo)]"></i>
            </div>
          </div>

          <!-- Detalles -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ actividad.accion }}
              </h3>
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getTipoClass(actividad.tipo)">
                {{ actividad.tipo }}
              </span>
            </div>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ actividad.detalles }}
            </p>
            
            <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center">
                <i class="fas fa-user mr-1"></i>
                {{ actividad.operador }}
              </span>
              <span class="mx-2">•</span>
              <span class="flex items-center">
                <i class="fas fa-clock mr-1"></i>
                {{ actividad.timestamp }}
              </span>
            </div>

            <!-- Datos adicionales -->
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <template v-if="actividad.tipo === 'remesa'">
                <p>Cliente: {{ actividad.datos.cliente }}</p>
                <p>Monto: {{ actividad.datos.monto }} {{ actividad.datos.moneda }}</p>
              </template>
              <template v-else-if="actividad.tipo === 'usuario'">
                <p>Usuario: {{ actividad.datos.usuario }}</p>
                <p>Documento: {{ actividad.datos.documento }}</p>
              </template>
              <template v-else-if="actividad.tipo === 'beneficiario'">
                <p>Cliente: {{ actividad.datos.cliente }}</p>
                <p>Beneficiario: {{ actividad.datos.beneficiario }}</p>
              </template>
              <template v-else-if="actividad.tipo === 'soporte'">
                <p>Cliente: {{ actividad.datos.cliente }}</p>
                <p>Duración: {{ actividad.datos.duracion }}</p>
                <p>Satisfacción: {{ actividad.datos.satisfaccion }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {{ actividadesFiltradas.length }} actividades
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            Anterior
          </button>
          <button class="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            Siguiente
          </button>
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