import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'
import PacientesView from '@/views/Pacientes/PacientesView.vue'
import PsicologosView from '@/views/Psicologos/PsicologosView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      redirect: '/dashboard/pacientes',
      children: [
        { path: 'pacientes', name: 'pacientes', component: PacientesView },
        { path: 'psicologos', name: 'psicologos', component: PsicologosView },
      ],
    },
  ],
})

export default router
