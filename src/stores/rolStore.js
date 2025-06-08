import { defineStore } from 'pinia'

export const useRolStore = defineStore('rol', {
  state: () => ({
    rol: 'operador' // Valor por defecto
  }),

  actions: {
    setRol(rol) {
      this.rol = rol
    },

    getRol() {
      return this.rol
    }
  }
}) 