<script setup>

// import Swal from 'sweetalert2';
// @/compositions/composition.js;
import { ref } from 'vue';
import axios from 'axios';
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-6">
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
          <input type="text" placeholder="Your nikname" id="nick_id" class="form-control">
          <span for="pass_id">Пароль</span>
          <input type="password" placeholder="password" name="" id="pass_id" class="form-control">
        </template>



        <button @click="run('off')" class="btn btn-outline-primary form-control mt-2 style_button">Выключить сервер</button>
        <button @click="run('reboot')" class="btn btn-outline-primary form-control mt-2 style_button">Перезагрузить сервер</button>
        <button @click="run('redis')" class="btn btn-outline-primary form-control mt-2 style_button">Запустить redis</button>
        <button @click="run('mongo')" class="btn btn-outline-primary form-control mt-2 style_button">Запустить mongo</button>
        <button @click="run('off_db')" class="btn btn-outline-primary form-control mt-2 style_button">Выключить базу данных</button>
        <button class="btn btn-outline-danger mt-2 form-control style_button"><i class=""></i> Сохранить</button>

                
      </div>
    </div>
  </div>
</template>


<style scoped>
 .style_button {
  text-align: left;
 }


</style>



<script>
export default {
  props: {
    theme: Boolean,
    wait: Boolean
  },
  // setup(props) {
  //     console.log('12312312342424245345345', props)
  //     let v = ref(true)

  //     return { v }
  // },
  data() {
    return {
      lang_select: 1,
      theme_current: false,
      user: {},
      show_path: false,
      answer: ''

    }
  },

  async mounted() {
    console.log('this func: mounted', this.theme)
    this.theme_current = this.theme
    this.user = {
      settings: {
        mode: false
      }
    }
  },
  created() {
    this.user = {
      settings: {
        mode: false
      }
    }
  },

  methods: {
    async run(namec) {
      const properties = {
        name: namec
      }
      axios.post('/control', {
        //credentials: 'include',
        headers: {},
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
      // alert('hello')
      // this.theme = (this.value===true)? 'dark' : 'white';
      // alert(v)
      // this.value=!this.value
      // alert(this.theme)
      // console.log(this.theme)
      this.$emit('updateParent', !this.theme)
    },


  }
}
</script>