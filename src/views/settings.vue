<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-6">
                <div class="form-check form-switch">
                    <input @click="change_theme" v-model="value" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault"> Тёмная тема</label>
                </div>

                <span for="nick_id">Придумайте ник</span>
                <input type="text" placeholder="Your nikname" id="nick_id" class="form-control">
                <span for="pass_id">Придумайте пароль</span>
                <input type="password" placeholder="password" name="" id="pass_id" class="form-control">
                <button class="btn btn-dark mt-1"><i class=""></i> Сохранить</button>
                <!-- {{ value }}
                {{ theme }} -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value: true,
                
            }
        },
        async mounted() {

        },
        created() {

        },
        props: {
            theme: String
        },
        
        methods: {
            async change_theme() {
                // alert('hello')
                // this.theme = (this.value===true)? 'dark' : 'white';
                if (this.value) {
                    this.theme='dark'
                    console.log(this.theme)
                } 
                else
                {
                    this.theme='white'
                    console.log(this.theme)
                }
            }
        }
    }
</script>