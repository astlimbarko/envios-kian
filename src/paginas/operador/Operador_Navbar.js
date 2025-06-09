/**
 * Archivo: Operador_Navbar.js
 * 
 * Configuración del navbar para el módulo de operador.
 * Define la estructura, opciones y textos del navbar del operador.
 * Este archivo centraliza toda la configuración del navbar para mantener
 * la consistencia y facilitar su mantenimiento.
 */

export const navbarOperador = {
  // Información del usuario
  usuario: {
    nombre: 'Eliana Sánchez',
    rol: 'Operador'
  },

  // Configuración del logo
  logo: {
    icono: 'fas fa-globe-americas',
    texto: 'ENVIOS KIAN'
  },

  // Opciones del menú de usuario
  menuUsuario: {
    configuracion: {
      texto: 'Configuración',
      icono: 'fas fa-cog',
      ruta: '/operador/configuracion'
    },
    cerrarSesion: {
      texto: 'Cerrar Sesión',
      icono: 'fas fa-sign-out-alt',
      accion: 'cerrarSesion'
    }
  }
}
