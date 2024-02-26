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
import login from '../views/login.vue'
import signup from '../views/signup.vue'
import gists from '../views/gists.vue'
import Swal from 'sweetalert2'



const router = createRouter({
  //history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   redirect: {path: '/g/files'},
    //   component: home,
    //   meta: { 
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/',
      name: 'home',
      component: home,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/gists',
      name: 'gists',
      component: gists,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/lang',
      name: 'lang',
      component: lang,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/chemistry',
      name: 'chemistry',
      component: chemistry,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/login',
      name: 'login',
      component: login,
      meta: {
        guest: true
      }
    }, 
    {
      path: '/g/signup',
      name: 'signup',
      component: signup,
      meta: { 
        guest: true
      }
    }, 
    {
      path: '/g/chat',
      name: 'chat',
      component: chat,
      meta: { 
        guest: true
      }
    },
    {
      path: '/g/settings',
      name: 'settings',
      component: settings,
      meta: { 
        requiresAuth: true
      }

    }
    ,
    {
      path: '/g/books',
      name: 'books',
      component: books,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/poligon',
      name: 'poligon',
      component: poligon,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/crypt',
      name: 'crypt',
      component: crypt,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/files',
      name: 'files1',
      component: files,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/images',
      name: 'images',
      component: images,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/videos',
      name: 'videos',
      component: videos,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/musics',
      name: 'musics',
      component: musics,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/code',
      name: 'code',
      component: code,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/works',
      name: 'works',
      component: works,
      meta: { 
        requiresAuth: true
      }
    },
    {
      path: '/g/search',
      name: 'search',
      component: search,
      meta: { 
        requiresAuth: true
      }
    }
  ]
})


// Глобальные навигационные хуки вызываются в порядке их создания при каждом навигационном переходе.
router.beforeEach((to, from, next) => {
  
  
  console.log('to: ',to.matched)
  console.log('from: ',from)
  console.log('next: ',next)
  console.log('это localStorage: ', localStorage)
  let res = to.matched.some(record => {
    console.log('какое-то рекорд: ', record)
    console.log('это тру или фолсу: ', record.meta.requiresAuth)


    
    
    
    return record.meta.requiresAuth
  })



  if (res) { // есить ли те у кого требуется права админа т.е. такие маршруты есть для которых требуется авторризация
    if (localStorage.getItem('jwt') == null) { // если jwt равен нуля или undefined - на логин панель
      next({
        path: '/g/login',
        params: { nextUrl: to.fullPath }
      })
      Swal.fire('Авторизуйтесь пожалуйста')
    } else {
      console.log('get localStorage: ', localStorage.getItem('user'))
      let user = localStorage.getItem('user')
      // let user = JSON.parse(localStorage.getItem('user'))
      console.log('это user: ', user) // тут мы авторизовались
      // if(to.matched.some(record => record.meta.is_admin)) { // есть ли маршруты, к которым имеют доступ только админы?
      //   if(user.is_admin == 1){ // у нас таких маршрутов нет, поэтому  переходим к части else - "мы обычный пользователь"
      //     alert('мы здесь боги')
      //     next()
      //   } else {
      //     alert('мы здесь не админы')
      //     next({ name: 'start'})
      //   }
      // } else {
      console.log('мы обычный пользователь')
      next()
      // }
    }
  } else if (to.matched.some(record => record.meta.guest)) { // есть ли маршруты для которых нужен доступ гостя
    if (localStorage.getItem('jwt') == null) { // jwt token == null
      // alert('ok jwt == null - маршрут требует права гостя')
      next()
    }
    else{ // jwt есть
      next()
    }
  } else { // нет авторизации
    // alert('ok нет авторизции')
    next() 
  }
})




export default router
