<script setup>
import Swal from 'sweetalert2';
</script>

<template>
<div class="row">
    <div class="col-sm-6" style="">
        <div v-for="(item, i) in messages" :key="i" class="alert alert-success my-1 py-2 myclass">
            {{ item }}
        </div>

        <!-- <div class="alert alert-info">
            
        </div> -->
    </div>
</div>

<div class="row">
    <div class="col-sm-6">
        <div class="input-group">
            <input v-on:keyup.enter="send" v-model="message" type="text" class="form-control">
            <button id="send1" class="btn btn-dark" @click="send"><i class="bi bi-send"></i></button>
        </div>
    </div>
</div>
</template>


<style scoped>
.myclass {
    word-wrap: break-word;
}
</style>

<script>

    // $('.send1').on('keyup', function(e) {
    //     if (e.key==='Enter'||e.keyCode===13) {
    //         this.messages.push(this.message)
    //     }
    // })
    export default {
        data() {
            return {
                messages: [],
                message: '',
            }
        },
        async mounted() {

        },
        methods: {
            send() {
                this.messages.push(this.message)
            }
        }
    }
</script>