<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="row">
        <div class="col-sm-6" style="">
            <div v-for="(item, i) in messages" :key="i" :class="{'alert my-1 py-2 myclass': true, 'alert-success': item[1], 'alert-secondary': !item[1]}">
                {{ item[0] }}
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
    created() {
        console.log("Запускаю процедуру подключения к WebSocket Server")


        this.connection = new WebSocket("ws://192.168.175.184:3000")
        this.connection.binaryData = "blob";
        this.connection.onmessage = (event) => {
            // console.log(event.data.text());
            console.log(event.data);
            this.my=false
            this.messages.push([event.data, false])

        }

        this.connection.onopen = function (event) {
            console.log('onopen connection', event)
            // alert("Соединение установлено.");
            console.log("Подключение успешно завершено к websocket server...")
        }

        this.connection.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        // const wsSend = function (data) {
        //   // readyState - true, если есть подключение
        //   if (!wsConnection.readyState) {
        //     setTimeout(function () {
        //       wsSend(data);
        //     }, 100);
        //   } else {
        //     wsConnection.send(data);
        //   }
        // };

        // const sendMessage = (message) => conn.send(JSON.stringify({ event: "chat-message", payload: { userName, message }}));


    },
    methods: {
        async send() {
            this.messages.push([this.message, true])
            await this.sendMessage()
        },
        async sendMessage() {
            // alert(message)
            console.log(this.connection);
            await this.connection.send(this.message);
            
        },
    }
}
</script>