import { defineStore } from 'pinia'

export const useRolStore = defineStore('rol', {
  state: () => ({
    rol: 'cliente', // 'cliente', 'operador', 'gerente'
    configuracion: {
      cliente: {
        titulo: 'Panel de Cliente',
        subtitulo: 'Gestión de remesas',
        menuItems: [
          { ruta: '/cliente/nueva-remesa', icono: 'fa-plus-circle', texto: 'Nueva Remesa' },
          { ruta: '/cliente/mis-remesas', icono: 'fa-exchange-alt', texto: 'Mis Remesas' },
          { ruta: '/cliente/beneficiarios', icono: 'fa-users', texto: 'Beneficiarios' }
        ]
      },
      operador: {
        titulo: 'Panel Operativo',
        subtitulo: 'Gestión de operaciones',
        menuItems: [
          { ruta: '/operador/remesas-pendientes', icono: 'fa-clock', texto: 'Remesas Pendientes' },
          { ruta: '/operador/procesar-remesas', icono: 'fa-tasks', texto: 'Procesar Remesas' },
          { ruta: '/operador/historial', icono: 'fa-history', texto: 'Historial' }
        ]
      },
      gerente: {
        titulo: 'Panel Gerencial',
        subtitulo: 'Gestión administrativa',
        menuItems: [
          { ruta: '/gerente/dashboard', icono: 'fa-chart-line', texto: 'Dashboard' },
          { ruta: '/gerente/operadores', icono: 'fa-users-cog', texto: 'Operadores' },
          { ruta: '/gerente/reportes', icono: 'fa-file-alt', texto: 'Reportes' }
        ]
      }
    }
  }),
  
  getters: {
    configuracionActual: (state) => state.configuracion[state.rol],
    esCliente: (state) => state.rol === 'cliente',
    esOperador: (state) => state.rol === 'operador',
    esGerente: (state) => state.rol === 'gerente'
  },
  
  actions: {
    cambiarRol(nuevoRol) {
      this.rol = nuevoRol
    }
  }
}) 