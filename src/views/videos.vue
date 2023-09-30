<script setup>
import { registerRuntimeCompiler } from 'vue';
import search from '../../Components/search.vue'
import Swal from 'sweetalert2';
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
        <button :class="{ 'btn btn-outline-danger form-control mt-1': true }" @click="sendMessage()">WebSocket</button>
      </div> -->

      <div class="col mb-1 mt-1 m-0 p-0 me-sm-2">
        <button class="btn btn-sm btn-outline-danger form-control mt-1" @click="show_poster_func"
          title="Показывает\Скрывает постеры на видео"><i class="bi bi-emoji-heart-eyes"></i></button>
      </div>




      <!-- {{ name_of_play_list }} -->

      <!-- {{  play_list_array }} -->
      <!-- <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (aaa>0)}" @click="sorting"><i class="bi bi-filter"></i></button>
      </div> -->
      <!-- <div v-if="false" class="col mb-1 mt-1">
        <button :class="{ 'btn btn-secondary form-control mt-1': true, 'btn-success': (show_names == true) }"
          @click="show_names_f">{{ name_button_spidoznoe_govno }}</button>
      </div> -->

      <!-- раздел просмотра -->
      <!-- <div class="col-sm mb-1 mt-1">
        <select @change="change_page" v-model="selected_part" class="form-select mt-1 bg-dark text-white" name="">
          <option value="add_folder">Добавить папку</option>
          <option value="porno">Порно</option>
          <option value="programming">Программирование</option>
          <option value="_2r2r">2rbina2rista</option>
        </select>
      </div> -->







      <!-- <div class="col mb-1 mt-1">
        <button :class="{'btn btn-secondary form-control mt-1': true, 'btn-success': (show_poster==true)}" @click="show_poster_func"><i class="bi bi-stickies-fill"></i> {{ button_text_poster }}</button>
      </div> -->


      <!-- {{ video_values }} -->

      <div class="col-sm mb-1 mt-2 m-0 p-0">
        <button @click="open_addvance" class="btn btn-sm btn-outline-danger form-control" title="Дополнительно">
          <i class="bi bi-list"></i>
        </button>
      </div>

    </div>
    <div class="row">

      <div v-if="show_extra" class="col-sm p-0 m-0">
        <div class="col-sm mb-1 mt-2">
          <button @click="show_playlist = !show_playlist"
            :class="{ 'btn btn-sm btn-outline-danger form-control': true, 'btn btn-outline-success': (show_playlist == true) }"
            title="Создать новый плейлист">
            <i class="bi bi-folder-plus"></i>
          </button>
        </div>
        <div v-if="show_playlist == true" class="col-sm mt-2 mb-2 ">
          <div class="input-group ">
            <input class="form-control border border-outline-primary" id="name_list" placeholder="Название плейлиста"
              v-model="name_of_play_list">
            <button @click="name_of_play_list = ''" class="input-group-text" id=""><i
                class="bi bi-backspace"></i></button>
          </div>
          <button class="btn btn-outline-primary mt-2 form-control"
            @click="create_new_play_playlist(name_of_play_list)">Создать</button>
        </div>


        <!-- панель загрузки -->
        <div class="col-sm mb-1 mt-1">
          <button @click="sdp" class="btn btn-sm form-control mt-1 btn-outline-danger" title="youtube-dl/search">
            <i class="bi bi-download"></i>
          </button>
        </div>
        <div v-if="show_download_panel == true" class="col-sm-12 mt-2 mb-2 ">
          <div class="input-group mb-2">
            <input type="text" class="form-control bg-dark text-white" :disabled="false" v-model="url"
              placeholder="Панель загрузки видео">
            <button class="btn btn-secondary" @click="run_download(url)">
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
            <button class="btn btn-sm btn-outline-danger form-control mt-1" @click="clean"
              title="Очистить буффер от загружаемых видео">clean</button>
          </div>
        </div>

        <div class="col-sm mb-1 mt-1">
          <button @click="show_pen = !show_pen" class="btn btn-sm form-control mt-1 btn-outline-danger" title="Редактировать play list">
            <i class="bi bi-pen"></i>
          </button>
        </div>

        <div v-if="show_pen" class="col-sm mt-2 ">
          <table class="table table-hover mb-0">
            <tbody>
              <tr v-for="(item, index) in play_list_array" :key="item">
                <td>{{ item[0] }}</td>
                <td class="">
                  <div class="d-flex justify-content-end">
                    <button @click="delete_albom(item[0])" v-if="item[1].edit_mode_video" class="btn btn-outline-info"><i
                        class="bi bi-x"></i></button>
                    <button @click="show_like_button_func(item[0])" v-if="item[1].edit_mode_video"
                      class="btn btn-outline-info ms-1"><i class="bi bi-plus-circle-dotted"></i></button>
                    <button @click="edit_item(item[1])" class="btn btn-outline-info ms-1"><i
                        class="bi bi-pencil"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="play_list_array.size == 0" class="text-center mb-2 p-0">Тут пока ничего нет {{ play_list_array.size }}
          </p>
        </div>




        <div class="col mb-1 mt-1">
          <button @click="lock = !lock" class="btn btn-sm btn-outline-danger form-control mt-1"
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
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            <option value="4">Four</option>
            <option value="6">Six</option>
            <option value="12">Twelve</option>
          </select>
        </div>

        <div class="col mb-1 mt-2">
          <div class="btn-group form-control p-0">
            <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"
              aria-expanded="false">
              <i class="bi bi-list-stars"></i> {{ current_play_list }}
              <!-- <span class="visually-hidden">Toggle Dropdown</span> -->
            </button>
            <!-- {{play_list_array}} -->
            <ul class="dropdown-menu">
              <li @click="rx_array = array_videos; current_play_list = 'All'"><a class="dropdown-item">All</a></li>


              <li @click="select_play(item)" v-for="(item, index) in play_list_array" :key="item">
                <!-- {{ item }} -->
                <a class="dropdown-item" href="#">
                  {{ item[0] }}
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>


      <div class="col-12"></div>



      <div class="col-sm-12 input-group mb-2 mt-2 m-0 p-0">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Панель поиска" class="form-control bg-dark text-white" v-on:keyup.enter="template_request" v-on:input="searching(name)" v-model="name">
        <button @click="name = ''; rx_array = array_videos.slice(0)" class="input-group-text" id=""><i class="bi bi-backspace"></i></button>
      </div>

      <div class="col-sm-12 mx-2 my-2">
        <div class="" v-for="(item, index) in sampling_by_template" :key="item">
          {{ item.name }}
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
        :class="{ 'p-1 pt-2': true, 'col-1': (selected == 12), 'col-2': (selected == 6), 'col-3': (selected == 4), 'col-sm-4': (selected == 3), 'col-6': (selected == 2), 'col-12': (selected == 1) }">

        <!-- {{ item }} -->
        <div class="frame-video p-1 rounded">
          <div class="row p-0 mb-2">
            <div v-if="current_play_list == 'All'" class="col"><button
                class="m-0 p-0 btn btn-sm btn-outline-danger form-control" @click="add_to_like(item.name)"><i
                  class="bi bi-heart"></i> {{ like_button_label }}</button>
            </div>
            <div class="col"><button @click="delete_from_albom(i)"
                class="m-0 p-0 btn btn-sm btn-outline-secondary form-control"><i class="bi bi-x"></i></button></div>
            <div class="col"><button class="m-0 p-0 btn btn-sm btn-outline-danger form-control" @click="reset_video(i)"><i
                  class="bi bi-stop-btn"></i></button></div>
            <div class="col"><button class="m-0 p-0 btn btn-sm btn-outline-danger form-control" @click="play_video(i)"><i
                  class="bi bi-play-btn"></i></button></div>
          </div>
          <figure class="m-0">
            <video class="w-100 videos m-0 p-0"
              v-bind:poster="(show_poster == true && item.upHere !== true) ? '/images/periodic_table.jpg' : `/gifs/${encodeURIComponent(item.name.replace(/(.webm|.mp4|.mkv|.avi)/gi, '.gif'))}`"
              @mouseover="item.upHere = true" @mouseleave="item.upHere = false" loop preload="none" controls="controls">
              <source :src="`/g?name=${encodeURIComponent(item.name)}`" type="video/mp4" />
            </video>
            <!-- <figcaption>
              <label id="timer" for="progress" role="timer"></label>
              <progress id="progress" max="100" value="0">Progress</progress>
            </figcaption> -->
            <figcaption style="font-size: small" v-if="true" @mouseover="shw_nm_vd = true" @mouseleave="shw_nm_vd = false"
              class="text-break ms-auto">
              <!-- <marquee behavior="scroll" direction="left">{{ item.name }}</marquee> -->
              <!-- {{ item.name }} -->
              {{ nameVideo(item) }}
            </figcaption>
          </figure>
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
  padding: 3px;
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
      sampling_by_template: []
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

    this.batch_list = JSON.parse(window.localStorage.getItem('url_list'))
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
    
    nameVideo(item) {
      return (this.shw_nm_vd==false) ? item.name.slice(0, 40) + '...' : item.name
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
    },

    async sdp() {
      this.show_download_panel = !this.show_download_panel
      this.like_button_label = ""
    },

    async show_like_button_func(key) {
      this.show_like_button = !this.show_like_button;
      this.like_button_label = key;
      this.current_play_list = 'All'
      this.rx_array = this.array_videos.slice(0);

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
      console.log('selected_play: ', item)
      this.hide_default_point_tmp = true; // логика с выбором дэфолтного плей листа
      this.current_play_list = item[0]
      let tmp = new Map(JSON.parse(window.localStorage.getItem('lst_ply_lst')))


      console.log('wtf', tmp.get(item[0]))
      this.rx_array = tmp.get(item[0]).videos
      //.name_of_play_list = item[0]
      // for (let [key, value] of tmp) {
      //   console.log(key, value, item[0])

      //   // this.rx_array = value;
      // }

      //this.totalpages = Math.ceil(this.rx_array / this.video_values)


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
        for (let i = 0; i < this.lst_srch.length; i++) {
          if (rx.test(this.lst_srch[i].name.toLowerCase())) {
            this.sampling_by_template.push(this.lst_srch[i])

            console.log(`this.video: ${this.lst_srch[i].name}`)
          }
        } 
      } else {
        this.rx_array = this.array_videos.slice(0)
      }

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
        },
        body: JSON.stringify(properties)
      })

      let result = await response.json()

      if (!flag) {
        this.array_videos = result['items'].slice(0)
        this.rx_array = this.array_videos.slice(0)
        this.backup = this.array_videos.slice(0)
        this.folder = result['route']

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
