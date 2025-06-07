import { createRouter, createWebHistory } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Puerta',
      component: Puerta
    },
    {
      path: '/cliente',
      component: P_cliente,
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
      path: '/operador',
      name: 'operador',
      component: P_operador,
      meta: { requiresAuth: true, rol: 'operador' }
    },
    {
      path: '/gerente',
      name: 'gerente',
      component: P_gerente,
      meta: { requiresAuth: true, rol: 'gerente' }
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

export default router
