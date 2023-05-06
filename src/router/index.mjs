import { createRouter, createWebHistory } from 'vue-router'
import start1 from '../views/start1.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start1',
      component: start1
    }
  ]
})

export default router
