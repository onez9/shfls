<script setup>

// import Swal from 'sweetalert2';
// @/compositions/composition.js;
import { ref } from 'vue';
import axios from 'axios';



import hljs from 'highlight.js'
import HighLight from "vue3-highlight-component";
// import {  } from 'highlight.js/lib/languages/javascript';
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
        
        <div class="d-flex align-items-center border bordered">
          <label class="" for="color_header">Выберете цвет header: </label>
          <input v-model="color_header" id="color_header" type="color" class="">
          
        </div>


        <button 
          class="my-btn"
          @click="upload_settings"
          disabled>Загрузить в бд
          
        </button>

        <button 
          class="my-btn"
          @click="download_settings">Скачать теги из БД
        </button>

        <button 
          class="my-btn"
          @click="change_container_mode">Переключить режим просмотра
        </button>
        <button 
          class="my-btn"
          @click="toggle_random_words">
          Выключить/Включить случайные слова
        </button>




        <button @click="apply_settings(value)" v-for="(value, index) in settings">{{ value }}</button>

        <div class="form-check form-switch mt-2">
          <input @click="change_theme" v-model="theme_current" class="form-check-input form-control" type="checkbox" role="switch"
            id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault"> Тёмная тема</label>
        </div>
        <span for="lang_id">Выберите язык</span>
        <select type="select" v-model="lang_select" name="" id="lang_id" class="form-select mt-2 mb-2">
          <option value="1">Русский</option>
          <option value="2">Английский</option>
          <option value="3">Японский</option>
          <option value="4">Китайский</option>
          <option value="6">Корейский</option>
          <option value="12">Немецкий</option>
        </select>

        <button @click="show_path=!show_path" class="btn btn-outline-primary form-control style_button">Настройка путей</button>
        <div v-if="show_path==true">
          <div class="mb-1 mt-1 input-group">
            <!-- <label for="folder">Select folder</label> -->
            <input placeholder="Путь до видео" class="form-control bg-dark text-white" style="" type="text"
              id="folder" directory multiple />
            <button class="btn btn-outline-warning" @click="">
              Добавить
            </button>
            <!-- <input class="form-control" type="file" webkitdirectory directory multiple/> -->
          </div>
          <div class="mb-1 mt-1 input-group">
            <!-- <label for="folder">Select folder</label> -->
            <input placeholder="Путь до аудио" class="form-control bg-dark text-white" style="" type="text"
              id="folder" directory multiple />
            <button class="btn btn-outline-warning style_button" @click="">
              Добавить
            </button>
            <!-- <input class="form-control" type="file" webkitdirectory directory multiple/> -->
          </div>
          <div class="mb-1 mt-1 input-group">
            <!-- <label for="folder">Select folder</label> -->
            <input placeholder="Путь до фоток" class="form-control bg-dark text-white" style="" type="text"
              id="folder" directory multiple />
            <button class="btn btn-outline-warning style_button" @click="">
              Добавить
            </button>
            <!-- <input class="form-control" type="file" webkitdirectory directory multiple/> -->
          </div>
        </div>

        <div>{{ answer }}</div>

        <button @click="user.settings.mode = !user.settings.mode"
          class="btn btn-outline-primary form-control mt-2 style_button">Настройки пользователя</button>




        <template v-if="user.settings.mode == true" class="mt-2">
          <span for="nick_id">Ник</span>
          <input type="text" placeholder="Your nikname" id="nick_id" class="form-control" v-model="nickname">
          <span for="pass_id">Пароль</span>
          <input type="password" placeholder="password" name="" id="pass_id" class="form-control">
        </template>

        <label>About client: </label>
        <p></p>
        <button class="btn btn-sm btn-outline-danger" @click="get_test">Пример запроса</button>

        <!-- <button @click="run('off')" class="btn btn-outline-primary form-control mt-2 style_button">Выключить сервер</button> -->
        <!-- <button @click="run('reboot')" class="btn btn-outline-primary form-control mt-2 style_button">Перезагрузить сервер</button> -->
        <!-- <button @click="run('redis')" class="btn btn-outline-primary form-control mt-2 style_button">Запустить redis</button> -->
        <!-- <button @click="run('mongo')" class="btn btn-outline-primary form-control mt-2 style_button">Запустить mongo</button> -->
        <!-- <button @click="run('off_db')" class="btn btn-outline-primary form-control mt-2 style_button">Выключить базу данных</button> -->
        <!-- <button @click="save_set" class="btn btn-outline-danger mt-2 form-control style_button"><i class=""></i> Сохранить</button> -->


        <!-- <HighLight  :with-header="true" language="js" header-language="JavaScript"  :code="code"/> -->
      </div>
    </div>
  </div>
</template>


<style scoped>
.style_button {
  text-align: left;
}

.my-btn {
  width: 100%;
  margin-top: 3px;
  border-radius: 10px;
  border: 2px solid black;
}
.my-btn:hover {
  background-color: orangered;
}

</style>



<script>
// hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))

export default {
  props: {
    theme: Boolean,
    wait: Boolean
  },

  setup() {
      // console.log('12312312342424245345345', props)
      // let v = ref(true)

      // return { v }
  },

  // directives: {
  //   focus: {
  //     // определение директивы
  //     inserted: function (el) {
  //       el.focus()
  //     }
  //   }
  // },
  components: {
    // highlightjs: hljsVuePlugin.component
    HighLight
  },

  data() {
    return {
      lang_select: 1,
      theme_current: false,
      user: {},
      show_path: false,
      answer: '',
      sourcecode: 'const str = "This sourcecode will update dynamically"',
      code: `const hello = 'world'`,
      color_header: '#ffffff',
      settings: [],
      mode_container: false,
      run_interval_mode: false,

    }
  },
  watch: {
    color_header() {
      window.localStorage.setItem('color_header', this.color_header)
    }
  },
  async mounted() {


    if (window.localStorage.getItem('color_header') == null) {
      window.localStorage.setItem('color_header', this.color_header)
    } else {
      this.color_header = window.localStorage.getItem('color_header')
    }

    if (window.localStorage.getItem('mode_container') !== null) {
      this.mode_container = JSON.parse(window.localStorage.getItem('mode_container'))
    }

    console.log('this func: mounted', this.theme)
    this.theme_current = this.theme
    this.user = {
      settings: {
        mode: false
      }
    }
    // await this.get_test()
    // Then register the languages you need
    // hljs.registerLanguage('javascript', javascript);
    // hljs.highlightAll()



  },
  created() {
    this.user = {
      settings: {
        mode: false
      }
    }
  },

  methods: {
    async apply_settings(value) {
      console.log(123123123, value['cash'])
      window.localStorage.setItem('tags', this.settings)
    },
    async download_settings() {
      console.log(window.localStorage.getItem('user_info'))
      const user_info = JSON.parse(window.localStorage.getItem('user_info'));
      const properties = {
        id: user_info.id,
        login: user_info.login,
        email: user_info.email,
        phone: user_info.phone,
        // tags: JSON.parse(window.localStorage.getItem('tags'))
      }
      // axios
      // console.log(properties)
      const response = await fetch('/control/download/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },        
        body: JSON.stringify(properties)
        
      })
      let result=await response.json()
      console.log(result);
      this.settings = result;
      window.localStorage.setItem('tags', JSON.stringify(this.settings))

      // .then(response => {
      //   console.log(response.data);
      //   this.settings = response.data;
      //   window.localStorage.setItem('tags', JSON.stringify(this.settings))
      // })
      // .catch(error => {
      //   console.log(error)
      // })
      // .finally(() => {
      //   console.log('finally!')
      // })
    },
    async upload_settings() {
      console.log(window.localStorage.getItem('user_info'))
      const user_info = JSON.parse(window.localStorage.getItem('user_info'));
      const properties = {
        id: user_info.id,
        login: user_info.login,
        email: user_info.email,
        phone: user_info.phone,
        tags: JSON.parse(window.localStorage.getItem('tags'))
      }
      axios
      .post('/control/upload/settings', {
        Headers: {
          'Authorization': window.localStorage.getItem('jwt'),
        },        
        data: {
          ...properties
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        console.log('finally!')
      })
    },
    async get_test() {
      // await fetch('/control/ip', {
      //   headers: {
      //     'method': 'GET',
      //     'Content-Type': 'application/json',
      //   }
      // })
      window.location.replace("/control/ip");
      // window.location.href = '/control/ip'
      // console.info('Я тут: ', await response.json())
    },
    async run(namec) {
      const properties = {
        name: namec
      }
      axios.post('/control', {
        //credentials: 'include',
        headers: {
          authorization: window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify(properties)
      })
      .then( (response) => {
        // handle success
        console.log(response);
        this.answer = response
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        console.log('finally')
      });
    },
    async change_theme() {
      this.$emit('updateParent', {
        theme: this.theme,
      })
    },
    async change_container_mode() {
      this.mode_container =! this.mode_container;
      this.$emit('change_container_mode', {
        mc: this.mode_container,
      })
    },
    async toggle_random_words() {
      this.run_interval_mode =! this.run_interval_mode;
      this.$emit('toggle_random_words', {
        run_interval_mode: this.run_interval_mode,
      })
    },





    async save_set() {
      window.localStorage.setItem('user', this.nickname);
    }

  }
}
</script>