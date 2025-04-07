import { createRouter, createWebHistory } from 'vue-router'
import P_cliente from './paginas/cliente/P_cliente.vue'
import MisRemesas from './paginas/cliente/MisRemesas.vue'
import Beneficiarios from './paginas/cliente/Beneficiarios.vue'
import Soporte from './paginas/cliente/Soporte.vue'
import Contacto from './paginas/cliente/Contacto.vue'

// Definición de rutas
const routes = [
  {
    path: '/',
    redirect: '/cliente'
  },
  {
    path: '/cliente',
    name: 'Cliente',
    component: P_cliente,
    children: [
      {
        path: '',
        name: 'ClienteDefault',
        component: MisRemesas
      },
      {
        path: 'mis-remesas',
        name: 'MisRemesas',
        component: MisRemesas
      },
      {
        path: 'beneficiarios',
        name: 'Beneficiarios',
        component: Beneficiarios
      },
      {
        path: 'soporte',
        name: 'Soporte',
        component: Soporte
      },
      {
        path: 'contacto',
        name: 'Contacto',
        component: Contacto
      }
    ]
  },
  {
    path: '/mis-remesas',
    redirect: '/cliente/mis-remesas'
  },
  {
    path: '/beneficiarios',
    redirect: '/cliente/beneficiarios'
  },
  {
    path: '/soporte',
    redirect: '/cliente/soporte'
  },
  {
    path: '/contacto',
    redirect: '/cliente/contacto'
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('./paginas/cliente/FAQ.vue')
  },
  {
    path: '/mensajes',
    name: 'Mensajes',
    component: () => import('./paginas/cliente/Mensajes.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('./paginas/cliente/Blog.vue')
  },
  {
    path: '/mi-cuenta',
    name: 'MiCuenta',
    component: () => import('./paginas/cliente/MiCuenta.vue')
  }
]

// Crear instancia del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 