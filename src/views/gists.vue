<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="row">
        <div class="col">
            <textarea 
              v-model="ta"
              class="form-control mt-1"
              placeholder="Можете набирать текст"
              rows="15"></textarea>
            <button 
              class="btn btn-warning mt-1">Отправить гист</button>
            
            
        </div>
    </div>
</template>


<style scoped>

</style>

<script>
export default{
 data() {
    return {
      ta: '',
    //   wait: false,
    //   dark: false,
    //   current_version: '3.4.5',
    //   authors: 'Арамилев Захар',
    //   stackoverflow: 'https://ru.stackoverflow.com/users/486286/onez9',
    //   gitlab: 'https://gitlab.com/onez9',
    //   logout: false,
    //   color_header: '#ffffff',
    //   scroll: 0,
    //   word: '',
    //   g_random: '',
    //   interval_random: '',
    //   mode_container: false,
    //   run_interval_mode: false,
    //   show_signup_login: false,
    }
  },
  watch: {
    // run_interval_mode() {
    //   console.log('Я выполнюсь или нет')
    //   if (this.run_interval_mode == true) {
    //     this.run_setIntervl()

    //   } else {
    //     clearInterval(this.interval_random);
    //   }



    // }
  },
  components: {
  },

  async mounted() {
    // console.log(process.env)

    // if (window.localStorage.getItem('color_header') == null) {
    //   window.localStorage.setItem('color_header', this.color_header)
    // } else {
    //   this.color_header = window.localStorage.getItem('color_header')
    // }

    // if (window.localStorage.getItem('mode_container') == null) {
    //   window.localStorage.setItem('mode_container', this.mode_container)
    // } else {
    //   this.mode_container = JSON.parse(window.localStorage.getItem('mode_container'))
    // }

    // if (JSON.parse(window.localStorage.getItem('user_info'))?.login == undefined) {
    //   this.show_signup_login = true; 
    // } else {
    //   this.show_signup_login = false;
    //   // await this.run_setIntervl()
    // }
    // console.log(this.dark)
    // console.log(import.meta.env.VITE_TEST_VAR)
    // console.log(import.meta.env.VITE_APP_F23)
    // console.log(import.meta.env.VITE_HOST)
    // console.log(import.meta.env.VITE_PORT)

  },

  methods: {

  }
}

</script>