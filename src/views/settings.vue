<script setup>

// import Swal from 'sweetalert2';
// @/compositions/composition.js;
import { ref } from 'vue';
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-6">
                <div class="form-check form-switch mt-2">
                    <input @click="change_theme" v-model="theme_current" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault"> Тёмная тема</label>
                </div>
                <span for="lang_id">Выберите язык</span>
                <select type="select" v-model="lang_select" name="" id="lang_id" class="form-select mt-2">
                    <option value="1">Русский</option>
                    <option value="2">Английский</option>
                    <option value="3">Японский</option>
                    <option value="4">Китайский</option>
                    <option value="6">Корейский</option>
                    <option value="12">Немецкий</option>
                </select>

                <button @click="user.settings.mode=!user.settings.mode" class="btn btn-outline-primary form-control mt-2">Настройки пользователя</button>

                <template v-if="user.settings.mode==true" class="mt-2">
                    <span for="nick_id">Ник</span>
                    <input type="text" placeholder="Your nikname" id="nick_id" class="form-control">
                    <span for="pass_id">Пароль</span>
                    <input type="password" placeholder="password" name="" id="pass_id" class="form-control">
                </template>
                <button class="btn btn-outline-primary mt-2 form-control"><i class=""></i> Сохранить</button>
                <!-- {{ value }}
                {{ theme }} -->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            theme: Boolean,
            wait: Boolean
        },
        // setup(props) {
        //     console.log('12312312342424245345345', props)
        //     let v = ref(true)

        //     return { v }
        // },
        data() {
            return {
                lang_select: 1,
                theme_current: false,
                user: {},
                
            }
        },

        async mounted() {
            console.log('this func: mounted', this.theme)
            this.theme_current=this.theme
            this.user = {
                settings: {
                    mode: false
                }
            }
        },
        created() {
            this.user = {
                settings: {
                    mode: false
                }
            }
        },

        methods: {
            async change_theme() {
                // alert('hello')
                // this.theme = (this.value===true)? 'dark' : 'white';
                // alert(v)
                // this.value=!this.value
                // alert(this.theme)
                // console.log(this.theme)
                this.$emit('updateParent', !this.theme)
            },


        }
    }
</script>