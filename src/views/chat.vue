<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12 parent" id="cont1">


                <!-- <table id="tabl1" class="table table-hover table-bordered border-info">
                    <tbody> -->
                <div v-for="(item, i) in messages" :key="i" 
                :class="{'alert alert-success myclass my-1 py-1': (true), 'alert alert-info': (item['name']!=name)}">
                    <span>{{ item['name'] }}</span><br />

                    <div class="alert alert-secondary m-0 py-0">{{ item['message'] }}</div>
        

                    <div class="flex-grow-1 mb-1"></div>
                    <div id="time_id" class="d-flex justify-content-end">
                        {{ item['time'] }}
                    </div>
                </div>
                    <!-- </tbody>
                </table> -->
                <!-- {{ messages }} -->
            </div>

            <div class="col-sm-6">
                <div class="input-group my-1">
                    <input v-on:keyup.enter="send" v-model="message" type="text" class="form-control ps-2">
                    <span class="input-group-text" id="">{{ messages.length }}</span>
                    <!-- <input type="file" class="form-control ps-2"> -->
                    <button class="btn btn-dark"><i class="bi bi-card-text"></i></button>
                    <button id="send1" class="btn btn-dark" @click="send"><i class="bi bi-send"></i></button>
                </div>
            </div>

            <!-- <div class="col-sm-6">
                <div class="input-group my-1">

                </div>
            </div> -->

            <!-- <div class="col-sm-6 my-1">
                <button class="btn btn-dark ps-1 pe-1">Изменить имя</button>

            </div> -->


            <div class="col-sm-6" v-if="false">
                <div class="input-group my-1">
                    <input v-model="name" type="text" class="form-control">
                    <button @click="setNewName" class="btn btn-dark p-0 ps-1 pe-1">Изменить имя</button>
        
                </div>

            </div>
            <!-- {{ $attrs }} -->
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
td {
    width: 33%;
    word-break:break-all;
}

#time_id{
    font-size: 10px;
    margin: 0;
}
.parent {
  overflow-y: auto;
  max-height:60vh;
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
        await this.get_message();
    },
    props: {
        theme: String
    },
    created() {
        console.log("I'm running phase conversation")
        console.log(this.$attrs)

        this.connection = new WebSocket(`ws://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}`)
        this.connection.binaryData = "blob";
        this.connection.onmessage = (event) => {
            // console.log(event.data.text());
            // console.log(event.data);
            console.log('this value: ', JSON.parse(event.data))
            // JSON.stringify
            this.my=false
            this.messages.push(JSON.parse(event.data)) // принимаем сообщения от других пользователей

        }

        this.connection.onopen = function (event) {
            console.log('onopen connection', event)
            // alert("Соединение установлено.");
            console.log("Подключение успешно завершено к websocket server...")
        }

        this.connection.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто');
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
        async get_message() { // запрашивает все сообщения при старте 
            const response = await fetch('/g/message', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({'partion': 'book'})
            })
            
            this.messages=await response.json()
            console.log(this.messages)
        },
        async send() { // send me
            if (this.message!=="") {
                let current_time = new Date();
                // this.messages.push({'name': this.name, 'message': this.message, 'time': `${current_time.getHours()}:${current_time.getMinutes()}`})
                this.messages.push({'name': this.name, 'message': this.message, 'time': current_time})
                await this.sendMessage()
                document.getElementById('cont1').scrollTop+=[...document.getElementsByClassName('myclass')].slice(-1)[0].offsetHeight + 4
                
                // document.getElementById('cont1').scrollTop=document.getElementById("tabl1").offsetHeight
                
                
                // alert(document.getElementsByClassName('child').heigth()); //document.getElementsByClassName('child').height();
                // this.messages.reverse()
                console.log()
            }
            
        },
        async sendMessage() { // send all users
            // alert(message)
            console.log(this.connection);
            let current_time = new Date();
            // await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message, 'time': `${current_time.getHours()}:${current_time.getMinutes()}`}));
            await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message, 'time': current_time}))
            this.message=""
            
        },

        async setNewName() {
            window.localStorage.setItem('user', this.name);
        }
    }
}
</script>