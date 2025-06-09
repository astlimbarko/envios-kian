/**
 * Configuración específica del navbar para el módulo Cliente
 * Solo contiene los elementos adicionales específicos del cliente
 */

export const navbarCliente = {
  // Elementos adicionales específicos del cliente
  elementosAdicionales: [
    {
      tipo: 'link',
      texto: 'FAQ',
      icono: 'fas fa-circle-question',
      ruta: '/cliente/faq',
      tooltip: 'FAQ',
      visible: true,
      clase: 'icon-neon'
    },
    {
      tipo: 'link',
      texto: 'Noticias',
      icono: 'fas fa-newspaper',
      ruta: '/cliente/blog',
      tooltip: 'Noticias',
      visible: true,
      clase: 'icon-neon',
      ocultarEnMovil: true
    }
  ],

  // Opción específica del menú de usuario para cliente
  menuUsuario: {
    configuracion: {
      texto: 'Mi Cuenta',
      icono: 'fas fa-user',
      ruta: '/cliente/mi-cuenta'
    }
  }
}
