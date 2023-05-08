import { createRouter, createWebHistory } from 'vue-router'
import files from '../views/files.vue'
import home from '../views/home.vue'
import images from '../views/pictures.vue'
import videos from '../views/videos.vue'
import musics from '../views/musics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {path: 'files'},
      component: home
    },
    {
      path: '/g/files',
      name: 'files1',
      component: files
    },
    {
      path: '/g/images',
      name: 'images',
      component: images
    },
    {
      path: '/g/videos',
      name: 'videos',
      component: videos
    },
    {
      path: '/g/musics',
      name: 'musics',
      component: musics
    }
  ]
})

export default router
