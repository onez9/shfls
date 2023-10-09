<script setup>

import { RouterLink, RouterView } from 'vue-router'
// import search from '../Components/search.vue';
// import nv from '../Components/nv.vue'
// import Swal from 'sweetalert2';

</script>



<template>
  <!-- <p>The username to test is <%=process.env.VITE_TEST_VAR %></p> -->
  <!-- <header class="container-fluid p-0">
    <nv :theme="theme" />

  </header> -->
  <header class=" ">
    <div class="content-header">

      <nav :class="{ 'navbar navbar-expand-lg navbar-light border-bottom': true, 'bg-body-tertiary': (dark) }">
        <div class="container">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <!-- {{ dark }} -->
            <ul class="navbar-nav me-auto mb-lg-0">
              <li class="nav-item">
                <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                <router-link class="nav-link" to="/g/files"><i class="bi bi-card-list"></i> Файлы</router-link>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Основные разделы
                </a>
                <!-- <ul class="dropdown-menu dropdown-menu-dark"> -->
                <ul class="dropdown-menu dropdown-menu-dark">

                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/images">
                      <!-- <i class="bi bi-images"></i>  -->
                      Картинки</router-link>
                  </li>
                  <li><router-link class="dropdown-item" to="/g/videos">
                      <!-- <i class="bi bi-play-circle"></i> -->
                      Видео</router-link>
                  </li>
                  <li><router-link class="dropdown-item" to="/g/musics">
                      <!-- <i class="bi bi-music-player"></i> -->
                      Музыка</router-link></li>
                  <li><router-link class="dropdown-item" to="/g/books">
                      <!-- <i class="bi bi-book"></i>  -->
                      Книги</router-link></li>
                  <li><router-link class="dropdown-item" to="/g/works">
                      <!-- <i class="bi bi-person-workspace"></i> -->
                      Работа</router-link></li>
                  <li>
                    <router-link class="dropdown-item" to="/g/lang">
                      Язык</router-link>
                  </li>

                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/crypt">
                      <!-- <i class="bi bi-terminal-fill"></i> -->
                      Шифрование</router-link>
                  </li>
                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/code">
                      <!-- <i class="bi bi-terminal-fill"></i>  -->
                      Программирование</router-link>
                  </li>
                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/poligon">
                      <!-- <i class="bi bi-back"></i>  -->
                      Полигон</router-link>
                  </li>
                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/chat">
                      <!-- <i class="bi bi-chat-dots"></i>  -->
                      Чат</router-link>
                  </li>
                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/chemistry">
                      Химия</router-link>
                  </li>

                  <li>
                    <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                    <router-link class="dropdown-item" to="/g/settings">
                      <!-- <i class="bi bi-gear-wide-connected"></i> -->
                      Настройки</router-link>
                  </li>



                </ul>
              </li>

              <!-- <li class="nav-item mx-5">
                <div class="input-group">
                  <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
                  <input type="text" placeholder="Поиск файлов" class="form-control" v-on:input="searching"
                    v-model="name">
                  <button @click="name = ''; rx_files = files" class="btn btn-sm btn-outline-danger px-3" id=""><i class="bi bi-backspace"></i></button>
                </div>
              </li> -->

            </ul>



            <div class="d-flex">
              <div class="input-group input-group-sm me-1">
                <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
                <input type="text" placeholder="" class="form-control" v-on:input="searching" v-model="name">
                <button class="btn btn-sm btn-outline-info me-1">log in</button>
                <button class="btn btn-sm btn-outline-info">log out</button>
              </div>

            </div>
            <!-- <div class="d-flex">

            </div> -->

          </div>
        </div>
      </nav>
    </div>
  </header>





  <main class="container">
    <RouterView :wait="wait" :theme="dark" @updateParent="someFunc" />

  </main>





  <footer class="mt-auto border-top ">


    <div class="container">
      <div class="row">

        <div class="col">

          <!-- <ul class="nav justify-content-center border-bottom">
              <li class="nav-item mb-2"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
              <li class="nav-item mb-2"><a href="#" class="nav-link px-2 text-muted">About</a></li>
            </ul> -->
          <p class="text-center p-0 m-0">Version: {{ current_version }}</p>
        </div>


      </div>

    </div>
  </footer>

  <!-- <footer>

  </footer> -->
</template>

<style scoped></style>

<script>
// new Vue

// const app = vue.createApp({})
// app.component('button-counter', {
//   data() {
//     return {
//       count: 0
//     }
//   },
//   template: `
//     <button v-on:click="count++">
//       You clicked me {{ count }} times.
//     </button>`
// })
// app.mount('#components-demo')
export default {
  data() {
    return {
      wait: false,
      dark: false,
      current_version: '2.6.3'
    }
  },
  watch: {

  },
  components: {
  },
  // template1: `
  //   <button @click="count++">
  //     You clicked me {{ count }} times.
  //   </button>`,
  // components: {
  //   template1
  // },
  async mounted() {
    // console.log(process.env)
    console.log(this.dark)
    console.log(import.meta.env.VITE_TEST_VAR)
    console.log(import.meta.env.VITE_APP_F23)
    console.log(import.meta.env.VITE_HOST)
    console.log(import.meta.env.VITE_PORT)
  },

  methods: {
    async someFunc(isDark) {
      this.dark = isDark
      console.log(isDark)
    }
  }

}

</script>


