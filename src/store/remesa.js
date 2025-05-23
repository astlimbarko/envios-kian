import { defineStore } from 'pinia'

export const useRemesaStore = defineStore('remesa', {
  state: () => ({
    pasoActual: 1,
    resumenVisible: false,
    pasosVisibles: {
      recepcion: true,
      pago: true,
      resumen: true
    },
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
    },
    datosTransaccion: (state) => ({
      ...state.estado.transaccion,
      montoEnviarFormateado: new Intl.NumberFormat('es-ES').format(state.estado.transaccion.montoEnviar),
      montoRecibirFormateado: new Intl.NumberFormat('es-ES').format(state.estado.transaccion.montoRecibir)
    }),
    datosRecepcion: (state) => ({
      ...state.estado.recepcion,
      tipoFormateado: state.estado.recepcion.tipo === 'qr' ? 'Código QR' : 'Cuenta Bancaria',
      detallesCompletos: state.estado.recepcion.tipo === 'qr' 
        ? !!state.estado.recepcion.nombreBeneficiario
        : !!state.estado.recepcion.cuenta?.titular && !!state.estado.recepcion.cuenta?.banco
    }),
    datosPago: (state) => ({
      ...state.estado.pago,
      tipoFormateado: state.estado.pago.tipo === 'swish' ? 'Swish' : 'Transferencia Bancaria'
    })
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
      this.validacion.transaccion = !!(montoEnviar > 0 && montoRecibir > 0 && tipoCambio > 0 && pais?.nombre)
      console.log('Store: Validación de transacción:', this.validacion.transaccion)
    },

    validarRecepcion() {
      const { tipo, nombreBeneficiario, cuenta } = this.estado.recepcion
      if (tipo === 'qr') {
        this.validacion.recepcion = !!nombreBeneficiario
      } else if (tipo === 'cuenta') {
        this.validacion.recepcion = !!cuenta && !!cuenta.titular && !!cuenta.banco
      } else {
        this.validacion.recepcion = false
      }
      console.log('Store: Validación de recepción:', this.validacion.recepcion)
    },

    validarPago() {
      const { tipo } = this.estado.pago
      this.validacion.pago = !!tipo
      console.log('Store: Validación de pago:', this.validacion.pago)
    },

    resetearPasosSiguientes(pasoActual) {
      console.log('Store: Reseteando pasos después del paso', pasoActual)
      
      // Resetear validaciones y estados de los pasos siguientes
      if (pasoActual <= 2) {
        this.validacion.recepcion = false
        this.validacion.pago = false
        this.estado.recepcion = {
          tipo: null,
          nombreBeneficiario: null,
          cuenta: null
        }
        this.estado.pago = {
          tipo: null
        }
        this.pasosVisibles.recepcion = true
        this.pasosVisibles.pago = false
        this.pasosVisibles.resumen = false
      }
      
      if (pasoActual <= 3) {
        this.validacion.pago = false
        this.estado.pago = {
          tipo: null
        }
        this.pasosVisibles.pago = true
        this.pasosVisibles.resumen = false
      }
      
      // Actualizar paso actual
      this.pasoActual = pasoActual
      console.log('Store: Estado actualizado:', {
        pasoActual: this.pasoActual,
        pasosVisibles: this.pasosVisibles
      })
    }
  }
}) 