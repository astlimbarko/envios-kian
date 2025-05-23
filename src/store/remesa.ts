import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Pais {
  nombre: string
  codigo: string
  moneda: string
  bandera: string
}

interface CuentaBancaria {
  titular: string
  ci: string
  complemento?: string
  banco: string
  numeroCuenta: string
  tipoCuenta: string
  sucursal: string
}

interface DatosTransaccion {
  montoEnviar: string
  montoRecibir: string
  tipoCambio: string
  pais: Pais
}

interface DatosRecepcion {
  tipo: 'qr' | 'banco'
  nombreBeneficiario: string
  cuenta?: CuentaBancaria
}

interface DatosPago {
  tipo: 'swish' | 'banco'
  numero?: string
  referencia?: string
  banco?: string
  cuenta?: string
  swift?: string
  titular?: string
  comprobante?: File
}

interface RemesaState {
  pasoActual: number
  datosCompletos: boolean
  resumenVisible: boolean
  transaccion: DatosTransaccion
  recepcion: DatosRecepcion
  pago: DatosPago
}

export const useRemesaStore = defineStore('remesa', () => {
  // Estado
  const estado = ref<RemesaState>({
    pasoActual: 1,
    datosCompletos: false,
    resumenVisible: false,
    transaccion: {
      montoEnviar: '',
      montoRecibir: '',
      tipoCambio: '',
      pais: {
        nombre: '',
        codigo: '',
        moneda: '',
        bandera: ''
      }
    },
    recepcion: {
      tipo: 'qr',
      nombreBeneficiario: ''
    },
    pago: {
      tipo: 'swish'
    }
  })

  // Getters
  const datosValidos = computed(() => {
    const transaccionValida = validarTransaccion(estado.value.transaccion)
    const recepcionValida = validarRecepcion(estado.value.recepcion)
    const pagoValido = validarPago(estado.value.pago)
    
    return transaccionValida && recepcionValida && pagoValido
  })

  // Acciones
  function setPasoActual(paso: number) {
    estado.value.pasoActual = paso
  }

  function actualizarTransaccion(datos: Partial<DatosTransaccion>) {
    estado.value.transaccion = { ...estado.value.transaccion, ...datos }
    validarEstadoCompleto()
  }

  function actualizarRecepcion(datos: Partial<DatosRecepcion>) {
    estado.value.recepcion = { ...estado.value.recepcion, ...datos }
    validarEstadoCompleto()
  }

  function actualizarPago(datos: Partial<DatosPago>) {
    estado.value.pago = { ...estado.value.pago, ...datos }
    validarEstadoCompleto()
  }

  function setResumenVisible(visible: boolean) {
    estado.value.resumenVisible = visible
  }

  function validarEstadoCompleto() {
    console.log('Validando estado completo')
    estado.value.datosCompletos = datosValidos.value
    console.log('Estado completo:', estado.value.datosCompletos)
  }

  function resetearEstado() {
    estado.value = {
      pasoActual: 1,
      datosCompletos: false,
      resumenVisible: false,
      transaccion: {
        montoEnviar: '',
        montoRecibir: '',
        tipoCambio: '',
        pais: {
          nombre: '',
          codigo: '',
          moneda: '',
          bandera: ''
        }
      },
      recepcion: {
        tipo: 'qr',
        nombreBeneficiario: ''
      },
      pago: {
        tipo: 'swish'
      }
    }
  }

  // Funciones de validación
  function validarTransaccion(datos: DatosTransaccion): boolean {
    console.log('Validando transacción:', datos)
    const valido = Boolean(
      datos.montoEnviar &&
      datos.montoRecibir &&
      datos.tipoCambio &&
      datos.pais.nombre
    )
    console.log('Transacción válida:', valido)
    return valido
  }

  function validarRecepcion(datos: DatosRecepcion): boolean {
    console.log('Validando recepción:', datos)
    let valido = false
    if (datos.tipo === 'qr') {
      valido = Boolean(datos.nombreBeneficiario)
    } else {
      valido = Boolean(
        datos.cuenta &&
        datos.cuenta.titular &&
        datos.cuenta.banco &&
        datos.cuenta.numeroCuenta
      )
    }
    console.log('Recepción válida:', valido)
    return valido
  }

  function validarPago(datos: DatosPago): boolean {
    console.log('Validando pago:', datos)
    let valido = false
    if (datos.tipo === 'swish') {
      valido = Boolean(datos.numero && datos.referencia)
    } else {
      valido = Boolean(
        datos.banco &&
        datos.cuenta &&
        datos.swift &&
        datos.titular
      )
    }
    console.log('Pago válido:', valido)
    return valido
  }

  return {
    estado,
    datosValidos,
    setPasoActual,
    actualizarTransaccion,
    actualizarRecepcion,
    actualizarPago,
    setResumenVisible,
    resetearEstado
  }
}) 