import { createRouter, createWebHistory } from 'vue-router'
import P_cliente from '../paginas/cliente/P_cliente.vue'
import MisRemesas from '../paginas/cliente/NuevaRemesa.vue' // Intercambiado
import Beneficiarios from '../paginas/cliente/Beneficiarios.vue'
import Soporte from '../paginas/cliente/Soporte.vue'
import Contacto from '../paginas/cliente/Contacto.vue'
import NuevaRemesa from '../paginas/cliente/MisRemesas.vue' // Intercambiado

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
        component: MisRemesas // Ahora es NuevaRemesa.vue
      },
      {
        path: 'mis-remesas',
        name: 'MisRemesas',
        component: MisRemesas // Ahora es NuevaRemesa.vue
      },
      {
        path: 'nueva-remesa',
        name: 'NuevaRemesa',
        component: NuevaRemesa // Ahora es MisRemesas.vue
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
    component: () => import('../paginas/cliente/FAQ.vue')
  },
  {
    path: '/mensajes',
    name: 'Mensajes',
    component: () => import('../paginas/cliente/Mensajes.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../paginas/cliente/Blog.vue')
  },
  {
    path: '/mi-cuenta',
    name: 'MiCuenta',
    component: () => import('../paginas/cliente/MiCuenta.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../paginas/cliente/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../paginas/admin/Admin.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/remesas'
      },
      {
        path: 'remesas',
        name: 'AdminRemesas',
        component: () => import('../paginas/admin/AdminRemesas.vue')
      },
      {
        path: 'usuarios',
        name: 'AdminUsuarios',
        component: () => import('../paginas/admin/AdminUsuarios.vue')
      },
      {
        path: 'perfil',
        name: 'AdminPerfil',
        component: () => import('../paginas/admin/AdminPerfil.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
