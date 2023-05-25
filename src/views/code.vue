<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import aesjs from 'aes-js'
</script>
<template class="bg-dark">
  <div class="row">
    <div class="col-sm-6 mt-2">
      <table class="table table-dark w-100" style="font-size: 12px;">
        <tbody>
          <tr v-for="(item, i) in code.split('\n')" :key="i">
            <td class="m-0 p-0 pe-2">{{ i+1 }}</td>
            <td style="color: rgb(135, 255, 135)" class="m-0 p-0"><pre style="display: block;" class="h-100 m-0 p-0 bg-dark border border-0">{{ item }}</pre></td>
          </tr>
        </tbody>
      </table>
      <textarea class='form-control p-0 textbox bg-dark' name="test" id="" cols="30" rows="10">{{ code }}</textarea>

    
    
    </div>
    <div class="col-sm-6">

      <table class="table table-dark table-bordered border-primary mt-2">
        <tbody>
          <tr v-for="(item, i) in files" :key="i" class="m-0 p-0" @click="open_file(item)">
            <td class="m-0 ps-3 pt-0 pb-0 pe-0">{{ i }}</td>
            <td class="m-0 ps-3 pt-0 pb-0 pe-0">{{ item.split('/').slice(-1)[0] }}</td>

          </tr>
        </tbody>
      </table>

    </div>

  </div>
</template>


<style scoped>
.textbox {
  height: 100vh;
}
textarea {
  font-size: 10px;
  border-radius: 0;
  color: #17e300;
}
</style>
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
      en_text: '',
      caesar_shift: '',
      type_crypt: '',
      xor_key: 0,
      enc_mode: 1,
      history: "",
      files: [],
      code: '',
    }
  },
  async mounted() {
    await this.get_code()
  },
  components: {
    // search
  },
  methods: {
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
      const response = await fetch('/g/code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ 'partion': 'book' })
      })
      this.files = (await response.json())['items']
      // this.rx_array=[]
      // this.array_videos=[]
      // await this.g()
    },
    // async onInputChild(value) {
    //     console.log(value)
    //     alert(value)
    //     // this.count=value
    // },
    async searching() {
      let rx = new RegExp(this.name)
      this.match_books = []
      this.books.forEach(item => {
        if (rx.test(item.toLowerCase())) {
          this.match_books.push(item)
        }
      })
    },
    async get_books() {
      let properties = {
        type: "book",
      }
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })
      const result = await response.json()
      console.log(result)
      this.books = result['items']
      this.route = result['route']
      this.match_books = this.books
    }
  }
}
</script>