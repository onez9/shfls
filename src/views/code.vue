<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import aesjs from 'aes-js'
</script>
<template class="bg-dark">
  <div class="row">
    <!-- <div class="col-sm-6 mt-2 position-fixed end-0"> -->

      <div class="mt-3 d-flex justify-content-center">
      <nav aria-label="Page navigation mt-1 example">
        <ul class="pagination">
          <li v-if="currentPage>0" class="page-item">
            <a class="page-link" href="#" @click="changePage(currentPage-1)">&laquo;</a>
            <!-- <a class="page-link" href="#" @click="changePage(currentPage-1)">...</a> -->
          </li>
          <li v-if="currentPage-5>0">
            <a class="page-link" href="#" @click="changePage(0)">1</a>
          </li>
          <li v-if="currentPage-5>0">
            <a class="page-link" href="#" @click="changePage(currentPage-1)">...</a>
          </li>
      
          <li :class="{'page-item': true, 'active': (page-1==currentPage)}" v-for="page in totalpages" :key="page">
            <a v-if="page+3>currentPage && page < currentPage+5" class="page-link" @click="changePage(page-1)" href="#">{{ page }}</a>
            
            <!-- <a  v-if="page==totalpages-1" class="page-link" href="#"> {{ totalpages }} </a> -->
          </li>




          <li v-if="currentPage<totalpages-5">
            <a class="page-link" href="#" @click="changePage(currentPage-1)">...</a>
          </li>
          <li v-if="currentPage<totalpages-5">
            <a class="page-link" href="#" @click="changePage(totalpages-1)">{{ totalpages }}</a>
          </li>

      
          <li v-if="currentPage<totalpages-1" class="page-item"><a class="page-link" href="#" @click="changePage(currentPage+1)">&raquo;</a></li>
        
        
        
        
        
        
        
        
        
        </ul>
      </nav>
    </div>


    <div class="col-sm-6">

      <div class="col-12 input-group mb-2 mt-2">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Поиск файлов" class="form-control p-2" v-on:input="searching" v-model="name">
        <button @click="name=''; rx_files=files" class="input-group-text" id=""><i class="bi bi-backspace"></i></button>
      </div>


      <table class="table mt-2">
      <!-- <table class="table table-hover table-bordered border-info mt-2"> -->
        <tbody>
          <tr v-for="(item, i) in rx_files" :key="i" class="m-0 p-0 r1" >
            <!-- <td class="m-0 ps-3 pt-0 pb-0 pe-0">{{ i }}</td> -->
            <td class="m-0">{{ item.split('/').slice(-1)[0] }}</td>
            <td class="d-flex"><button class="btn btn-dark btn-sm ms-auto" @click="open_file(item); tmp=item">Открыть</button></td>

          </tr>
        </tbody>
      </table>

    </div>


    <div class="col-sm-6 mt-2 end-0">
      <!-- <table class="table table-dark w-100" style="font-size: 12px;">
        <tbody>
          <tr v-for="(item, i) in code.split('\n')" :key="i">
            <td class="m-0 p-0 pe-2">{{ i+1 }}</td>
            <td style="color: rgb(135, 255, 135)" class="m-0 p-0"><pre style="display: block;" class="h-100 m-0 p-0 bg-dark border border-0">{{ item }}</pre></td>
          </tr>
        </tbody>
      </table> -->

        <textarea id='txa1' class='form-control p-0 textbox border border-1 rounded-0' name="test" cols="30" rows="10">{{ code }}</textarea>
        <span class="tooltiptext">{{ tmp.split('/').slice(-1)[0] }}</span>

    
    
    </div>





  </div>
</template>


<style scoped>
body{
  background-color: black;
}

table:hover{
  background-origin: red;
}
.textbox {
  /* height: 100vh; */
  /* height: 80vh; */
  height: 80vh;
}
.parent1 {
  /* position: fixed; */
  /* overflow: auto; */
  /* transform: scaleX(-1);  */
}

textarea {

  font-size: 10px;
  border-radius: 10px;
  
  /* overflow:auto; */
  /* direction:rtl; */
  /* transform: scaleX(-1);  */
  /* scroll */
  /* color: #17e300; */
}
</style>
<script>

window.addEventListener('scroll', function() {
  // document.getElementById('showScroll').innerHTML = pageYOffset + 'px';
  // alert('hello')
  // document.getElementById('txa1').outerHTML = pageYOffset + 'px';
});


export default {
  data() {
    return {
      currentPage: 0,
      totalpages: 10,

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
  components: {
    // search
  },
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
        if (rx.test(item.toLowerCase())) {
          this.rx_files.push(item)
        }
      })

    },
    async changePage(page) {
      this.currentPage = page
      await this.get_code()
    },
    async open_file(file) {
      const response = await fetch('/g/f_file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'p': file })
      })
      
      this.code = (await response.json())['p']
    },
    async get_code() {
      // alert(this.v1)
      const properties = {
        page: this.currentPage,
        limit: 20,
      }
      const response = await fetch('/g/code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })
      const res = (await response.json())
      this.files = res['items']
      this.totalpages = Math.ceil(res['count_files'] / properties.limit)
      
      this.rx_files=this.files.slice(0)
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