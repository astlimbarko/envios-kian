import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRemesaStore = defineStore('remesa', () => {
  // Estado
  const estado = ref({
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
    },
    validacion: {
      transaccion: false,
      recepcion: false,
      pago: false
    },
    remesas: []
  })

  // Getters
  const datosValidos = computed(() => {
    return estado.value.validacion.transaccion && 
           estado.value.validacion.recepcion && 
           estado.value.validacion.pago
  })

  const datosTransaccion = computed(() => ({
    ...estado.value.transaccion,
    montoEnviarFormateado: new Intl.NumberFormat('es-ES').format(estado.value.transaccion.montoEnviar),
    montoRecibirFormateado: new Intl.NumberFormat('es-ES').format(estado.value.transaccion.montoRecibir)
  }))

  const datosRecepcion = computed(() => ({
    ...estado.value.recepcion,
    tipoFormateado: estado.value.recepcion.tipo === 'qr' ? 'Código QR' : 'Cuenta Bancaria',
    detallesCompletos: estado.value.recepcion.tipo === 'qr' 
      ? !!estado.value.recepcion.nombreBeneficiario
      : !!estado.value.recepcion.cuenta?.titular && !!estado.value.recepcion.cuenta?.banco
  }))

  const datosPago = computed(() => ({
    ...estado.value.pago,
    tipoFormateado: estado.value.pago.tipo === 'swish' ? 'Swish' : 'Transferencia Bancaria'
  }))

  const remesasEnProceso = computed(() => estado.value.remesas.filter(r => r.status === 'En Progreso'))
  const remesasAnteriores = computed(() => estado.value.remesas.filter(r => r.status !== 'En Progreso'))

  // Acciones
  function setPasoActual(paso) {
    console.log('Store: Actualizando paso a', paso)
    estado.value.pasoActual = paso
  }

  function setResumenVisible(visible) {
    console.log('Store: Actualizando visibilidad del resumen a', visible)
    estado.value.resumenVisible = visible
  }

  function actualizarTransaccion(datos) {
    console.log('Store: Actualizando transacción con datos:', datos)
    estado.value.transaccion = { ...estado.value.transaccion, ...datos }
    validarTransaccion()
  }

  function actualizarRecepcion(datos) {
    console.log('Store: Actualizando recepción con datos:', datos)
    estado.value.recepcion = { ...estado.value.recepcion, ...datos }
    validarRecepcion()
  }

  function actualizarPago(datos) {
    console.log('Store: Actualizando pago con datos:', datos)
    estado.value.pago = { ...estado.value.pago, ...datos }
    validarPago()
  }

  function validarTransaccion() {
    const { montoEnviar, montoRecibir, tipoCambio, pais } = estado.value.transaccion
    estado.value.validacion.transaccion = !!(montoEnviar > 0 && montoRecibir > 0 && tipoCambio > 0 && pais?.nombre)
    console.log('Store: Validación de transacción:', estado.value.validacion.transaccion)
  }

  function validarRecepcion() {
    const { tipo, nombreBeneficiario, cuenta } = estado.value.recepcion
    if (tipo === 'qr') {
      estado.value.validacion.recepcion = !!nombreBeneficiario
    } else if (tipo === 'cuenta') {
      estado.value.validacion.recepcion = !!cuenta && !!cuenta.titular && !!cuenta.banco
    } else {
      estado.value.validacion.recepcion = false
    }
    console.log('Store: Validación de recepción:', estado.value.validacion.recepcion)
  }

  function validarPago() {
    const { tipo } = estado.value.pago
    estado.value.validacion.pago = !!tipo
    console.log('Store: Validación de pago:', estado.value.validacion.pago)
  }

  function resetearPasosSiguientes(pasoActual) {
    console.log('Store: Reseteando pasos después del paso', pasoActual)
    if (pasoActual < 2) {
      estado.value.recepcion = {
        tipo: 'qr',
        nombreBeneficiario: ''
      }
      estado.value.validacion.recepcion = false
    }
    if (pasoActual < 3) {
      estado.value.pago = {
        tipo: 'swish'
      }
      estado.value.validacion.pago = false
    }
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
      },
      validacion: {
        transaccion: false,
        recepcion: false,
        pago: false
      },
      remesas: []
    }
  }

  return {
    estado,
    datosValidos,
    datosTransaccion,
    datosRecepcion,
    datosPago,
    remesasEnProceso,
    remesasAnteriores,
    setPasoActual,
    actualizarTransaccion,
    actualizarRecepcion,
    actualizarPago,
    setResumenVisible,
    resetearEstado,
    resetearPasosSiguientes
  }
}) 