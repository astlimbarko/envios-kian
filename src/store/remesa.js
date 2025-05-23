import { defineStore } from 'pinia'
import { watch } from 'vue'

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
      let esValido = false

      if (tipo === 'qr') {
        esValido = !!nombreBeneficiario
      } else if (tipo === 'cuenta') {
        esValido = !!cuenta && !!cuenta.titular && !!cuenta.banco && !!cuenta.numeroCuenta
      }

      this.validacion.recepcion = esValido
      console.log('Store: Validación de recepción:', esValido)
      this.actualizarResumen()
    },

    validarPago() {
      const { tipo } = this.estado.pago
      this.validacion.pago = !!tipo
      console.log('Store: Validación de pago:', this.validacion.pago)
      this.actualizarResumen()
    },

    // Inicializar watchers
    inicializarWatchers() {
      // Watch para recepción
      watch(() => this.estado.recepcion, (nuevoValor) => {
        console.log('Store: Cambios detectados en recepción:', nuevoValor)
        this.validarRecepcion()
        this.actualizarResumen()
      }, { deep: true })

      // Watch para pago
      watch(() => this.estado.pago, (nuevoValor) => {
        console.log('Store: Cambios detectados en pago:', nuevoValor)
        this.validarPago()
        this.actualizarResumen()
      }, { deep: true })
    },

    // Actualizar visibilidad del resumen
    actualizarResumen() {
      const todosValidos = this.validacion.transaccion && 
                          this.validacion.recepcion && 
                          this.validacion.pago
      console.log('Store: Actualizando visibilidad del resumen a', todosValidos)
      this.resumenVisible = todosValidos
    }
  }
}) 