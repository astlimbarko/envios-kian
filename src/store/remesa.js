import { defineStore } from 'pinia'

export const useRemesaStore = defineStore('remesa', {
  state: () => ({
    pasoActual: 1,
    resumenVisible: false,
    estado: {
      transaccion: {
        montoEnviar: 0,
        montoRecibir: 0,
        tipoCambio: 0,
        pais: {
          nombre: 'Bolivia',
          moneda: 'BOB'
        }
      },
      recepcion: {
        tipo: null,
        nombreBeneficiario: null,
        cuenta: null
      },
      pago: {
        tipo: null
      }
    },
    validacion: {
      transaccion: false,
      recepcion: false,
      pago: false
    }
  }),

  getters: {
    datosValidos: (state) => {
      return state.validacion.transaccion && 
             state.validacion.recepcion && 
             state.validacion.pago
    }
  },

  actions: {
    setPasoActual(paso) {
      console.log('Store: Actualizando paso a', paso)
      this.pasoActual = paso
    },

    setResumenVisible(visible) {
      console.log('Store: Actualizando visibilidad del resumen a', visible)
      this.resumenVisible = visible
    },

    actualizarTransaccion(datos) {
      console.log('Store: Actualizando transacción con datos:', datos)
      this.estado.transaccion = {
        ...this.estado.transaccion,
        ...datos
      }
      this.validarTransaccion()
    },

    actualizarRecepcion(datos) {
      console.log('Store: Actualizando recepción con datos:', datos)
      this.estado.recepcion = {
        ...this.estado.recepcion,
        ...datos
      }
      this.validarRecepcion()
    },

    actualizarPago(datos) {
      console.log('Store: Actualizando pago con datos:', datos)
      this.estado.pago = {
        ...this.estado.pago,
        ...datos
      }
      this.validarPago()
    },

    validarTransaccion() {
      const { montoEnviar, montoRecibir, tipoCambio, pais } = this.estado.transaccion
      this.validacion.transaccion = !!(montoEnviar && montoRecibir && tipoCambio && pais)
      console.log('Store: Validación de transacción:', this.validacion.transaccion)
    },

    validarRecepcion() {
      const { tipo, nombreBeneficiario, cuenta } = this.estado.recepcion
      this.validacion.recepcion = !!(tipo && (nombreBeneficiario || cuenta))
      console.log('Store: Validación de recepción:', this.validacion.recepcion)
    },

    validarPago() {
      const { tipo } = this.estado.pago
      this.validacion.pago = !!tipo
      console.log('Store: Validación de pago:', this.validacion.pago)
    }
  }
}) 