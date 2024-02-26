<script setup>
import Swal from 'sweetalert2';
import { sha224, sha256 } from 'js-sha256';
</script>

<template>
  <div class="row wh1 d-flex justify-content-center align-items-center">
    <div class="col-sm-4">
      <label for="login">Логин: <span v-if="!login && flag">Поле обязательно</span></label>
      <input v-model="login" id="login" type="text" class="form-control" placeholder="Логин">
      <label for="password">Пароль: <span v-if="!login && flag">Поле обязательно</span></label>
      <input 
        v-model="password" 
        v-on:keyup.enter="login_func"
        id="password" 
        type="password" 
        class="form-control" 
        placeholder="Пароль">
      <button class="btn-login" @click="login_func">Войти</button>
      <router-link to="/g/signup">Создать аккаунт</router-link>
    </div>
  </div>
</template>

<style scoped>
.wh1 {
  /* height: 100vh; */
  height: 100vh;
  max-height: 100%;

}
.btn-login {
  width: 100%;
  border: 2px solid darkgray;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
}
</style>

<script>
export default {
  data() {
    return {
      login: '',
      password: '',
      flag: false,
    }
  },
  async mounted() {
    this.my_name = window.localStorage.getItem('user')
  },
  watch: {

  },
  props: {

  },
  methods: {

    async login_func() {
      this.flag = true
      if (this.login && this.password) {

        let response = await fetch('/u/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',

          },
          body: JSON.stringify({
            login: this.login,
            password: sha256(this.password)
          }),

        })


        if (response.ok) {
          let result = await response.json();
          console.info(`Это результат при входе: ${result}`)
          console.info(result.ok)
          window.localStorage.setItem('user_info', JSON.stringify(result['user']));
          window.localStorage.setItem('jwt', result['token']);
          console.log('login this htis: ', result['user']['is_admin'])
          window.localStorage.setItem('is_admin', result['user']['is_admin'])
          this.$router.push({ path: '/' })
          this.$emit('login', {
            answer: 'success',
          })

        } else {
          Swal.fire("Логин или пароль не верный!")
          this.$emit('login', {
            answer: 'fall',
          })

        }





      } else {
        alert('Заполните все поля!')
      }
    }
  }
}
</script>