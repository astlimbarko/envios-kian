<script setup>
// Componente principal de Envíos KIAN
</script>

<template>
  <div class="bg-background min-h-screen flex flex-col">
    <!-- Encabezado -->
    <header class="py-4 bg-white shadow-sm border-b border-accent">
      <div class="container mx-auto px-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-primary">Envíos KIAN</h1>
        <nav class="flex space-x-4">
          <a href="#" class="text-text hover:text-primary">Inicio</a>
          <a href="#" class="text-text hover:text-primary">Servicios</a>
          <a href="#" class="text-text hover:text-primary">Contacto</a>
        </nav>
      </div>
    </header>
    
    <!-- Contenido principal -->
    <main class="container mx-auto px-4 py-8 flex-grow">
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-text mb-4">Bienvenido a Envíos KIAN</h2>
        <div class="bg-white p-6 rounded-lg shadow-md border border-accent">
          <p class="text-text mb-4">
            Esta es una página de prueba con tema claro. El fondo es color hueso y el texto es oscuro.
          </p>
          <button class="bg-primary hover:bg-secondary text-white font-medium py-2 px-4 rounded transition-colors">
            Botón de prueba
          </button>
        </div>
      </section>
      
      <!-- Tarjeta de ejemplo con Tailwind -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md border border-accent">
          <h3 class="text-lg font-medium text-text mb-2">Servicios de envío</h3>
          <p class="text-gray-600 mb-4">Ofrecemos diferentes opciones de envío según tus necesidades.</p>
          <div class="flex justify-end">
            <button class="text-primary hover:text-secondary font-medium">Ver más</button>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md border border-accent">
          <h3 class="text-lg font-medium text-text mb-2">Seguimiento de paquetes</h3>
          <p class="text-gray-600 mb-4">Consulta el estado de tus envíos en tiempo real.</p>
          <div class="flex justify-end">
            <button class="text-primary hover:text-secondary font-medium">Ver más</button>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Pie de página -->
    <footer class="bg-white border-t border-accent py-4 mt-8">
      <div class="container mx-auto px-4 text-center text-gray-600">
        © {{ new Date().getFullYear() }} Envíos KIAN - Todos los derechos reservados
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Estilos adicionales específicos de este componente */
</style> 