import { createRouter, createWebHistory } from 'vue-router'
import files from '../views/files.vue'
import home from '../views/home.vue'
import images from '../views/pictures.vue'
import videos from '../views/videos.vue'
import musics from '../views/musics.vue'
import works from '../views/works.vue'
import books from '../views/books.vue'
import search from '../views/search.vue'
import lang from '../views/lang.vue'
import crypt from '../views/crypt.vue'
import code from '../views/code.vue'
import poligon from '../views/poligon.vue'
import chat from '../views/chat.vue'
import settings from '../views/settings.vue'
import chemistry from '../views/chemistry.vue'



const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {path: '/g/files'},
      component: home
    },
    {
      path: '/g/lang',
      name: 'lang',
      component: lang
    },
    {
      path: '/g/chemistry',
      name: 'chemistry',
      component: chemistry
    },
    
    {
      path: '/g/chat',
      name: 'chat',
      component: chat
    },
    {
      path: '/g/settings',
      name: 'settings',
      component: settings
    }
    ,
    {
      path: '/g/books',
      name: 'books',
      component: books
    },
    {
      path: '/g/poligon',
      name: 'poligon',
      component: poligon
    },
    {
      path: '/g/crypt',
      name: 'crypt',
      component: crypt
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
      path: '/g/code',
      name: 'code',
      component: code
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
