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
        <div class="container-fluid">
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
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Основные разделы</a>
                <ul class="dropdown-menu dropdown-menu-dark">
                  <!-- <li><router-link class="dropdown-item" to="/g/images">Картинки</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/videos">Видео</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/musics">Музыка</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/books">Книги</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/works">Работа</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/lang">Учебники</router-link></li> -->
                  <li><router-link class="dropdown-item" to="/g/crypt">Шифрование</router-link></li>
                  <!-- <li><router-link class="dropdown-item" to="/g/code">Программирование</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/poligon">Полигон</router-link></li> -->
                  <li><router-link class="dropdown-item" to="/g/chat">Чат</router-link></li>
                  <li><router-link class="dropdown-item" to="/g/chemistry">Химия</router-link></li>
                  <li><router-link class="dropdown-item" to="/g/settings">Настройки</router-link></li>

                </ul>
              </li>


              <li class="nav-item">
                <router-link class="nav-link" to="/g/lang">Учебники</router-link>
              </li>
              <li class="nav-item">
                <!-- <router-link class="nav-link" to="/g/lang">Учебники</router-link> -->
                <li><router-link class="nav-link" to="/g/videos">Видео</router-link></li>
              </li>
  
              <li>
                <router-link to="/g/login" tag="button" class="nav-link">Войти</router-link>
              </li>
              <li class=""><button class="nav-link" @click="logout1">Выйти</button></li>
              <li class="">
                <router-link to="/g/signup" class="nav-link">Создать аккаунт</router-link>
              </li>


            </ul>



            <div class="d-flex ">
              <div class="input-group input-group-sm me-1">
                <!-- <span class="input-group-text" id=""><i class="bi bi-search"></i></span> -->
                <!-- <input type="text" placeholder="" class="form-control" v-on:input="searching" v-model="name"> -->
                <!-- <button class="btn btn-sm btn-outline-danger" to="/g/login">Log in</button> -->

              </div>

            </div>

          </div>
        </div>
      </nav>
    </div>
  </header>
  <main class="container-fluid">
    <RouterView :wait="wait" :theme="dark" @updateParent="someFunc" />

  </main>

  <footer class="mt-auto border-top ">
    <div class="container">
      <div class="row">
        <div class="col">
          <p class="text-center p-0 m-0">Version: {{ current_version }}</p>
        </div>

      </div>

    </div>
  </footer>

</template>

<style scoped>
.btn-sm:hover {
  background-color: orange;
}
</style>


<script>
export default {
  data() {
    return {
      wait: false,
      dark: false,
      current_version: '3.0.1',
      logout: false,
      color_header: '#ffffff',
    }
  },
  watch: {

  },
  components: {
  },

  async mounted() {
    // console.log(process.env)

    if (window.localStorage.getItem('color_header') == null) {
      window.localStorage.setItem('color_header', this.color_header)
    } else {
      this.color_header = window.localStorage.getItem('color_header')
    }

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
    },


    async logout1() {
      console.log('Включение метода logout...')
      this.my_name = ""
      this.logout = false
      window.localStorage.clear()
      // const response = await fetch(`${this.url}/logout`)
      const response = await fetch('/users/log1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({123:123})
      })
      let result = await response.json()
      console.log(result)
      this.$router.push({path: '/g/login'})
    },
  }

}

</script>


