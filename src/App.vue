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
    <div class="content-header" v-if="!show_signup_login">

      <nav :class="{ 'navbar navbar-expand-lg navbar-light border-bottom': true, 'bg-body-tertiary': (dark) }">
        <div :class="{'container-fluid': (mode_container), 'container': (!mode_container)}">
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
                  <li class=""><router-link class="dropdown-item" to="/g/crypt">Шифрование</router-link></li>
                  <!-- <li><router-link class="dropdown-item" to="/g/code">Программирование</router-link></li> -->
                  <!-- <li><router-link class="dropdown-item" to="/g/poligon">Полигон</router-link></li> -->
                  <li class=""><router-link class="dropdown-item" to="/g/chat">Чат</router-link></li>
                  <li class=""><router-link class="dropdown-item" to="/g/chemistry">Химия</router-link></li>
                  <li class=""><router-link class="dropdown-item" to="/g/gists">Gists</router-link></li>
                  <li class=""><router-link class="dropdown-item" to="/g/settings">Настройки</router-link></li>

                </ul>
              </li>


              <li class="nav-item" >
                <router-link class="nav-link" to="/g/lang">Учебники</router-link>
              </li>
              <li class="nav-item">
                <!-- <router-link class="nav-link" to="/g/lang">Учебники</router-link> -->
                <router-link class="nav-link" to="/g/videos">Видео</router-link>
              </li>
  
              <li v-if="show_signup_login " class="nav-item">
                <router-link to="/g/login" tag="button" class="nav-link">Войти</router-link>
              </li>
              <li v-if="!show_signup_login" class="nav-item">
                <button class="nav-link" @click="logout1">Выйти</button>
              </li>
              
              <li v-if="show_signup_login " class="nav-item">
                <router-link to="/g/signup" class="nav-link">Создать аккаунт</router-link>
              </li>


            </ul>

            <div class="d-flex">
              <input 
                class="form-control me-2 p-0 ps-1 bg-selected" 
                type="search" 
                placeholder="Search" 
                aria-label="Search" 
                v-model="word">
              <button class="btn btn-sm btn-outline-danger" type="submit">Search</button>
            </div>


          </div>
        </div>
      </nav>
    </div>
  </header>
  <main :class="{'container-fluid': (mode_container), 'container': (!mode_container)}">
    <RouterView 
      :wait="wait" 
      :theme="dark" 
      :word="word" 
      @updateColor="someFunc" 
      @change_container_mode="changeContainerMode"
      @toggle_random_words="toggleRandomWords" 
      @login="login_func" />

  </main>

  <footer class="mt-auto border-top " v-if="!show_signup_login">
    <div :class="{'container-fluid': (mode_container), 'container': (!mode_container)}">
      <div class="row py-2">
        <div class="col my-footer">
          <div class="d-flex flex-column ">
            <div class=""><u>Version:</u> {{ current_version }}</div>
            <div class=""><u>Authors:</u> {{ authors }}</div>
            <div class=""><u>Stackoverflow:</u> <a :href="stackoverflow">{{ stackoverflow }}</a></div>
            <div class=""><u>Github:</u> {{ github }}</div>
          </div>
        </div>
        <!-- <div class="col-sm-12 my-footer">
          <div class="d-flex flex-column ">
            <div class=""><u>Английский:</u> {{ g_random[1] }}</div>
            <div class=""><u>Японский:</u> {{ g_random[2] }}</div>
            <div class=""><u>Немецкий:</u> {{ g_random[3] }}</div>
            <div class=""><u>Корейский:</u> {{ g_random[4] }}</div>
            <div class=""><u>Китайский:</u> {{ g_random[5] }}</div>
          </div>
        </div> -->
      </div>

    </div>
  </footer>

</template>

<style scoped>

.btn-footer {
  background-color: darkslategray;
  border: 0px solid gray;
  margin-bottom: 4px;
  border-radius: 10px;
  font-size: 13px;
}
.btn-footer:hover {
  background-color: aquamarine;
  color: black;
}
.bg-selected {
  background-color: black;
}
.bg-selected:focus {
  background-color: black;
}
.my-footer {
  font-size: 15px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  color: rgb(131, 131, 131);
}
.names_services {
  text-decoration: underline;
}
.btn-sm:hover {
  background-color: rgb(67, 63, 56);
}
.btn-outline-danger {
  border-color: rgb(0, 0, 0);
}


.navbr {
  padding: 0 !important; 
  height: 25px;
  align-items: center;
  align-content: center;
}



*:focus {
  box-shadow: none !important;
}

.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: green!important;
}


/* .form-check-input .custom-checkbox .custom-control-input:checked:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 255, 0, 0.25)
}
.form-check-input .custom-checkbox .custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 0, 0, 0.25)
}
.form-check-input .custom-checkbox .custom-control-input:active ~ .custom-control-label::before {
  background-color: #C8FFC8; 
} */



</style>


<script>
export default {
  data() {
    return {
      wait: false,
      dark: false,
      current_version: '3.4.5',
      authors: 'Арамилев Захар',
      stackoverflow: 'https://ru.stackoverflow.com/users/486286/onez9',
      github: 'https://github.com/onez9',
      logout: false,
      color_header: '#ffffff',
      scroll: 0,
      word: '',
      g_random: '',
      interval_random: '',
      mode_container: false,
      run_interval_mode: false,
      show_signup_login: false,
    }
  },
  watch: {
    run_interval_mode() {
      console.log('Я выполнюсь или нет')
      if (this.run_interval_mode == true) {
        this.run_setIntervl()

      } else {
        clearInterval(this.interval_random);
      }



    }
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

    if (window.localStorage.getItem('mode_container') == null) {
      window.localStorage.setItem('mode_container', this.mode_container)
    } else {
      this.mode_container = JSON.parse(window.localStorage.getItem('mode_container'))
    }

    if (JSON.parse(window.localStorage.getItem('user_info'))?.login == undefined) {
      this.show_signup_login = true; 
    } else {
      this.show_signup_login = false;
      // await this.run_setIntervl()
    }
    console.log(this.dark)
    console.log(import.meta.env.VITE_TEST_VAR)
    console.log(import.meta.env.VITE_APP_F23)
    console.log(import.meta.env.VITE_HOST)
    console.log(import.meta.env.VITE_PORT)

  },

  methods: {
    async login_func(obj) {
      if (obj['answer']=='success') {
        this.show_signup_login = false;
      } else {
        this.show_signup_login = true;
      }
    },
    async run_setIntervl() {
      clearInterval(this.interval_random);
        this.interval_random = setInterval(() => {
          fetch('/books/r/words', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': window.localStorage.getItem('jwt'),
            }
          })
          .then(res => res.json())
          .then(result => {
            this.g_random = result
          })
        }, 1000);
    },
    async start() {
      document.addEventListener('scroll', (event) => {
        // if (window.scrollY ) {
        console.log(window.scrollY)
        this.scroll = window.scrollY
        // window.scrollY %= 768

        // }
      })
    },
    async someFunc(obj) {
      this.dark = !obj['theme']


      console.log(this.dark)
      console.log(obj)

    },

    async toggleRandomWords(obj) {
      console.log(obj);
      this.run_interval_mode = obj['run_interval_mode'];
    },
    async changeContainerMode(obj) {
      this.mode_container = !obj['mc']
      window.localStorage.setItem('mode_container', this.mode_container);
    },

    async logout1() {
      console.log('Включение метода logout...')
      this.my_name = ""
      this.logout = false
      this.show_signup_login = true
      clearInterval(this.interval_random);
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


