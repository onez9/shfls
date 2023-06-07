<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import aesjs from 'aes-js'


</script>


<template class="bg-dark">
  <div class="row">
    <div class="col-12 bb1">


      <div class="square">
        <div class="pivont-point">&bull;</div>
      </div>
      <div class="square">
        <div class="pivont-point">&bull;</div>
      </div>
      <div class="square">
        <div class="pivont-point">&bull;</div>
      </div>

    </div>
    <div class="col-12 bb1">


      <div class="square">
        <div class="pivont-point">&bull;</div>
        <button class="btn btn-dark">f3</button>
      </div>
      <div class="square">
        <div class="pivont-point">&bull;</div>
      </div>
      <div class="square">
        <div class="pivont-point">&bull;</div>
      </div>

    </div>
    <div class="col-12 bb2">
      <div class="wrapper">
        <div class="square1 origin-center1">
          <div class="pivont-point1 center1">&bull;</div>
        </div>
      </div>
      <div class="wrapper">
        <div class="square1 origin-center1">
          <div class="pivont-point1 center1">&bull;</div>
        </div>
      </div>
      <div class="wrapper">
        <div class="square1 origin-center1">
          <div class="pivont-point1 center1">&bull;</div>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped>




.bb2 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20vh;
  margin: 0;

  font-family: sans-serif;
}

.square1 {
  position: relative;

  width: 100px;
  height: 100px;

  color: #fff;
  font-size: 1.5em;
  text-align: center;

  background: #2196f3;
  background: linear-gradient(0deg, #2196f3 0%, #bbdefb 100%);
  
  animation: 3s linear infinite rotate1;
}

.pivont-point1 {
  position: absolute;

  color: #363636;
  font-size: 30px;
  
  transform: translate(-50%, -50%);
/*   
  &.center {
    top: 50%;
    left: 50%;
  } */
} 

.origin1 {
  /* &-center {
    transform-origin: center;
  } */
} 

@keyframes rotate1 {
  from {
    transform: rotateX(0deg);
  }

  to {
    transform: rotateX(360deg);
  }
} 







.bb1 {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 20vh;
  margin: 0;
  overflow: hidden;

  font-family: sans-serif;
}

.square {
  position: relative;

  width: 100px;
  height: 100px;
  margin: 0 auto;

  color: #fff;
  font-size: 1.5em;
  text-align: center;

  background: #03a9f4;

  animation: 1s linear infinite rotate;
}

.pivont-point {
  position: absolute;
  top: 50%;
  left: 50%;

  color: #363636;
  font-size: 30px;

  transform: translate(-50%, -50%);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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