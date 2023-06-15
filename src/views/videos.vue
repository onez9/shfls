<script setup>
import { registerRuntimeCompiler } from 'vue';
import search from '../../Components/search.vue'
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- <div class="form-check form-switch">
        <input class="form-check-input" v-model="v1" @change="func" type="checkbox" id="flexSwitchCheckDefault">
        <label class="form-check-label" for="flexSwitchCheckDefault">Нормальное видео</label>
      </div>
      {{ v1 }} -->
      <!-- <div class="col mb-1 mt-1">
        <button :class="{'btn btn-warning form-control mt-1': true}" @click="sendMessage('здравствуйте я с клиента')">WebSocket</button>
      </div> -->
      <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (aaa>0)}" @click="sorting"><i class="bi bi-filter"></i></button>
      </div>
      <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_names==true)}" @click="show_names_f">{{ name_button_spidoznoe_govno }}</button>
      </div>
      <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_download_panel==true)}" @click="show_download_panel_func"><i class="bi bi-download"></i></button>
      </div>
      <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_poster==true)}" @click="show_poster_func"><i class="bi bi-stickies-fill"></i> {{ button_text_poster }}</button>
      </div>
      
      
      
      <div class="col-12 mt-2 mb-2 input-group" v-if="show_download_panel == true">
        <input type="text" class="form-control" :disabled="wait" v-model="url" placeholder="Вставьте ссылку на видео">
        <button class="btn btn-secondary" @click="run_download(url)">
          <i v-if="wait == false" class="bi bi-download"></i>
          <span v-if="wait == true" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="wait == true"> Loading</span>
        </button>
        <button v-if="wait == true" class="btn btn-danger" @click="wait = false">
          <i class="bi bi-x-diamond"></i>
        </button>


      </div>
      <div class="col-12 input-group mb-2 mt-2">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Название видео" class="form-control" v-on:input="searching(name)" v-model="name">
      </div>
      <!-- <search :array="array_videos" placeholder="Название видео" type="video"></search> -->
      <!-- <div class="col-sm-12 mb-2 mt-2">
        <input type="text" class="form-control" placeholder="Поиск видео" v-model="nme" v-on:input="search">
      </div> -->




            <!-- :poster="`/gifs/${encodeURIComponent(item.replace('.mp4', '.gif'))}`" -->
      <div class="col-sm-4 pb-1 pt-1" v-for="(item, i) in rx_array" :key="i">
        <figure class="">
          <video class="w-100" 
          controls loop>
          <!-- :poster="{'/gifs/space.jpg': (show_poster==true)}" > -->
            <source :src="`/g?name=${encodeURIComponent(item)}`" type="video/mp4" />



          </video>
          <figcaption v-if="show_names" class="text-break">{{ item }}</figcaption>
        </figure>
      </div>


    </div>
  </div>
</template>


<style scoped>
/* video{
  width: ;
} */
</style>
<script>
export default {
  data() {
    return {
      // img: '/files/192.168.96.184-kartinkin-com-p-anime-v-realnoi-zhizni-oboi-anime-krasivo-6.jpg',
      array_videos: [],
      url: "",
      re1: '',
      aaa: 1,
      connection: null,
      route: '',
      wait: false,
      show_download_panel: false,
      name: '',
      rx_array: [],
      show_names: true,
      name_button_spidoznoe_govno: 'Скрыть названия',
      v1: '',
      show_poster: true,
      button_text_poster: 'скрыть'

    }
  },
  async mounted() {
    console.log('Выполнился метод: mounted')
    await this.g()
  },
  props: {
    // wait: Boolean,
  },
  created() {
    console.log('Выполнился метод: created')
    // console.log("Запускаю процедуру подключения к WebSocket Server")
    // this.connection = new WebSocket("ws://192.168.96.184:3000")
    // this.connection.binaryData = "blob";
    // this.connection.onmessage = function (event) {
    //   // console.log(event.data.text());
    //   console.log(event.data);

    // }

    // this.connection.onopen = function (event) {
    //   console.log('onopen connection', event)
    //   // alert("Соединение установлено.");
    //   console.log("Подключение успешно завершено к websocket server...")
    // }

    // this.connection.onclose = function (event) {
    //   if (event.wasClean) {
    //     console.log('Соединение закрыто чисто');
    //   } else {
    //     console.log('Обрыв соединения'); // например, "убит" процесс сервера
    //   }
    //   console.log('Код: ' + event.code + ' причина: ' + event.reason);
    // };

    // const wsSend = function (data) {
    //   // readyState - true, если есть подключение
    //   if (!wsConnection.readyState) {
    //     setTimeout(function () {
    //       wsSend(data);
    //     }, 100);
    //   } else {
    //     wsConnection.send(data);
    //   }
    // };

    // const sendMessage = (message) => conn.send(JSON.stringify({ event: "chat-message", payload: { userName, message }}));


  },

  methods: {
    // async func() {
    //   // alert(this.v1)
    //   const response = await fetch('/g/ch1', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({'srak1': this.v1})
    //   })
    //   this.rx_array=[]
    //   this.array_videos=[]
    //   await this.g()
    // },
    async show_poster_func() {
      this.show_poster=!this.show_poster
      if (this.show_poster) this.button_text_poster='показать'
      else this.button_text_poster='скрыть'
    },

    async show_download_panel_func() {
      if (this.show_download_panel) {
        this.show_download_panel = false
      } else {
        this.show_download_panel = true
      }
    },
    async show_names_f() {
      if (this.show_names) {
        this.show_names = false
        this.name_button_spidoznoe_govno = 'Показать названия'
      } else {
        this.show_names = true
        this.name_button_spidoznoe_govno = 'Скрыть названия'
      }
    },
    async searching() {
      let rx = new RegExp(this.name)
      this.rx_array = []
      this.array_videos.forEach(item => {
        if (rx.test(item.toLowerCase())) {
          this.rx_array.push(item)
        }
      })

    },
    async sorting() {
      this.aaa*=-1
      console.log(this.array_videos)
      // this.array_videos = JSON.parse(JSON.stringify(this.array_videos)).sort()
      // this.array_videos.sort()
      console.log(this.array_videos)
    },
    async sendMessage(message) {
      // alert(message)
      console.log(this.connection);
      this.connection.send(message);
      
    },

    async g() {
      let properties = {
        type: "video"
      }
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })

      let result = await response.json()
      this.array_videos = result['items']
      this.rx_array = this.array_videos
      this.folder = result['route']



    },

    async run_download(url) {
      this.wait = true
      // this.$emit('wait', true)
      const response = await fetch(`/g/s?url=${url}`, {
        method: "GET",

      })
      this.wait = (await response.json())['wait']
      this.url = ""
      // console.log('аааааааааа')
      await this.g()
    },

    async somefunc(image) {
      image.remove();
      URL.revokeObjectURL(image.src); //удаляет внутреннюю ссылку на объект,
      //что позволяет удалить его (если нет другой ссылки) сборщику мусора,
      //и память будет освобождена.
    }

  }
}
</script>
