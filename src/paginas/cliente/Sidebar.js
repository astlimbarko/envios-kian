/**
 * Archivo: Sidebar.js
 * 
 * Configuración del menú lateral para el módulo de cliente.
 * Define la estructura, opciones y textos del sidebar del cliente.
 * Este archivo centraliza toda la configuración del menú para mantener
 * la consistencia y facilitar su mantenimiento.
 * 
 * NOTA: Las opciones de FAQ y Blog están en el navbar del cliente (Cliente_navbar.js)
 * y no deben estar en el sidebar.
 */

export const menuCliente = {
  // Título principal del panel
  title: 'Panel de Cliente',
  subtitle: 'Gestión de remesas',
  
  // Secciones del menú
  sections: [
    {
      title: 'Gestión Principal',
      options: [
        {
          path: '/cliente/nueva-remesa',
          icon: 'fas fa-plus-circle',
          text: 'Nueva Remesa',
          description: 'Crear una nueva remesa'
        },
        {
          path: '/cliente/remesas',
          icon: 'fas fa-exchange-alt',
          text: 'Mis Remesas',
          description: 'Ver y gestionar mis remesas'
        },
        {
          path: '/cliente/beneficiarios',
          icon: 'fas fa-users',
          text: 'Beneficiarios',
          description: 'Administrar beneficiarios'
        }
      ]
    },
    {
      title: 'Soporte y Ayuda',
      options: [
        {
          path: '/cliente/contacto',
          icon: 'fas fa-phone',
          text: 'Contacto',
          description: 'Información de contacto'
        }
      ]
    }
  ],

  // Footer del sidebar
  footer: {
    title: '¿Necesitas Ayuda?',
    subtitle: 'Contacta a soporte',
    icon: 'fas fa-headset'
  }
} 