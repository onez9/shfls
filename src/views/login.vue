<script setup>
import Swal from 'sweetalert2';
import {sha224, sha256} from 'js-sha256';
</script>

<template>
    <div class="row wh1 d-flex justify-content-center align-items-center">
        <div class="col-6">
            <label for="login">Логин: <span v-if="!login && flag">Поле обязательно</span></label>
            <input v-model="login" id="login" type="text" class="form-control" placeholder="Логин">
            <label for="password">Пароль: <span v-if="!login && flag">Поле обязательно</span></label>
            <input v-model="password" id="password" type="password" class="form-control" placeholder="Пароль">
            <button class="btn btn-sm btn-outline-danger mt-1 form-control" @click="login_func">Войти</button>
        </div>
    </div>
</template>

<style scoped>
.wh1 {
    /* height: 100vh; */
    height: 100vh;
    max-height: 100%;
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
                
                let response = await fetch('/users/login', {
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
                    window.localStorage.setItem('user', result['user']['login']);
                    window.localStorage.setItem('jwt', result['token']);
                    console.log('login this htis: ', result['user']['is_admin'])
                    window.localStorage.setItem('is_admin', result['user']['is_admin'])
                    this.$router.push({ path: '/g/files' })

                } else {
                    Swal.fire("Логин или пароль не верный!")

                }





            } else {
                alert('Заполните все поля!')
            }
        }
    }
}
</script>