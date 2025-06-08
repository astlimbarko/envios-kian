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
          type="date" 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
      </div>
      
      <!-- Filtro por tipo de acción -->
      <div class="relative">
        <select 
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
        <!-- Actividad -->
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <i class="fas fa-user-edit"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Modificación de remesa #12345
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Operador: Juan Pérez
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Hace 5 minutos
            </p>
          </div>
          <div class="flex-shrink-0">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Remesa
            </span>
          </div>
        </div>

        <!-- Actividad -->
        <div class="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
              <i class="fas fa-user-check"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              Verificación de identidad completada
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Operador: María García
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Hace 15 minutos
            </p>
          </div>
          <div class="flex-shrink-0">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Usuario
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 