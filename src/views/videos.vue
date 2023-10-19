<script setup>
import { registerRuntimeCompiler } from 'vue';
import search from '../../Components/search.vue'
import Swal from 'sweetalert2';
</script>

<template >
  <div class="container-fluid ">
    <div class="row" @mouseover="">
      <!-- <div class="form-check form-switch">
        <input class="form-check-input" v-model="v1" @change="func" type="checkbox" id="flexSwitchCheckDefault">
        <label class="form-check-label" for="flexSwitchCheckDefault">Нормальное видео</label>
      </div>
      {{ v1 }} -->
      <!-- <div class="col mb-1 mt-1">
        <button :class="{ 'btn btn-outline-danger form-control mt-1': true }" @click="sendMessage()">WebSocket</button>
      </div> -->

      <div class="col mb-1 mt-1 m-0 p-0 me-sm-2">
        <button class="btn btn-sm btn-outline-danger form-control mt-1" @click="show_poster_func"
          title="Показывает\Скрывает постеры на видео"><i class="bi bi-emoji-heart-eyes"></i></button>
      </div>

      <div class="col mb-1 mt-1 m-0 p-0 me-sm-2">
        <button class="btn btn-sm btn-outline-danger form-control mt-1" @click="crypt_mode =! crypt_mode" title="Шифрует\Дешифрует названия">123</button>
      </div>


      <div class="col-sm mb-1 mt-2 m-0 p-0">
        <button @click="open_addvance" class="btn btn-sm btn-outline-danger form-control" title="Дополнительно">
          <i class="bi bi-list"></i>
        </button>
      </div>

    </div>
    <div class="row" @mouseover="">

      <div v-if="show_extra" class="col-sm" style="background-color: #000000; border-radius: 5px; padding: 5px;">
        <div class="col-sm mb-1">
          <button @click="show_playlist = !show_playlist"
            :class="{ 'btn btn-sm btn-outline-danger form-control': true, 'btn btn-outline-success': (show_playlist == true) }"
            title="Создать новый плейлист">
            <i class="bi bi-folder-plus"></i>
          </button>
        </div>
        <div v-if="show_playlist == true" class="col-sm mb-2 ">
          <div class="input-group mb-1">
            <input v-on:keyup.enter="create_new_play_playlist(name_of_play_list)" class="form-control border border-outline-primary" id="name_list" placeholder="Название плейлиста"
              v-model="name_of_play_list">
            <button @click="name_of_play_list = ''" class="input-group-text" id=""><i
                class="bi bi-backspace"></i></button>
          </div>
          <button class="btn btn-sm btn-outline-primary form-control"
            @click="create_new_play_playlist(name_of_play_list)">Создать</button>
        </div>


        <!-- панель загрузки -->
        <div class="col-sm mb-1">
          <button @click="sdp" class="btn btn-sm form-control btn-outline-danger" title="youtube-dl/search">
            <i class="bi bi-download"></i>
          </button>
        </div>
        <div v-if="show_download_panel == true" class="col-sm-12 mb-2">
          <div class="input-group mb-1">
            <input v-on:keyup.enter="run_download(url)" type="text" class="form-control bg-dark text-white" :disabled="false" v-model="url"
              placeholder="Панель загрузки видео">
            <button class="btn btn-sm btn-secondary" @click="run_download(url)">
              <i class="bi bi-download"></i>
            </button>
          </div>
          <!-- стек загрузжаемых видео -->
          <div class="col-12">
            <div v-for="(item, i) in batch_list" :key="item"
              class="alert alert-info text-primary d-flex align-items-center mb-1 ps-2" role="alert">
              <div>{{ item }}</div>
              <button class="btn btn-sm btn-outline-info ms-auto me-1">Отменить</button>
              <button class="btn btn-sm btn-outline-danger">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>%
              </button>
              <!-- <i class="bi bi-x-diamond"></i> -->
            </div>
          </div>
          <!-- очистить стек загружаемых видео -->
          <div class="col-sm-12 mb-1 mt-1">
            <button class="btn btn-sm btn-outline-danger form-control" @click="clean"
              title="Очистить буффер от загружаемых видео">clean</button>
          </div>
        </div>

        <div class="col-sm mb-1">
          <button @click="show_pen = !show_pen" class="btn btn-sm form-control btn-outline-danger" title="Редактировать play list">
            <i class="bi bi-pen"></i>
          </button>
        </div>

        <div v-if="show_pen" class="col-sm">

          <div v-for="(item, index) in play_list_array" :key="item" class="bg-outline-danger my-1">

            <div class="d-flex justify-content-end align-items-center border rounded">
              <div class="me-auto p-1">{{ item[0] }}</div>
              <button @click="delete_albom(item[0])" v-if="item[1].edit_mode_video" class="btn btn-sm btn-outline-info"><i
                  class="bi bi-x"></i></button>
              <button @click="show_like_button_func(item[0])" v-if="item[1].edit_mode_video"
                class="btn btn-sm btn-outline-info ms-1"><i class="bi bi-plus-circle-dotted"></i> Добавить видео</button>
              <button @click="edit_item(item[1])" class="btn btn-sm btn-outline-info ms-1"><i
                  class="bi bi-pencil"></i></button>
            </div>
            
          </div>

          <p v-if="play_list_array.size == 0" class="text-center p-0">Тут пока ничего нет {{ play_list_array.size }}</p>
        </div>



        <!-- v-shortkey="['ctrl', 'p']" @shortkey="alert(123)" -->
        <div class="col mb-1">
          <button @click="lock = !lock" class="btn btn-sm btn-outline-danger form-control" 
            title="Зашифровать/Расшифровать"><i :class="{ 'bi bi-lock': true, 'bi bi-unlock': (lock) }"></i></button>
        </div>

        <!-- количество видео на одной странице -->
        <div class="col-sm mb-1 mt-1">
          <select @change="change_count" v-model="video_values" class="form-select mt-1 bg-dark text-white" name=""
            title="Количество видео на одной странице">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option :value="totalvideos">{{ totalvideos }}</option>

          </select>
        </div>

        <!-- количество столбцов -->
        <div class="col-sm mb-1 mt-1">
          <!-- <input type="number" class="form-control mt-1" min="1" max="4"> -->
          <select v-model="selected" class="form-select mt-1 bg-dark text-white" name="" title="Количество столбцов">
            <option value="0">List</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
            <option value="6">Six</option>
            <option value="12">Twelve</option>
          </select>
        </div>


        <div class="col-sm mb-1 mt-1">
          <!-- <input type="number" class="form-control mt-1" min="1" max="4"> -->
          <select @change="select_play(playlist_name)" v-model="playlist_name" class="form-select mt-1 bg-dark text-white" name="" title="Выбор плейлиста">
            <option value="all">All</option>
            <option value="recent">Recent</option>
            <option  v-for="(item, index) in play_list_array" v-bind:value="item">{{ item[0] }}</option>
          </select>
        </div>

      </div>


      <div class="col-12"></div>



      <div class="col-sm-12 input-group mb-2 mt-2 m-0 p-0">
        <span class="input-group-text p-0 m-0 px-2" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Панель поиска" class="form-control bg-dark text-white p-0 m-0" v-on:keyup.enter="template_request" @mouseover="recent_request=true" v-on:input="searching(name)" v-model="name" @focus="recent_request = true" @mouseleave="" @blur="" autocomplete="on">
        <button @click="clear_history_search" class="btn btn-sm btn-outline-danger" id=""><i class="bi bi-radioactive"></i></button>
        <button @click="csr" class="btn btn-sm btn-outline-danger" id=""><i class="bi bi-backspace"></i></button>
      </div>

      <div class="col-sm-12 style_searching" style="" v-if="sampling_by_template.length !== 0">
        <div class="" v-for="(item, index) in sampling_by_template.slice(0, 20)" :key="item">
          {{ item.name }}
        </div>
      </div>
      <div v-if="recent_request_array.length!=0 && recent_request && sampling_by_template.length==0" class="col-sm-12 style_searching" @mouseleave="recent_request = false">
        <div class="recent_request_class_css" v-for="(request, index) in recent_request_array" :key="request">
          <span @click="sel_last_request(request)" >{{ request }}</span>
        </div>
      </div> 



      <div>
        <!-- переключатель страниц -->
        <div v-if="totalpages != 1 && current_play_list == 'All'" class="mt-1 d-flex justify-content-center">
          <nav aria-label="Page navigation mt-1 example">
            <ul class="pagination">
              <li v-if="currentPage > 0" class="page-item"><a class="page-link" href="#"
                  @click="crumbs(currentPage - 1)">&laquo;</a></li>
              <li v-if="currentPage > 2" class="page-item"><a class="page-link" href="#" @click="crumbs(0)">1</a></li>

              <template v-for="(page, i) in totalpages">
                <li v-if="(currentPage - 2 < page) && (currentPage + 4 > page)"
                  :class="{ 'page-item': true, 'active': (page - 1 == currentPage) }">
                  <a class="page-link" @click="crumbs(page - 1)" href="#">{{ page }}</a>
                </li>
              </template>



              <li v-if="currentPage < totalpages - 3" class="page-item">
                <a class="page-link" href="#" @click="crumbs(totalpages - 1)">
                  {{ totalpages }}
                </a>
              </li>
              <!-- <li v-if="currentPage==totalpages-2" class="page-item"><a class="page-link" href="#" @click="crumbs(currentPage+1)">{{ currentPage }}</a></li> -->
              <li v-if="currentPage < totalpages - 1" class="page-item"><a class="page-link" href="#"
                  @click="crumbs(currentPage + 1)">&raquo;</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <!-- <search :array="array_videos" placeholder="Название видео" type="video"></search> -->
      <!-- <div class="col-sm-12 mb-2 mt-2">
        <input type="text" class="form-control" placeholder="Поиск видео" v-model="nme" v-on:input="search">
      </div> -->


      <!-- {{ rx_array.length }} -->
      <!-- :poster="`/gifs/${encodeURIComponent(item.replace('.mp4', '.gif'))}`" -->
      <!-- отображаемые видео -->

      <div v-for="(item, i) in rx_array" :key="item"
        :class="{ 'p-1 pt-2': true, 'col-1': (selected == 12), 'col-2': (selected == 6), 'col-3': (selected == 4), 'col-sm-4': (selected == 3), 'col-6': (selected == 2), 'col-12': (selected == 1), 'col-sm-12': (selected==0) }">

        <!-- {{ item }} -->
        <div class="frame-video p-1 rounded">
          <div class="row">
            
            
            <div :class="{'col-4': selected==0, 'd-flex': true }">
              
              <div class="row p-0 mb-2 d-flex flex-column">
                <div v-if="current_play_list == 'All' && show_like_button==true" class="">
                  <button class="btn btn-sm btn-outline-danger form-control" @click="add_to_like(item.name)">
                    <i class="bi bi-heart"></i> {{ like_button_label }}
                  </button>
                </div>
                <div class="" v-if="current_play_list !== 'All'"><button @click="delete_from_albom(i)" class="btn btn-sm btn-outline-secondary form-control"><i class="bi bi-x"></i></button></div>
                <div class="mb-1 me-1"><button class="btn btn-sm btn-outline-danger" @click="reset_video(i)"><i class="bi bi-stop-btn"></i></button></div>
                <div class="mb-1"><button class="btn btn-sm btn-outline-success" @click="play_video(i)"><i class="bi bi-play-btn"></i></button></div>
                <div class=""><button class="btn btn-sm btn-outline-success" @click="full_video(i)"><i class="bi bi-arrows-fullscreen"></i></button></div>
              </div>

              <div>
                <figure class="m-0" @mouseover="item.upHere = true" @mouseleave="item.upHere = false" >
                  <video class="w-100 videos m-0 p-0"
                    v-bind:poster="(show_poster == true && item.upHere !== true) ? '/images/periodic_table.jpg' : `/gifs/${encodeURIComponent(item.name.replace(/(.webm|.mp4|.mkv|.avi)/gi, '.gif'))}`"
                    loop preload="none" controls="controls" controlsList="nodownload">
                    <!-- <source :src="`/g?name=${encodeURIComponent(item.name)}`" type="video/mp4" /> -->
                    <source :src="`/g?name=${encodeURIComponent(item.name)}`" type='video/mp4' />
                  </video>
                  <!-- <figcaption>
                    <label id="timer" for="progress" role="timer"></label>
                    <progress id="progress" max="100" value="0">Progress</progress>
                  </figcaption> -->
                  <!-- <marquee behavior="scroll" direction="left">{{ item.name }}</marquee> -->
                    <!-- {{ item.name }} -->
                    <!-- {{ item.shw_nm_vd }} -->
                  <figcaption v-if="selected != 0" style="font-size: small" class="text-break ms-auto">
                    <span v-if="crypt_mode">{{ nameVideo(item) }}</span>
                    <span v-else>{{ nameVideo(item) }}</span>
     
                  </figcaption>
                </figure>
                
              </div>
            </div>

            <div v-if="selected == 0" class="col-6 p-0">
              <p class="p-0 m-0" style="font-size: small; color: #555555">
                <!-- {{ nameVideo(item, 0) }} -->
                <span v-if="crypt_mode">{{ nameVideo(item, 0).toString(16) }}</span>
                <span v-else>{{ nameVideo(item, 0) }}</span>
              </p>
              <p class="p-0 m-0" style="font-size: small; color: #555555">
                atime: {{ new Date(item['info']['atime']).toLocaleDateString() }} {{ new Date(item['info']['atime']).toLocaleTimeString() }}
              </p>
              <p class="p-0 m-0" style="font-size: small; color: #555555">
                ctime: {{ new Date(item['info']['atime']).toLocaleDateString() }} {{ new Date(item['info']['atime']).toLocaleTimeString() }}
              </p>
              <p class="p-0 m-0" style="font-size: small; color: #555555">
                mtime: {{ new Date(item['info']['mtime']).toLocaleDateString() }} {{ new Date(item['info']['mtime']).toLocaleTimeString() }}
              </p>
              <p class="p-0 m-0" style="font-size: small; color: #555555">
                size: {{ Math.round(item['info']['size'] * 100 / 1024 / 1024) / 100 }} Мб
              </p>
            </div>

          </div>

        </div>

      </div>
      <!-- {{ rx_array.length==0 }} -->
      <div class="mt-1 d-flex justify-content-center">
        <p v-if="rx_array.length == 0">Тут пока ничего нет...</p>
      </div>

      <!-- переключатель страниц -->
      <div v-if="totalpages != 1 && current_play_list == 'All'" class="mt-1 d-flex justify-content-center">
        <nav aria-label="Page navigation mt-1">
          <ul class="pagination">
            <li v-if="currentPage > 0" class="page-item"><a class="page-link" href="#"
                @click="crumbs(currentPage - 1)">&laquo;</a></li>
            <li v-if="currentPage > 3" class="page-item"><a class="page-link" href="#" @click="crumbs(0)">1</a></li>

            <template v-for="(page, i) in totalpages">
              <li v-if="(currentPage - 2 < page) && (currentPage + 4 > page)"
                :class="{ 'page-item': true, 'active': (page - 1 == currentPage) }">
                <a class="page-link" @click="crumbs(page - 1)" href="#">{{ page }}</a>
                <!-- <a v-else class="page-link" @click="crumbs(page-1)" href="#"></a> -->
              </li>
              <!-- {{ func(page) }} -->
              <!-- {{ (4+totalpages-3)/2 }} -->
              <!-- <li v-if="page==Number((4+totalpages-3)/2)" class="page-item">
                <a class="page-link">...</a>
              </li> -->
              <!-- <li class="page-item" v-if="check">
                <a class="page-link" href="#">...</a>
              </li> -->
            </template>



            <li v-if="currentPage < totalpages - 4" class="page-item">
              <a class="page-link" href="#" @click="crumbs(totalpages - 1)">
                {{ totalpages }}
              </a>
            </li>
            <!-- <li v-if="currentPage==totalpages-2" class="page-item"><a class="page-link" href="#" @click="crumbs(currentPage+1)">{{ currentPage }}</a></li> -->
            <li v-if="currentPage < totalpages - 1" class="page-item"><a class="page-link" href="#"
                @click="crumbs(currentPage + 1)">&raquo;</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>


<style scoped>

.style_searching {
  background-color: #111111;
  padding: 5px;
  border-radius: 5px;
  text-decoration: underline;
  z-index: 3;
  /* box-sizing: border-box;
  -moz-box-sizing: border-box; */
}
.recent_request_class_css:hover {
  color: orange;
}
.page-link {
  background-color: black;
  border-color: #dc3545;
  color: #dc3545;
}

.page-item {
  /* border: 2px solid red; */
  /* border-color: red; */
}

.pagination {
  /* border-color: red; */
}

.active {
  /* background-color: aqua; */
}

.frame-video {
  background-color: rgb(0, 0, 0);
  /* padding: 10px; */
}

/* audio::-webkit-media-controls-timeline,
video::-webkit-media-controls-timeline {
    display: none;
}
audio::-webkit-media-controls,
video::-webkit-media-controls {
    display: none;
}


progress[value]::-webkit-progress-value {
  background-image: linear-gradient(
    to right,
    #ff8a00, #e52e71
  );
  transition: width 1s linear;
} */
</style>


<script>

// const progress = document.getElementById("progress");
// const timer = document.getElementById( "timer" );

// function progressLoop() {
//   setInterval(function () {
//     progress.value = Math.round((video.currentTime / video.duration) * 100);
//     timer.innerHTML = Math.round(video.currentTime) + " seconds";
//   });
// }

// progressLoop();


export default {
  setup() {
    alert('hello')
  },
  data() {
    return {
      array_videos: [],
      currentPage: 0,
      shw_nm_vd: true,
      url: "",
      lock: true,
      re1: '',
      aaa: 1,
      ws: null,
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
      selected_part: '',
      batch_list: [], // загружаемые видео(список)
      dayes: 1,
      video_values: 5,
      totalvideos: 0,
      totalpages: 0,
      tmp: true,
      show_playlist: false,
      show_extra: false,
      play_list_array: new Map(),
      name_of_play_list: "",
      current_play_list: "All",
      hide_default_point_tmp: true,
      show_like_button: false,
      show_pen: false,
      edit_mode_video: false,
      like_button_label: '',
      prev_edit_play_list: '',
      lst_srch: [],
      sampling_by_template: [],
      playlist_name: "all",
      recent_arr: [],
      crypt_mode: false,
      recent_request: false,
      recent_request_array: []
    }
  },

  async ms1() {
    console.log('hello')


  },

  async mounted() {
    console.log('Выполнился метод: mounted')

    // В этом методе происходит, чтение или создание хранилища для пользовательских данных в кэше браузера.
    if (window.localStorage.getItem('url_list') == null) {
      window.localStorage.setItem('url_list', JSON.stringify([]));

    }

    if (window.localStorage.getItem('recent_request_list') == null) {
      window.localStorage.setItem('recent_request_list', JSON.stringify([]));

    } else {
      // await this.write_to_db()
    }

    this.batch_list = JSON.parse(window.localStorage.getItem('url_list'))
    this.recent_request_array = JSON.parse(window.localStorage.getItem('recent_request_list'))


    console.log(window.localStorage.getItem('url_list'))
    console.log(this.batch_list)

    await this.g(true)

    await this.g()


    if (window.localStorage.getItem('lst_ply_lst') == null) {
      window.localStorage.setItem('lst_ply_lst', JSON.stringify(Array.from((new Map()).entries()))); // записываем словарь в локальное хранилище

    }
    this.play_list_array = new Map(JSON.parse(localStorage.getItem('lst_ply_lst')))


  },
  props: {
    // wait: Boolean,
  },
  created() {
    console.log('Выполнился метод: created да да именно он!')
    // alert('created hello')
    console.log("Запускаю процедуру подключения к WebSocket Server")
    this.ws = new WebSocket("ws://192.168.1.103:3000")
    // this.ws.binaryData = "blob";
    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = function (event) {
      // console.log(event.data.text());
      console.log('Новое сообщение!')
      console.log(event.data);

    }

    this.ws.onopen = function (event) {
      console.log('onopen ws', event)
      // alert("Соединение установлено.");
      console.log("Подключение успешно завершено к websocket server...")
    }

    this.ws.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

  },
  watch: {

  },
  computed: {

  },
  methods: {
    async write_to_db() {
      const response = await fetch('/g/write_cash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({ history_search: window.localStorage.getItem('recent_request_list') })
      })

      let result = await response.json()
      conole.info('run in mounted: ', result)
    },
    async clear_history_search() {
      window.localStorage.setItem('recent_request_list', JSON.stringify([]))
      this.recent_request_array = []
    },

    async sel_last_request(req) {
      console.info(req)
      this.name = req
      await this.searching(this.name)
      await this.template_request()



    },
    async csr() {
      this.name = ''; 
      this.rx_array = this.array_videos.slice(0)
      this.sampling_by_template = []

    },
    func(page) {
      let n = Number(page)
      if (page < 4 || page > this.totalpages - 3) {
        return true;

      } else {
        if (this.tmp == true) {
          this.tmp = false;
          console.log('Всего страниц:', n, this.totalpages)
          return true

          // 1 2 3 4 5 6 7 8 9 10 12 13 14 15 16
        }
        return false
      }




    },
    
    nameVideo(item, mode=1) {
      return (!item.upHere && item.name.length > 30) ? item.name.slice(0, (mode==1)? 30 : 120) + '...' : item.name
    },

    async delete_from_albom(i) {
      console.log('current play-list: ', this.current_play_list)
      console.log('like_button_label:', this.like_button_label)

      //console.log(name_of_video)
      let tmp = new Map(JSON.parse(window.localStorage.getItem('lst_ply_lst')));
      tmp.get(this.current_play_list).videos.splice(i, 1)

      // // console.log(this.play_list_array.get())
      window.localStorage.setItem('lst_ply_lst', JSON.stringify(Array.from(tmp.entries())));
      this.play_list_array = tmp
      console.log('vides into self album: ', this.play_list_array.get(this.current_play_list).videos);
      this.rx_array = this.play_list_array.get(this.current_play_list).videos;

    },

    async template_request() {
      this.rx_array = this.sampling_by_template.slice(0);
      let tname = this.name.trim()

      if (tname!="" && this.recent_request_array.indexOf(tname) < 0) { 

          this.recent_request_array.push(tname)
          window.localStorage.setItem('recent_request_list', JSON.stringify(this.recent_request_array))

      }


      // await this.csr()
      this.name = ''; 
      // this.rx_array = this.array_videos.slice(0)
      this.sampling_by_template = []

      // let properties = {
      //   type: "video",
      //   page: this.currentPage,
      //   limit: this.video_values,
      //   flag: flag
      // }

      // console.info(this.selected_part)
      // const response = await fetch('/g', {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(properties)
      // })

      // let result = await response.json()
    },

    async open_addvance() {
      this.show_extra = !this.show_extra
      this.show_pen = false
      if (!this.show_extra) this.show_like_button = false;
    },

    async sdp() {
      this.show_download_panel = !this.show_download_panel
      this.like_button_label = ""
    },

    async show_like_button_func(key) {
      //this.show_like_button = !this.show_like_button;
      this.like_button_label = key;
      this.current_play_list = 'All'
      this.rx_array = this.array_videos.slice(0);
      this.show_like_button = true

    },

    async delete_albom(key) {
      //this.play_list_array = new Map(JSON.parse(window.localStorage.getItem('lst_ply_lst')));


      this.play_list_array.delete(key)
      window.localStorage.setItem('lst_ply_lst', JSON.stringify(Array.from(this.play_list_array.entries())));
      //console.log(tmp)
      //console.log(item)


    },
    async play_video(index) {
      let pls = document.getElementsByClassName('videos');
      pls[index].play();
    },

    async reset_video(index) {
      let pls = document.getElementsByClassName('videos');
      pls[index].load();
    },
    async full_video(index) {
      let pls = document.getElementsByClassName('videos');
      pls[index].requestFullscreen()
    },

    async create_new_play_playlist(name_of_play_list) {
      console.log(name_of_play_list)
      const obj = {
        videos: []
      }



      this.play_list_array.set(this.name_of_play_list, obj)

      window.localStorage.setItem('lst_ply_lst', JSON.stringify(Array.from(this.play_list_array.entries())));
      //this.play_list_array = new Map(JSON.parse(localStorage.getItem('lst_ply_lst')))




      //this.play_list_array.push(obj)
      this.name_of_play_list = '';


      //window.localStorage.setItem('lst_ply_lst', JSON.stringify(this.play_list_array));

      //this.play_list_array = JSON.parse(window.localStorage.getItem('lst_ply_lst'))

      // this.play_list_array.splice(this.play_list_array.indexOf(this.done), 1)
      // window.localStorage.setItem('lst_ply_lst', JSON.stringify(this.play_list_array));
      // this.play_list_array = JSON.parse(window.localStorage.getItem('lst_ply_lst'))



    },
    async edit_item(item) {
      item.edit_mode_video = !item.edit_mode_video

    },

    async add_to_like(name_of_video) {
      // Swal.fire({
      //   title: '<strong>HTML <u>example</u></strong>',
      //   icon: 'info',
      //   html:
      //     '<button class=""' +
      //     '<a href="//sweetalert2.github.io">links</a> ' +
      //     '',
      //   showCloseButton: true,
      //   showCancelButton: true,
      //   focusConfirm: false,
      //   confirmButtonText:
      //     '<i class="fa fa-thumbs-up"></i> Great!',
      //   confirmButtonAriaLabel: 'Thumbs up, great!',
      //   cancelButtonText:
      //     '<i class="fa fa-thumbs-down"></i>',
      //   cancelButtonAriaLabel: 'Thumbs down'
      // })


      console.log(name_of_video)
      let tmp = new Map(JSON.parse(window.localStorage.getItem('lst_ply_lst')));
      tmp.get(this.like_button_label).videos.push({ name: name_of_video })

      // console.log(this.play_list_array.get())
      window.localStorage.setItem('lst_ply_lst', JSON.stringify(Array.from(tmp.entries())));
      this.play_list_array = tmp
      //this.play_list_array = new Map(JSON.parse(localStorage.getItem('lst_ply_lst')))
      //this.current_play_list.videos.push(name_of_video);

      //this.play_list_array

      //window.localStorage.setItem('lst_ply_lst', JSON.stringify(this.play_list_array));

    },

    async select_play(item) {
      console.log('selected_play 12313: ', item)

      if (item=='recent') {
        console.log('Тут Тут Тут сработало!!!!!!!!!!!!')
        console.log(this.rx_array)
        this.rx_array = this.recent_arr.slice(0); 
        this.current_play_list = 'Recent'
        console.log(this.recent_arr)

        //.name_of_play_list = item[0]
        // for (let [key, value] of tmp) {
        //   console.log(key, value, item[0])

        //   // this.rx_array = value;
        // }

        //this.totalpages = Math.ceil(this.rx_array / this.video_values)
      } else if (item == 'all') {
        this.rx_array = this.array_videos.slice(0); 
        this.current_play_list = 'All'
      } else {
        this.hide_default_point_tmp = true; // логика с выбором дэфолтного плей листа
        this.current_play_list = item[0]
        let tmp = new Map(JSON.parse(window.localStorage.getItem('lst_ply_lst')))


        console.log('wtf', tmp.get(item[0]))
        this.rx_array = tmp.get(item[0]).videos
      }


    },

    async clean() {
      this.batch_list = [];
      localStorage.clear();
    },

    async check() {
      if (this.dayes == 1) {
        this.dayes = 0;
        return true;
      }
      return false;
    },
    async crumbs(page) {
      this.currentPage = page
      await this.g()
    },
    async change_count() {
      //this.array_videos = [];
      this.currentPage = 0;
      //this.rx_array = []
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
      this.array_videos = [];
      this.currentPage = 0;
      this.rx_array = []
      await this.g()
      // let result = await response.json()
      // this.array_videos = result['items']
      // this.rx_array = this.array_videos
      // this.folder = result['route']
    },
    async show_poster_func() {
      this.show_poster = !this.show_poster
      let array_of_players = document.getElementsByClassName('videos')
      for (let i = 0; i < array_of_players.length; i++) {
        // array_of_players[i].currentTime=0;
        array_of_players[i].load();
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
      this.sampling_by_template = []
      if (this.name != "") {
        //for (let i = 0; i < this.lst_srch.length; i++) {
        this.sampling_by_template = this.lst_srch.filter(item => rx.test(item.name.toLowerCase()))
            // this.sampling_by_template.push(this.lst_srch[i])

            //console.log(`this.video: ${this.lst_srch[i].name}`)
          //}
        //} 
      } else { // заполняем тем что было до поиска
        this.rx_array = this.array_videos.slice(0)
      }
      // this.name = ""
      // console.log(this.rx_array)
      // console.info(this.array_videos)
      // this.array_videos=[]

    },
    async sendMessage() {
      // alert(message)
      console.log(this.ws);
      this.ws.send("Привет уёбок");

    },

    async g(flag=false) {
      let properties = {
        type: "video",
        page: this.currentPage,
        limit: this.video_values,
        flag: flag
      }

      console.info(this.selected_part)
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify(properties)
      })

      let result = await response.json()

      if (!flag) {
        this.array_videos = result['items'].slice(0)
        this.rx_array = this.array_videos.slice(0)
        this.backup = this.array_videos.slice(0)
        this.folder = result['route']
        this.recent_arr = result['recent']

        console.log('Ограничение видео на страницу: ', properties.limit)
        // this.totalpages = Math.ceil(productscount / productsPerPage)
        this.totalpages = Math.ceil(result['count_videos'] / properties.limit)

        this.totalvideos = result['count_videos']
      } else {
        this.lst_srch = result['items']
        //this.sampling_by_template = result['items']
      }


    },

    async run_download(url) {
      this.url = "" // очищаем поле ввода
      this.batch_list.push(url)
      window.localStorage.setItem('url_list', JSON.stringify(this.batch_list));
      // console.log(123123, window.localStorage.getItem('url_list'))
      // this.$emit('wait', true)
      const response = await fetch(`/g/s?url=${url}`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Authorization': window.localStorage.getItem('jwt'),
        }

      })

      this.done_string = (await response.json())['wait']
      console.log(`result: ${this.done_string}`)
      this.batch_list = JSON.parse(window.localStorage.getItem('url_list'))

      this.batch_list.splice(this.batch_list.indexOf(this.done), 1)
      window.localStorage.setItem('url_list', JSON.stringify(this.batch_list));
      this.batch_list = JSON.parse(window.localStorage.getItem('url_list'))
      // console.log('аааааааааа')
      // await this.sendMessage()


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
