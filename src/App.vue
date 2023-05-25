<script setup>

import { RouterLink, RouterView } from 'vue-router'
import search from '../Components/search.vue';
import nv from '../Components/nv.vue'
import Swal from 'sweetalert2';

</script>



<template>
  <!-- <p>The username to test is <%=process.env.VITE_TEST_VAR %></p> -->
  <header class="container-fluid p-0">
    <nv :theme="theme" />
    <!-- <content-header></content-header> -->
  </header>
  <main class="container-fluid">
    <RouterView :wait="wait" :theme="theme" />

  </main>

  <!-- <footer>

  </footer> -->

</template>

<style scoped></style>

<script>
// new Vue

// const app = vue.createApp({})
// app.component('button-counter', {
//   data() {
//     return {
//       count: 0
//     }
//   },
//   template: `
//     <button v-on:click="count++">
//       You clicked me {{ count }} times.
//     </button>`
// })
// app.mount('#components-demo')
export default {
  data() {
    return {
      wait: false,
      theme: 'dark',
    }
  },
  watch: {

  },
  components: {
  },
  // template1: `
  //   <button @click="count++">
  //     You clicked me {{ count }} times.
  //   </button>`,
  // components: {
  //   template1
  // },
  async mounted() {
    // console.log(process.env)
    console.log(import.meta.env.VITE_TEST_VAR)
    console.log(import.meta.env.VITE_APP_F23)
  },

  methods: {

  }

}

</script>


