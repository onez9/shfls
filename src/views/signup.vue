<script setup>
import Swal from 'sweetalert2';
import {sha224, sha256} from 'js-sha256';
</script>

<template>
    <div class="row d-flex justify-content-center wh1 align-items-center">
        <div class="col-sm-4">
            <!-- <form action="/g/create_account" method="POST"> -->
            <!-- <form @submit="addProduct(e)" > -->
            <!-- <form ref="form">   -->
            <!-- <form @submit="createAccount" method="post" action="/g/create_account"> -->
            <!-- <form action="/g/create_account" method="post"> -->
            <label for="login">Логин: <span v-if="!login && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="login" v-model="login" id="login" type="text" class="form-control" placeholder="login">
            <label for="email">Адрес электронной почты: <span v-if="!email && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="email" v-model="email" id="email" type="email" class="form-control" placeholder="email">
            <label for="phone">Телефон: <span v-if="!phone && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="phone" v-model="phone" id="phone" type="tel" class="form-control" placeholder="phone">
            <label for="age">Возраст: <span v-if="!age && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="age" v-model="age" id="age" type="number" class="form-control" placeholder="age" min="0" max="100">
            <label for="pass1">Придумайте пароль: <span v-if="!pass1 && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="pass1" v-model="pass1" id="pass1" type="password" class="form-control" placeholder="password">
            <label for="pass2">Повторите пароль: <span v-if="!pass2 && flag" class="text-danger">Это поле обязательно для заполнения</span></label>
            <input name="pass2" v-model="pass2" id="pass2" type="password" class="form-control" placeholder="passwrod">
            <button class="btn btn-sm btn-outline-danger form-control mt-1" type="button" @click="createAccount()">Зарегистрироваться</button>
            <button class="btn btn-sm btn-outline-danger form-control mt-1" type="button" @click="clear()">Отмена</button>
            <!-- </form> -->
            <router-link to="/g/login">Войти</router-link>
            
        </div>
    </div>

</template>

<style scoped>
.wh1 {
    height: 100vh;
}
</style>

<script>
export default {
    setup() {

    },
    data() {
        return {
            login: '',
            email: '',
            phone: '',
            age: '',
            pass1: '',
            pass2: '',
            flag: false

        }
    },
    async mounted() {

    },
    props: {

    },
    watch: {

    },
    methods: {
        async clear() {
            this.login = "";
            this.email = "";
            this.phone = "";
            this.age = "";
            this.pass1 = "";
            this.pass2 = "";
        },
        

        async getSHA256Hash(input) {
            const textAsBuffer = new TextEncoder().encode(input);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray
                .map((item) => item.toString(16).padStart(2, "0"))
                .join("");
            return hash;
        },
        async createAccount(e) {
            // window.location.reload()
            // this.$emit('submit', this.login, this.email, this.age, this.pass1, this.phone)
            // this.$emit('submit', this.form)
            // e.preventDefault()

            // console.log('werwerwerwreewr453 53345 355344 ', e)


            // this.$refs.form.$el.submit()
            this.flag = true

            if (this.login && this.email && this.age && this.pass1 && this.pass2 && this.phone) {
                if (this.pass1 == this.pass2) {
                
                
                    //this.$emit('submit', this.login, this.email, this.age, this.pass1, this.phone)
                    const response = await fetch('/u/create_account', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            login: this.login,
                            email: this.email,
                            phone: this.phone,
                            age: this.age,
                            password: sha256(this.pass1)
                        })
                    })
                    
                    let result = await response.json()
                    console.info('create new user: ', result.statusOk)
                    //window.location.href = '/g/login'
                    console.log(`Router: ${this.$router}`)
                    this.$router.push({ path: '/g/login' })



                } else {
                    alert('Проверьте пароль')
                }
            } else {
                alert('Заполните все поля')
            }

            // e.preventDefault();



        }
    }
}
</script>