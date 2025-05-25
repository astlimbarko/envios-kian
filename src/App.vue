<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRemesaStore } from './store/remesa'

const router = useRouter()
const remesaStore = useRemesaStore()

onMounted(() => {
  // Inicializar el modo oscuro como claro por defecto
  if (!localStorage.getItem('darkMode')) {
    localStorage.setItem('darkMode', 'false')
    document.documentElement.classList.remove('dark')
  } else {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})
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
  --color-bg-primary: #1a1a1a;  /* Fondo principal más oscuro y elegante */
  --color-bg-secondary: #555555;  /* Fondo del cuerpo de la pagina */
  --color-bg-tertiary: #111B21;  /* Fondo del slidebar */
  --color-text-primary: #ffffff;  /* Texto principal más brillante */
  --color-text-secondary: #a0a0a0;  /* Texto secundario más suave */
  --color-border: #404040;  /* Bordes más suaves */
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-blue-primary: #60a5fa;  /* Azul más brillante */
  --color-blue-secondary: #3b82f6;  /* Azul secundario más vibrante */
  --color-blue-light: #93c5fd;  /* Azul claro más suave */
  
  /* Colores para navegación en modo oscuro */
  --color-win10-taskbar-dark: #111B21;  /* Taskbar más oscura */
  --color-navbar-bg: var(--color-win10-taskbar-dark);   /*fondo de la barra de navegacion slidebar solo el texto*/
  --color-navbar-text: #ffffff;
  --color-sidebar-bg: #1A1A1A;  /* Sidebar más suave */
  --color-table-bg: #2d2d2d;  /* Tablas más suaves */
  --color-table-header: #1a1a1a;  /* Encabezados más oscuros */
  --color-table-hover: #363636;  /* Hover más suave */
  --color-table-alt-row: #2d2d2d;  /* Filas alternas más suaves */
}

.pasos-colors {
  --color-fondo-pasos-dark-gray800: #2c3e50; /* Fondo paso oscuro tipo gray-800 */
  --color-fondo-pasos-dark-gray900: #34495e; /* Fondo paso más oscuro tipo gray-900 */
  --color-fondo-pasos-light-gray50: #f9fafb; /* Fondo paso claro tipo gray-50 */
  --color-fondo-pasos-light-gray100: #f3f4f6; /* Fondo paso claro tipo gray-100 */
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
  color: #ffffff;  /* color de texto blanco para botones */
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
