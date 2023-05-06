<script setup>
import { RouterLink, RouterView } from 'vue-router'
//import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
    <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <!--<div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
    </header>
    <main class="container">
        <div class="row">
            <div class="col">
                <label for="id_upload">Загрузить новый файл</label>
                <input
                    id="id_upload"
                    name="file"
                    type="file"
                    class="form-control mb-1">
                
                <div class="row">
                    <div class="col-6">
                        <button
                            class="btn btn-danger mb-3 form-control"
                            @click="upload_file">
                            <i class="bi bi-upload"></i> Загрузить
                        </button>
                    </div>
                    <div class="col-6">
                        <button
                            class="btn btn-dark form-control mb-3"
                            @click="show_qr">
                            <i class="bi bi-qr-code"></i> Создать qr-код
                        </button>
                    </div>
                </div>
                <br />

                <table 
                    id="id_table"
                    class="table">
                    <tbody>
                        <tr v-for="(item, i) in array" :key="i">
                            <td><button class="btn btn-danger"><i class="bi bi-file-binary-fill"></i></button></td>
                            <td>{{ item }}</td>
                            <td>
                                <button @click="download_file(item)" 
                                class="btn btn-dark form-control"><i class="bi bi-download"></i></button>
                            </td>

                        </tr>
                    </tbody>
                </table>


            </div>
        </div>
    </main>
    <footer>

    </footer>

  <!-- <RouterView /> -->
</template>

<style scoped>


</style>

<script>
    export default {
        data() {
            return {
                array: []
            }
        },
        props: {

        },
        computed: {

        },
        async mounted() {
            await this.get_lst()
        },
        methods: {
            async get_lst() {
                let person={
                    name: "Maxi",
                    age: 14
                }
                const response = await fetch('/get', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(person)
                })
                this.array = await response.json()
            },

            async download_file(name) {
                const response = await fetch(`/download?name=${name}`, {
                    // const response = await fetch('/download', {
                    method: 'GET',
                    // credentials: 'include',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                    // body: JSON.stringify({name: name})
                })

                console.log(response)
                //window.open(response);
                window.open(response.url)
            },

            async upload_file() {
                let formData = new FormData()
                let input = document.querySelector('input[type="file"]')

                formData.append('file', input.files[0])
                // formData.append('email', window.localStorage.getItem('user'))
                


                const response = await fetch('/upload', {
                    method: 'POST',
                    credentials: 'include',
                    // headers: {
                    //     'authorization': window.localStorage.getItem('jwt')
                    // },
                    body: formData

                })
                let result = await response.json()
                console.log('Тут ответ который возвращает запрос: ', result)
                document.querySelector('input[type=file]').value = "";
                await this.get_lst()


		    },
            async show_qr() {
                const response = await fetch('/qr', {
                    method: 'GET',
                    credentials: 'include',
                    // headers: {
                    //     'authorization': window.localStorage.getItem('jwt')
                    // },
                    //body: JSON.stringify({200: 200})

                })
                window.open(response.url)
                console.log(response)
            }
        }
    }

</script>


