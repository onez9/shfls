import { createRouter, createWebHistory } from 'vue-router'
import files from '../views/files.vue'
import home from '../views/home.vue'
import images from '../views/pictures.vue'
import videos from '../views/videos.vue'
import musics from '../views/musics.vue'
import works from '../views/works.vue'
import books from '../views/books.vue'
import search from '../views/search.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {path: '/g/files'},
      component: home
    },
    {
      path: '/g/books',
      name: 'books',
      component: books
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
    },
    {
      path: '/g/works',
      name: 'works',
      component: works
    },
    {
      path: '/g/search',
      name: 'search',
      component: search
    }
  ]
})

export default router
