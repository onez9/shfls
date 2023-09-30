<script setup>
import Swal from 'sweetalert2';
</script>

<template>
<<<<<<< HEAD
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
                
=======
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12 parent bg-dark" id="cont1">


                <!-- <table id="tabl1" class="table table-hover table-bordered border-info">
                    <tbody> -->

                <!-- <div id="liveAlertPlaceholder"></div>
                <button type="button" class="btn btn-primary" id="liveAlertBtn">Show live alert</button>
                <div class="alert alert-primary" role="alert">
                    A simple secondary alert—check it out!
                </div> -->
                <div v-for="(item, i) in messages" :key="i" :class="{'alert alert-info myclass my-1 py-1': (true), 'alert alert-primary': (item['name']!=name)}" role="alert">
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
                    <button class="btn btn-outline-primary"><i class="bi bi-card-text"></i></button>
                    <button id="send1" class="btn btn-outline-primary" @click="send"><i class="bi bi-send"></i></button>
                </div>
            </div>

            <!-- <div class="col-sm-6">
                <div class="input-group my-1">

                </div>
            </div> -->

            <!-- <div class="col-sm-6 my-1">
                <button class="btn btn-dark ps-1 pe-1">Изменить имя</button>

            </div> -->


            <div class="col-sm-6" v-if="true">
                <div class="input-group my-1">
                    <input v-model="name" type="text" class="form-control">
                    <button @click="setNewName" class="btn btn-outline-primary p-0 ps-1 pe-1">Изменить имя</button>
        
                </div>

>>>>>>> t2
            </div>
            <!-- {{ $attrs }} -->
        </div>
    </div>
<<<<<<< HEAD

    <div class="row">
        <div class="col-sm-6">
            <div class="input-group my-2">
                <input v-on:keyup.enter="send" v-model="message" type="text" class="form-control ps-2">
                <span class="input-group-text" id="">{{ messages.length }}</span>
                <button id="send1" class="btn btn-dark" @click="send"><i class="bi bi-send"></i></button>
            </div>
        </div>
    </div>
=======
>>>>>>> t2
</template>


<style scoped>
.myclass {
<<<<<<< HEAD
=======

>>>>>>> t2
    word-wrap: break-word;
}

.child {
  /* display: flex; */
  /* flex-direction: column; */

  /* overflow: ; */
  
}
<<<<<<< HEAD


.parent {
  overflow-y: auto;
  max-height:80vh;
=======
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
>>>>>>> t2
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
<<<<<<< HEAD
=======
        await this.get_message();
>>>>>>> t2
    },
    props: {
        theme: String
    },
    created() {
<<<<<<< HEAD
        console.log("Запускаю процедуру подключения к WebSocket Server")
        console.log(this.$attrs)

        this.connection = new WebSocket("ws://127.0.1.1:3000")
=======
        console.log("I'm running phase conversation")
        console.log(this.$attrs)

        this.connection = new WebSocket(`ws://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}`)
>>>>>>> t2
        this.connection.binaryData = "blob";
        this.connection.onmessage = (event) => {
            // console.log(event.data.text());
            // console.log(event.data);
            console.log('this value: ', JSON.parse(event.data))
            // JSON.stringify
            this.my=false
<<<<<<< HEAD
            this.messages.push([JSON.parse(event.data)['message'], false, JSON.parse(event.data)['name']])
=======
            this.messages.push(JSON.parse(event.data)) // принимаем сообщения от других пользователей
>>>>>>> t2

        }

        this.connection.onopen = function (event) {
            console.log('onopen connection', event)
            // alert("Соединение установлено.");
            console.log("Подключение успешно завершено к websocket server...")
        }

        this.connection.onclose = function (event) {
            if (event.wasClean) {
<<<<<<< HEAD
                console.log('Соединение закрыто чисто');
=======
                console.log('Соединение закрыто');
>>>>>>> t2
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
<<<<<<< HEAD
        async send() {
            if (this.message!=="") {
                this.messages.push([this.message, true, this.name])
                await this.sendMessage()
                document.getElementById('cont1').scrollTop+=[...document.getElementsByClassName('myclass')].slice(-1)[0].offsetHeight + 4
=======
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
                
                
>>>>>>> t2
                // alert(document.getElementsByClassName('child').heigth()); //document.getElementsByClassName('child').height();
                // this.messages.reverse()
                console.log()
            }
            
        },
<<<<<<< HEAD
        async sendMessage() {
            // alert(message)
            console.log(this.connection);
            await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message}));
=======
        async sendMessage() { // send all users
            // alert(message)
            console.log(this.connection);
            let current_time = new Date();
            // await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message, 'time': `${current_time.getHours()}:${current_time.getMinutes()}`}));
            await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message, 'time': current_time}))
>>>>>>> t2
            this.message=""
            
        },

        async setNewName() {
            window.localStorage.setItem('user', this.name);
        }
    }
}
</script>