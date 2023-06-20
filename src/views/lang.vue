<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
</script>
<template>
  <div class="row">


    <div class="col-sm-2">
      <!-- <button class="btn btn-info me-1 mt-1 mb-1" @click="lang('jp'); ll1 = true">японский</button> -->
      <!-- <button class="btn btn-info" @click="lang('en'); ll1 = false">английский</button> -->

      <ul class="list-unstyled mb-2 mt-2">

        <li class="mb-1">
          <button @click="lang('jp'); ll1=true"
            class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#download-collapse" aria-expanded="true">
            Японский
          </button>
          <!-- <div class="collapse mt-1" id="download-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><textarea v-model="history" class="form-control mе-1" name="ta1" id="id_ta1" placeholder="История"
                  cols="20" rows="10" disabled></textarea></li>
            </ul>
          </div> -->
        </li>
        <li class="mb-1">
          <button @click="lang('en'); ll1=false"
            class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#download-collapse" aria-expanded="true">
            Английский
          </button>
          <!-- <div class="collapse" id="download-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><input class="form-control mt-1" v-model="caesar_shift" placeholder="Введите сдвиг"></li>
            </ul>
          </div> -->
        </li>

        <li class="mb-1">
          <button @click="type_crypt = 'aes'"
            class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
            Китайский
          </button>
          <!-- <div class="collapse" id="home-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><input class="form-control mt-1" placeholder="Введите ключ"></li>
            </ul>
          </div> -->
        </li>

        <li class="mb-1">
          <button @click="type_crypt = 'xor'"
            class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
            Корейский
          </button>
          <!-- <div class="collapse" id="dashboard-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><input v-model="xor_key" class="form-control mt-1" placeholder="Введите ключ"></li>
            </ul>
          </div> -->
        </li>

        <li class="mb-1">
          <button @click="type_crypt = 'hex'"
            class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
            Немецкий
          </button>
        </li>
      </ul>



    </div>
    <div class="col-sm-8">


      <table class="table table-bordered border-secondary mt-2" >
        <!-- 
        <thead>
        </thead> -->
        <tbody>
          <tr v-for="(string, i) in text">
            <td>{{ i }}</td>
            <td v-if="ll1 == true">{{ string }}</td>
            <td v-if="ll1 == false">{{ string[0] }}</td>
            <td v-if="ll1 == false">{{ string[1] }}</td>
          </tr>
          <!-- {{ text }} -->
        </tbody>

      </table>

    </div>


    <!-- <div id="urvanov-syntax-highlighter-6468a9bddc745355398570" class="urvanov-syntax-highlighter-syntax crayon-theme-monokai-copy urvanov-syntax-highlighter-font-monaco urvanov-syntax-highlighter-os-pc print-yes notranslate" data-settings=" minimize scroll-always" style=" margin-top: 12px; margin-bottom: 12px; font-size: 13px !important; line-height: 20px !important;">
		
        <div class="urvanov-syntax-highlighter-plain-wrap"><textarea wrap="soft" class="urvanov-syntax-highlighter-plain print-no" data-settings="" readonly style="-moz-tab-size:4; -o-tab-size:4; -webkit-tab-size:4; tab-size:4; font-size: 13px !important; line-height: 20px !important;">
int max(int a, int b)
{
return (a &gt; b) ? a : b;
}</textarea></div>
        <div class="urvanov-syntax-highlighter-main" style="">
            <table class="crayon-table">
                <tr class="urvanov-syntax-highlighter-row">
            <td class="crayon-nums " data-settings="show">
                <div class="urvanov-syntax-highlighter-nums-content" style="font-size: 13px !important; line-height: 20px !important;"><div class="crayon-num" data-line="urvanov-syntax-highlighter-6468a9bddc745355398570-1">1</div><div class="crayon-num crayon-striped-num" data-line="urvanov-syntax-highlighter-6468a9bddc745355398570-2">2</div><div class="crayon-num" data-line="urvanov-syntax-highlighter-6468a9bddc745355398570-3">3</div><div class="crayon-num crayon-striped-num" data-line="urvanov-syntax-highlighter-6468a9bddc745355398570-4">4</div></div>
            </td>
                    <td class="urvanov-syntax-highlighter-code"><div class="crayon-pre" style="font-size: 13px !important; line-height: 20px !important; -moz-tab-size:4; -o-tab-size:4; -webkit-tab-size:4; tab-size:4;"><div class="crayon-line" id="urvanov-syntax-highlighter-6468a9bddc745355398570-1"><span class="crayon-t">int</span><span class="crayon-h"> </span><span class="crayon-e">max</span><span class="crayon-sy">(</span><span class="crayon-t">int</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-sy">,</span><span class="crayon-h"> </span><span class="crayon-t">int</span><span class="crayon-h"> </span><span class="crayon-v">b</span><span class="crayon-sy">)</span></div><div class="crayon-line crayon-striped-line" id="urvanov-syntax-highlighter-6468a9bddc745355398570-2"><span class="crayon-sy">{</span></div><div class="crayon-line" id="urvanov-syntax-highlighter-6468a9bddc745355398570-3"><span class="crayon-h">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="crayon-st">return</span><span class="crayon-h"> </span><span class="crayon-sy">(</span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">&gt;</span><span class="crayon-h"> </span><span class="crayon-v">b</span><span class="crayon-sy">)</span><span class="crayon-h"> </span><span class="crayon-sy">?</span><span class="crayon-h"> </span><span class="crayon-v">a</span><span class="crayon-h"> </span><span class="crayon-o">:</span><span class="crayon-h"> </span><span class="crayon-v">b</span><span class="crayon-sy">;</span></div><div class="crayon-line crayon-striped-line" id="urvanov-syntax-highlighter-6468a9bddc745355398570-4"><span class="crayon-sy">}</span></div></div></td>
                </tr>
            </table>
        </div>
    </div> -->
    <!-- <search 
        placeholder="Название книги" 
        :type="type"
        @input="onInputChild">

    </search> -->
    <!-- <p>{{ match_books.length }}</p> -->
    <!-- <div class="col">
            <div v-for="(item, i) in match_books" :key="i">{{ item }}</div>

        </div> -->


  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      type: 'file',
      count: '',
      name: '',
      match_books: [],
      text: '',
      ll1: '',
    }
  },
  async mounted() {
    // await this.get_books()
    // await this.read_file()
  },
  components: {
    search
  },
  methods: {
    async lang(l1) {
      // alert(this.v1)
      console.log('sofsfjoffejw wejrowjrj owerjewo')
      const response = await fetch('/g/lang', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'lang': l1 })
      })
      let result = (await response.json())['res']
      // result=result.split('\n')
      this.text = result
      console.log(this.text)
      // this.rx_array=[]
      // this.array_videos=[]
      // await this.g()
    },

    // async onInputChild(value) {
    //     console.log(value)
    //     alert(value)
    //     // this.count=value
    // },
    // async searching() {
    //     let rx = new RegExp(this.name)
    //     this.match_books = []
    //     this.books.forEach(item => {
    //         if (rx.test(item.toLowerCase())) {
    //             this.match_books.push(item)
    //         }
    //     })
    // },
    // async get_books() {
    //     let properties = {
    //         type: "book",
    //     }
    //     const response = await fetch('/g', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(properties)
    //     })
    //     const result = await response.json()
    //     console.log(result)
    //     this.books = result['items']
    //     this.route = result['route']
    //     this.match_books=this.books
    // }
  }
}
</script>