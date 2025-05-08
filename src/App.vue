<script setup>
// Componente principal que usa el enrutador
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-[#2A3942] text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <router-view />
  </div>
</template>

<style>
/* Variables CSS para layout responsivo */
:root {
  --navbar-height: 60px;
  --sidebar-width: 256px;
  --sidebar-mobile-width: 0px;
  --content-padding: 1rem;
  
  /* Colores principales del sistema */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-text-primary: #1f2937;
  --color-text-secondary: #4b5563;
  --color-border: #e5e7eb;
  --color-shadow: rgba(0, 0, 0, 0.1);
  --color-blue-primary: #146EBE;
  --color-blue-secondary: #4c9ed9;
  --color-blue-light: #c8e4ff;
  
  /* Colores de la interfaz de Windows 10 */
  --color-win10-taskbar: #C3D3DC;
  
  /* Colores específicos para elementos de UI */
  --color-navbar-bg: var(--color-win10-taskbar);
  --color-navbar-text: #1f2937;
  --color-sidebar-bg: #F9F9F9;
  --color-table-bg: #F2F7FA;
  --color-table-header: #E6EEF3;
  --color-table-hover: #E6EEF3;
  --color-table-alt-row: #EDF3F8;
}

@media (max-width: 1024px) {
  :root {
    --sidebar-width: 0px;
    --content-padding: 0.75rem;
  }
}

/* Modo oscuro */
.dark {
  --color-bg-primary: #2A3942;
  --color-bg-secondary: #2A3942;
  --color-bg-tertiary: #111b21;
  --color-text-primary: #e5e7eb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-blue-primary: #4c9ed9;
  --color-blue-secondary: #146EBE;
  --color-blue-light: #c8e4ff;
  
  /* Colores para navegación en modo oscuro */
  --color-win10-taskbar-dark: #111b21;
  --color-navbar-bg: var(--color-win10-taskbar-dark);
  --color-navbar-text: #ffffff;
  --color-sidebar-bg: #111b21;
  --color-table-bg: #202C33;
  --color-table-header: #111b21;
  --color-table-hover: #1A242C;
  --color-table-alt-row: #202C33;
}

/* Aplicar colores base a los elementos */
body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  overflow-x: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

html {
  overflow-x: hidden;
  width: 100%;
}

/* Transiciones para cambios de tema */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Estilos específicos para el modo oscuro en componentes generales */
.dark .bg-white {
  background-color: var(--color-bg-secondary);
}

.dark .bg-gray-50 {
  background-color: var(--color-bg-tertiary);
}

.dark .bg-blue-50 {
  background-color: rgba(29, 78, 216, 0.8);
}

.dark .text-blue-600 {
  color: #60a5fa;
}

.dark .border-gray-200 {
  border-color: var(--color-border);
}

/* Sombras en modo oscuro */
.dark .shadow-md, 
.dark .shadow-lg, 
.dark .shadow-xl {
  box-shadow: 0 4px 6px -1px var(--color-shadow), 
              0 2px 4px -1px var(--color-shadow);
}

/* Navbar en modo oscuro y claro */
nav {
  background-color: var(--color-navbar-bg);
  color: var(--color-navbar-text);
}

/* Sidebar en modo oscuro y claro */
.sidebar {
  background-color: var(--color-sidebar-bg);
}

.icon-neon {
  color: var(--color-navbar-text);
}

/* Para listas y tablas en modo oscuro */
.dark tbody tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Ajustes para inputs en modo oscuro */
.dark input:not([type="checkbox"]):not([type="radio"]),
.dark select,
.dark textarea {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.dark input::placeholder,
.dark textarea::placeholder {
  color: var(--color-text-secondary);
}

/* Ajustes para modo oscuro en el sidebar */
.dark .fixed.left-0.top-16 {
  background-color: var(--color-bg-tertiary);
  border-right: 1px solid var(--color-border);
}

/* Botones primarios */
.btn-primary {
  background-color: var(--color-blue-primary);
  color: white;
}

.dark .btn-primary {
  background-color: var(--color-blue-primary);
  color: white;
}

/* Botones secundarios */
.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-blue-primary);
  color: var(--color-blue-primary);
}

.dark .btn-secondary {
  border-color: var(--color-blue-primary);
  color: var(--color-blue-light);
}

/* Clases de utilidad para responsive */
.app-content {
  padding: var(--content-padding);
  transition: margin-left 0.3s ease;
  width: 100%;
  max-width: none;
  margin: 0;
}

.with-sidebar {
  margin-left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
}

@media (max-width: 1024px) {
  .with-sidebar {
    margin-left: 0;
    width: 100%;
  }
}

/* Asegurar que el contenido ocupe todo el ancho disponible */
#app {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* Asegurar que el contenido principal ocupe todo el ancho */
main {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* Asegurar que el router-view ocupe todo el ancho */
.router-view {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

/* Overlay para sidebar en móvil */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.active {
  display: block;
}
</style>
