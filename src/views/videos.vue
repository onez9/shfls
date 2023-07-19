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
      <!-- <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (aaa>0)}" @click="sorting"><i class="bi bi-filter"></i></button>
      </div> -->
      <div v-if="false" class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_names==true)}" @click="show_names_f">{{ name_button_spidoznoe_govno }}</button>
      </div>
      <div class="col mb-1 mt-1">
        <button :class="{'btn form-control mt-1': true, 'btn-dark': (!show_download_panel), 'btn-info': (show_download_panel)}" @click="show_download_panel=!show_download_panel"><i :class="{'bi bi-download': !show_download_panel, 'bi bi-search': show_download_panel}"></i></button>
      </div>
      <div class="col mb-1 mt-1">
        <!-- <input type="number" class="form-control mt-1" min="1" max="4"> -->
        <select @change="change_page" v-model="selected_part" class="form-select mt-1" name="">
          <option value="porno">Порно</option>
          <option value="programming">Программирование</option>
          <option value="math">Математика</option>
        </select>
      </div>
      <div class="col mb-1 mt-1">
        <!-- <input type="number" class="form-control mt-1" min="1" max="4"> -->
        <select v-model="selected" class="form-select mt-1" name="">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
          <option value="6">Six</option>
          <option value="12">Twelve</option>
        </select>
      </div>
      <!-- <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_poster==true)}" @click="show_poster_func"><i class="bi bi-stickies-fill"></i> {{ button_text_poster }}</button>
      </div> -->
      
      <div class="col-12"></div>



      <div class="col mt-2 mb-2 input-group" v-if="show_download_panel == true">
        <input type="text" class="form-control" :disabled="false" v-model="url" placeholder="Вставьте ссылку на видео">
        <button class="btn btn-secondary" @click="run_download(url)">
          <i class="bi bi-download"></i>
        </button>
      </div>
      <div v-else class="col input-group mb-2 mt-2">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Название видео" class="form-control" v-on:input="searching(name)" v-model="name">
        <button @click="name=''; rx_array=array_videos" class="input-group-text" id=""><i class="bi bi-backspace"></i></button>
      </div>

      <div class="col-12">
        <div v-for="(item, i) in batch_list" :key="item" class="alert alert-primary d-flex mb-1 d-flex" role="alert">
          {{ item }}
          <button class="btn btn-primary ms-auto">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

          </button>
            <!-- <i class="bi bi-x-diamond"></i> -->
        </div>
      </div>


      <div class="mt-3 d-flex justify-content-end">
        <nav aria-label="Page navigation mt-1 example">
          <ul class="pagination">
            <li v-if="currentPage>0" class="page-item"><a class="page-link" href="#" @click="crumbs(currentPage-1)">&laquo;</a></li>
            <li :class="{'page-item': true, 'active': (page-1==currentPage)}" v-for="page in totalpages" :key="page">
              <a class="page-link" @click="crumbs(page-1)" href="#">{{ page }}</a>
            </li>
            <li v-if="currentPage<totalpages-1" class="page-item"><a class="page-link" href="#" @click="crumbs(currentPage+1)">&raquo;</a></li>
          </ul>
        </nav>
      </div>
      <!-- <search :array="array_videos" placeholder="Название видео" type="video"></search> -->
      <!-- <div class="col-sm-12 mb-2 mt-2">
        <input type="text" class="form-control" placeholder="Поиск видео" v-model="nme" v-on:input="search">
      </div> -->




      <!-- :poster="`/gifs/${encodeURIComponent(item.replace('.mp4', '.gif'))}`" -->
      <div :class="{'pb-1 pt-1': true, 
      'col-1': (selected==12),
      'col-2': (selected==6),
      'col-3': (selected==4),
      'col-sm-4': (selected==3),
      'col-6': (selected==2),
      'col-12': (selected==1)
      }" 
      v-for="(item, i) in rx_array" :key="item">
      <!-- {{ item }} -->
        <figure class="">
          <video class="w-100 videos"
          controls loop>
          <!-- :poster="{'/gifs/space.jpg': (show_poster==true)}" > -->
            <source :src="`/g?name=${encodeURIComponent(item)}&partname=${selected_part}`" type="video/mp4" />
          </video>
          <figcaption style="font-size: small" v-if="show_names" class="text-break">{{ (item.length>15)? item.slice(0, 40)+'...' : item }}</figcaption>
        </figure>
      </div>


    </div>
  </div>
</template>


<style scoped>
/* video{
  width: ;
} */

/* @mixin pagination-size($padding-y, $padding-x, $font-size, $border-radius) {
  .page-link {
    padding: $padding-y $padding-x;
    @include font-size($font-size);
  }

  .page-item {
    @if $pagination-margin-start == (-$pagination-border-width) {
      &:first-child {
        .page-link {
          @include border-start-radius($border-radius);
        }
      }

      &:last-child {
        .page-link {
          @include border-end-radius($border-radius);
        }
      }
    } @else {
      //Add border-radius to all pageLinks in case they have left margin
      .page-link {
        @include border-radius($border-radius);
      }
    }
  }
} */
</style>
<script>
export default {
  setup() {
    alert('hello')
  },
  data() {
    return {
      // img: '/files/192.168.160.184-kartinkin-com-p-anime-v-realnoi-zhizni-oboi-anime-krasivo-6.jpg',
      array_videos: [],
      currentPage: 0,
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
      button_text_poster: 'скрыть',
      selected: 3,
      selected_part: 'programming',
      batch_list: [] // загружаемые видео(список)

    }
  },
  async mounted() {
    console.log('Выполнился метод: mounted')
    // alert('helllo')
    if (window.localStorage.getItem('url_list')==null) {
      window.localStorage.setItem('url_list', JSON.stringify([]));
      
    } 
    this.batch_list=JSON.parse(window.localStorage.getItem('url_list'))

    console.log(window.localStorage.getItem('url_list'))
    console.log(this.batch_list)
    await this.g()
  },
  props: {
    // wait: Boolean,
  },
  created() {
    console.log('Выполнился метод: created')
    // alert('created hello')
    // console.log("Запускаю процедуру подключения к WebSocket Server")
    // this.connection = new WebSocket("ws://192.168.160.184:3000")
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
  watch: {

  },
  computed: {

  },
  methods: {
    async crumbs(page) {
      this.currentPage = page
      await this.g()
    },

    async change_page() {
      // const response = await fetch('/g/v', {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({'part': part})
      // })
      this.array_videos=[]
      this.rx_array=[]
      await this.g()
      // let result = await response.json()
      // this.array_videos = result['items']
      // this.rx_array = this.array_videos
      // this.folder = result['route']
    },
    async show_poster_func() {
      this.show_poster=!this.show_poster
      if (this.show_poster) this.button_text_poster='показать'
      else this.button_text_poster='скрыть'
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
      for (let i=0; i<this.array_videos.length; i++) {
        if (rx.test(this.array_videos[i].toLowerCase())) {
          this.rx_array.push(this.array_videos[i])
          console.log(this.array_videos[i])
        }
      }

      // console.log(this.rx_array)
      // console.info(this.array_videos)
      // this.array_videos=[]

    },
    async sendMessage(message) {
      // alert(message)
      console.log(this.connection);
      this.connection.send(message);
      
    },

    async g() {
      let properties = {
        type: "video",
        partname: this.selected_part,
        page: this.currentPage,
        limit: 5
      }
      console.info(this.selected_part)
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })

      let result = await response.json()
      this.array_videos = result['items'].slice(0)
      this.rx_array = this.array_videos.slice(0)
      this.backup=this.array_videos.slice(0)
      this.folder = result['route']


      // this.totalpages = Math.ceil(productscount / productsPerPage)
      this.totalpages = Math.ceil(result['count_videos'] / properties.limit)



    },

    async run_download(url) {

      this.url = "" // очищаем поле ввода
      this.batch_list.push(url)
      window.localStorage.setItem('url_list', JSON.stringify(this.batch_list));
      // console.log(123123, window.localStorage.getItem('url_list'))
      // this.$emit('wait', true)
      const response = await fetch(`/g/s?url=${url}&partname=${this.selected_part}`, {
        method: "GET",

      })

      this.done_string = (await response.json())['wait']
      this.batch_list=JSON.parse(window.localStorage.getItem('url_list'))

      this.batch_list.splice(this.batch_list.indexOf(this.done), 1)
      window.localStorage.setItem('url_list', JSON.stringify(this.batch_list));
      this.batch_list=JSON.parse(window.localStorage.getItem('url_list'))
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
