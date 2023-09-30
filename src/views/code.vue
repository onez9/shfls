<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import aesjs from 'aes-js'
<<<<<<< HEAD
</script>
<template class="bg-dark">
  <div class="row">
    <div class="col-sm-6 mt-2 position-fixed end-0">
      <!-- <table class="table table-dark w-100" style="font-size: 12px;">
        <tbody>
          <tr v-for="(item, i) in code.split('\n')" :key="i">
            <td class="m-0 p-0 pe-2">{{ i+1 }}</td>
            <td style="color: rgb(135, 255, 135)" class="m-0 p-0"><pre style="display: block;" class="h-100 m-0 p-0 bg-dark border border-0">{{ item }}</pre></td>
          </tr>
        </tbody>
      </table> -->

        <textarea id='txa1' class='form-control p-0 textbox ' name="test" cols="30" rows="10">{{ code }}</textarea>
        <span class="tooltiptext">{{ tmp.split('/').slice(-1)[0] }}</span>

    
    
=======
import hljs from 'highlight.js'
import HighLight from "vue3-highlight-component";


</script>
<template class="bg-dark">
  <div class="row">



    <div class="mt-3 d-flex justify-content-center">
      <nav aria-label="Page navigation mt-1 example">
        <ul class="pagination">
          <li v-if="currentPage > 0" class="page-item"><a class="page-link" href="#"
              @click="changePage(currentPage - 1)">&laquo;</a></li>
          <li v-if="currentPage > 3" class="page-item"><a class="page-link" href="#" @click="crumbs(0)">1</a></li>
          <template v-for="(page, i) in totalpages">
            <li v-if="(currentPage - 2 < page) && (currentPage + 4 > page)"
              :class="{ 'page-item': true, 'active': (page - 1 == currentPage) }">
              <a class="page-link" @click="changePage(page - 1)" href="#">{{ page }}</a>
            </li>
          </template>
          <li v-if="currentPage < totalpages - 4" class="page-item">
            <a class="page-link" href="#" @click="changePage(totalpages - 1)">
              {{ totalpages }}
            </a>
          </li>
          <li v-if="currentPage < totalpages - 1" class="page-item"><a class="page-link" href="#"
              @click="changePage(currentPage + 1)">&raquo;</a></li>
        </ul>
      </nav>




    </div>
    <div class="col-sm-6" style="background-color: #151313;">
      <span class="tooltiptext">{{ tmp.split('/').slice(-1)[0] }}</span>
      <HighLight class="m-0 p-0" style="font-size: small;" :with-header="false" language="cpp" :code="code" />

>>>>>>> t2
    </div>

    <div class="col-sm-6">

<<<<<<< HEAD
      <div class="col-12 input-group mb-2 mt-2">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Поиск файлов" class="form-control p-2" v-on:input="searching" v-model="name">
        <button @click="name=''; rx_files=files" class="input-group-text" id=""><i class="bi bi-backspace"></i></button>
      </div>



      <table class="table table-hover table-bordered border-info mt-2">
        <tbody>
          <tr v-for="(item, i) in rx_files" :key="i" class="m-0 p-0 r1" @click="open_file(item); tmp=item">
            <td class="m-0 ps-3 pt-0 pb-0 pe-0">{{ i }}</td>
            <td class="m-0 ps-3 pt-0 pb-0 pe-0">{{ item.split('/').slice(-1)[0] }}</td>
=======


      <table class="table m-0 p-0">
        <!-- <table class="table table-hover table-bordered border-info mt-2"> -->
        <tbody>
          <tr v-for="(item, i) in rx_files" :key="i">
            <td class="m-0 p-0 pb-1 mx-0 bg-secondary"><button class="btn btn-outline-warning btn-sm" @click="open_file(item); tmp = item">Открыть</button></td>
            <td class="m-0 p-0 pb-1">{{ item.split('/').slice(-1)[0] }}</td>
>>>>>>> t2

          </tr>
        </tbody>
      </table>

    </div>

<<<<<<< HEAD
=======






>>>>>>> t2
  </div>
</template>


<style scoped>
<<<<<<< HEAD
body{
  background-color: black;
}

table:hover{
  background-origin: red;
}
=======
body {
  background-color: black;
}

table:hover {
  background-origin: red;
}

>>>>>>> t2
.textbox {
  /* height: 100vh; */
  /* height: 80vh; */
  height: 80vh;
}
<<<<<<< HEAD
=======

>>>>>>> t2
.parent1 {
  /* position: fixed; */
  /* overflow: auto; */
  /* transform: scaleX(-1);  */
}

textarea {

  font-size: 10px;
  border-radius: 10px;
<<<<<<< HEAD
  
=======

>>>>>>> t2
  /* overflow:auto; */
  /* direction:rtl; */
  /* transform: scaleX(-1);  */
  /* scroll */
  /* color: #17e300; */
}
</style>
<script>

<<<<<<< HEAD
window.addEventListener('scroll', function() {
  // document.getElementById('showScroll').innerHTML = pageYOffset + 'px';
  // alert('hello')
  // document.getElementById('txa1').outerHTML = pageYOffset + 'px';
});


export default {
  data() {
    return {
=======
// window.addEventListener('scroll', function() {
//   // document.getElementById('showScroll').innerHTML = pageYOffset + 'px';
//   // alert('hello')
//   // document.getElementById('txa1').outerHTML = pageYOffset + 'px';
// });


export default {
  setup() {
    // console.log('12312312342424245345345', props)
    // let v = ref(true)

    // return { v }
  },
  components: {
    HighLight

  },

  data() {
    return {
      currentPage: 0,
      totalpages: 10,

>>>>>>> t2
      books: [],
      type: 'file',
      count: '',
      name: '',
      match_books: [],
      text: '',
      en_text: '',
      caesar_shift: '',
      type_crypt: '',
      xor_key: 0,
      enc_mode: 1,
      history: "",
      files: [],
      rx_files: [],
      code: '',
      tmp: ''
    }
  },
  async mounted() {
    await this.get_code()
  },
<<<<<<< HEAD
  components: {
    // search
  },
  methods: {
    async searching() {
      console.log('ksfjsl ksfjsldfj ')
      let rx = new RegExp(this.name)
      this.rx_files = []
      this.files.forEach(item => {
=======

  methods: {
    async f1(page) {
      alert(page)
      return true;
    },
    async searching() {
      const response = await fetch('/g/all_files', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(properties)
      })
      const res = (await response.json())
      const files = res['items']

      console.log('ksfjsl ksfjsldfj ')
      let rx = new RegExp(this.name)
      this.rx_files = []
      files.forEach(item => {
>>>>>>> t2
        if (rx.test(item.toLowerCase())) {
          this.rx_files.push(item)
        }
      })

    },
<<<<<<< HEAD
=======
    async changePage(page) {
      this.currentPage = page
      await this.get_code()
    },
>>>>>>> t2
    async open_file(file) {
      const response = await fetch('/g/f_file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'p': file })
      })
<<<<<<< HEAD
      
=======

>>>>>>> t2
      this.code = (await response.json())['p']
    },
    async get_code() {
      // alert(this.v1)
<<<<<<< HEAD
=======
      const properties = {
        page: this.currentPage,
        limit: 20,
      }
>>>>>>> t2
      const response = await fetch('/g/code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
<<<<<<< HEAD
        // body: JSON.stringify({ 'partion': 'book' })
      })
      this.files = (await response.json())['items']
      this.rx_files=this.files
=======
        body: JSON.stringify(properties)
      })
      const res = (await response.json())
      this.files = res['items']
      this.totalpages = Math.ceil(res['count_files'] / properties.limit)

      this.rx_files = this.files.slice(0)
>>>>>>> t2
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
    //   let rx = new RegExp(this.name)
    //   this.match_books = []
    //   this.books.forEach(item => {
    //     if (rx.test(item.toLowerCase())) {
    //       this.match_books.push(item)
    //     }
    //   })
    // },
    // async get_books() {
    //   let properties = {
    //     type: "book",
    //   }
    //   const response = await fetch('/g', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(properties)
    //   })
    //   const result = await response.json()
    //   console.log(result)
    //   this.books = result['items']
    //   this.route = result['route']
    //   this.match_books = this.books
    // }
  }
}
</script>