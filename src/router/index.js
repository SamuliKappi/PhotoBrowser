import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SinglePhoto from '@/components/SinglePhoto.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/photo/:id',
      name: 'singlePhoto',
      component: SinglePhoto,
      props: (route) => ({id: route.params.id})
    }
    
  ],
})

export default router
