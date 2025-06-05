<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Sidebar />
    <div class="p-4 sm:ml-64">
      <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script> 