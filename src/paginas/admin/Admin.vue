<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Panel Admin</h1>
      </div>
      <nav class="mt-6">
        <router-link
          to="/admin/remesas"
          class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-blue-50 dark:bg-blue-900"
        >
          <i class="fas fa-money-bill-wave mr-3"></i>
          Remesas
        </router-link>
        <router-link
          to="/admin/usuarios"
          class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-blue-50 dark:bg-blue-900"
        >
          <i class="fas fa-users mr-3"></i>
          Usuarios
        </router-link>
        <router-link
          to="/admin/perfil"
          class="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          active-class="bg-blue-50 dark:bg-blue-900"
        >
          <i class="fas fa-user-cog mr-3"></i>
          Perfil
        </router-link>
      </nav>
    </div>

    <!-- Contenido principal -->
    <div class="ml-64 p-8">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
// No se requiere lógica adicional por ahora
</script> 