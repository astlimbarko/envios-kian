/**
 * Configuración del menú lateral para el módulo operador
 */

export const menuOperador = {
  title: 'Panel de Operador',
  sections: [
    {
      title: 'Gestión Principal',
      options: [
        {
          path: '/operador/remesas',
          icon: 'fas fa-exchange-alt',
          text: 'Remesas',
          description: 'Gestionar remesas activas y pendientes'
        },
        {
          path: '/operador/beneficiarios',
          icon: 'fas fa-users',
          text: 'Beneficiarios',
          description: 'Administrar beneficiarios de remesas'
        },
        {
          path: '/operador/usuarios',
          icon: 'fas fa-user',
          text: 'Usuarios',
          description: 'Gestionar usuarios del sistema'
        }
      ]
    },
    {
      title: 'Soporte y Monitoreo',
      options: [
        {
          path: '/operador/soporte',
          icon: 'fas fa-headset',
          text: 'Soporte en Línea',
          description: 'Atención a consultas y problemas'
        },
        {
          path: '/operador/historial',
          icon: 'fas fa-history',
          text: 'Historial de Actividad',
          description: 'Registro de acciones realizadas'
        }
      ]
    }
  ]
}
