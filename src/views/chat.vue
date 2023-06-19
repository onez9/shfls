<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="row">
        <div class="col-sm-6 parent" id="cont1">
            <div v-for="(item, i) in messages" :key="i" 
            :class="{'alert my-1 myclass input-group p-0': true, 'alert-success': item[1], 'alert-secondary': !item[1]}">
            <!-- class="alert alert-warning my-1 py-2 myclass child" -->
                <span class="input-group-text bg-transparent ps-1 p-0 pe-2">{{ item[2] }}</span>
                <span class="input-group-text flex-fill p-0 ps-1">{{ item[0] }}</span>
            </div>

            <!-- <div class="alert alert-info">
            
        </div> -->
        </div>

        <div class="col-sm-6">
            <div class="input-group my-1">
                <input v-model="name" type="text" class="form-control p-0 pe-1 ps-1">
                <button @click="setNewName" class="btn btn-dark p-0 ps-1 pe-1">Изменить имя</button>
                
            </div>
            <!-- {{ $attrs }} -->
        </div>
    </div>

    <div class="row">
        <div class="col-sm-6">
            <div class="input-group my-2">
                <input v-on:keyup.enter="send" v-model="message" type="text" class="form-control ps-2">
                <span class="input-group-text" id="">{{ messages.length }}</span>
                <button id="send1" class="btn btn-dark" @click="send"><i class="bi bi-send"></i></button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.myclass {
    word-wrap: break-word;
}

.child {
  /* display: flex; */
  /* flex-direction: column; */

  /* overflow: ; */
  
}


.parent {
  overflow-y: auto;
  max-height:80vh;
  /* display: flex; */
  /* flex-direction: column-reverse; */
  
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
            inheritAttrs:false,
            messages: [],
            message: '',
            name: '',
        }
    },
    async mounted() {
        this.name=window.localStorage.getItem('user');
    },
    props: {
        theme: String
    },
    created() {
        console.log("Запускаю процедуру подключения к WebSocket Server")
        console.log(this.$attrs)

        this.connection = new WebSocket("ws://192.168.1.9:3000")
        this.connection.binaryData = "blob";
        this.connection.onmessage = (event) => {
            // console.log(event.data.text());
            // console.log(event.data);
            console.log('this value: ', JSON.parse(event.data))
            // JSON.stringify
            this.my=false
            this.messages.push([JSON.parse(event.data)['message'], false, JSON.parse(event.data)['name']])

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
            if (this.message!=="") {
                this.messages.push([this.message, true, this.name])
                await this.sendMessage()
                document.getElementById('cont1').scrollTop+=[...document.getElementsByClassName('myclass')].slice(-1)[0].offsetHeight + 4
                // alert(document.getElementsByClassName('child').heigth()); //document.getElementsByClassName('child').height();
                // this.messages.reverse()
                console.log()
            }
            
        },
        async sendMessage() {
            // alert(message)
            console.log(this.connection);
            await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message}));
            this.message=""
            
        },

        async setNewName() {
            window.localStorage.setItem('user', this.name);
        }
    }
}
</script>