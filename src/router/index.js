import { createRouter, createWebHistory } from 'vue-router'
import { useRolStore } from '../stores/rolStore'

// Importar componentes
import Puerta from '../paginas/login/puerta.vue'
import P_cliente from '../paginas/cliente/P_cliente.vue'
import P_operador from '../paginas/operador/P_operador.vue'
import P_gerente from '../paginas/gerente/P_gerente.vue'
import MisRemesas from '../paginas/cliente/MisRemesas.vue'
import Beneficiarios from '../paginas/cliente/Beneficiarios.vue'
import NuevaRemesa from '../paginas/cliente/NuevaRemesa.vue'
import Soporte from '../paginas/cliente/Soporte.vue'
import MiCuenta from '../paginas/cliente/MiCuenta.vue'
import FAQ from '../paginas/cliente/FAQ.vue'
import Contacto from '../paginas/cliente/Contacto.vue'
import Blog from '../paginas/cliente/Blog.vue'

// Componentes del módulo operador
import Operador_de_remesas from '../paginas/operador/Operador_de_remesas.vue'
import Operador_beneficiarios from '../paginas/operador/Operador_beneficiarios.vue'
import Operador_usuarios from '../paginas/operador/Operador_usuarios.vue'
import Operador_soporte from '../paginas/operador/Operador_soporte.vue'
import Operador_historial from '../paginas/operador/Operador_historial.vue'
import Operador_Configuracion from '../paginas/operador/Operador_Configuracion.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'puerta',
      component: Puerta
    },
    {
      path: '/operador',
      component: P_operador,
      meta: { requiresAuth: true, role: 'operador' },
      children: [
        {
          path: '',
          redirect: '/operador/remesas'
        },
        {
          path: 'remesas',
          name: 'operador-remesas',
          component: Operador_de_remesas
        },
        {
          path: 'beneficiarios',
          name: 'operador-beneficiarios',
          component: Operador_beneficiarios
        },
        {
          path: 'usuarios',
          name: 'operador-usuarios',
          component: Operador_usuarios
        },
        {
          path: 'soporte',
          name: 'operador-soporte',
          component: Operador_soporte
        },
        {
          path: 'historial',
          name: 'operador-historial',
          component: Operador_historial
        },
        {
          path: 'configuracion',
          name: 'operador-configuracion',
          component: Operador_Configuracion
        }
      ]
    },
    {
      path: '/cliente',
      component: P_cliente,
      meta: { requiresAuth: true, role: 'cliente' },
      children: [
        {
          path: '',
          name: 'Cliente',
          redirect: '/cliente/nueva-remesa'
        },
        {
          path: 'remesas',
          name: 'MisRemesas',
          component: MisRemesas
        },
        {
          path: 'mis-remesas',
          redirect: '/cliente/remesas'
        },
        {
          path: 'beneficiarios',
          name: 'Beneficiarios',
          component: Beneficiarios
        },
        {
          path: 'nueva-remesa',
          name: 'NuevaRemesa',
          component: NuevaRemesa
        },
        {
          path: 'soporte',
          name: 'Soporte',
          component: Soporte
        },
        {
          path: 'mi-cuenta',
          name: 'MiCuenta',
          component: MiCuenta
        },
        {
          path: 'faq',
          name: 'FAQ',
          component: FAQ
        },
        {
          path: 'contacto',
          name: 'Contacto',
          component: Contacto
        },
        {
          path: 'blog',
          name: 'Blog',
          component: Blog
        }
      ]
    },
    {
      path: '/gerente',
      component: P_gerente,
      meta: { requiresAuth: true, role: 'gerente' },
      children: [
        // ... rutas del gerente ...
      ]
    },
    // Redirecciones globales
    {
      path: '/faq',
      redirect: '/cliente/faq'
    },
    {
      path: '/blog',
      redirect: '/cliente/blog'
    }
  ]
})

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const rolStore = useRolStore()
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Verificar si el rol coincide
    if (to.meta.role && to.meta.role !== rolStore.rol) {
      // Si no coincide, redirigir a la puerta
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
