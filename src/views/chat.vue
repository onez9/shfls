<script setup>
import Swal from 'sweetalert2';
</script>



<template>
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
                <div v-for="(item, i) in messages" :key="i" 
                    :class="{'alert alert-info myclass my-1 py-1': (true), 'alert alert-danger': (item['name']!=name)}" role="alert">
                    <div class="d-flex justify-content-end border rounded mb-1">
                        <span class="me-auto ms-3">{{ item['name'] }}</span>
                        <!-- {{ item['sinf']?.type }} -->
                        <button v-if="item['sinf']?.type == 'config'" class="btn btn-sm btn-outline-info" @click="apply_setting(item)">применить</button>
                    </div>


                    <div class="alert alert-secondary m-0 py-0">{{ item['message'] }}</div>
        
                    <!-- {{ item['name'] }} -->
                    <div class="flex-grow-1 mb-1"></div>
                    <div id="time_id" class="d-flex justify-content-end">
                        {{ new Date(item['time']).toLocaleDateString() }} {{ new Date(item['time']).toLocaleTimeString() }}
                    </div>
                   
                </div>
            </div>

            <div class="col-sm-12">
                <div class="input-group my-1">
                    <textarea v-on:keyup.enter="send" v-model="message" type="text" class="form-control ps-2"></textarea>
                    <span class="input-group-text" id="" title="Колличество сообщений">{{ messages.length }}</span>
                    <button class="btn btn-outline-primary"><i class="bi bi-card-text"></i></button>
                    <button id="send1" class="btn btn-outline-primary" @click="send"><i class="bi bi-send"></i></button>

                </div>
                <button @click="send_settings" class="btn btn-outline-info form-control">Добавить настройки в сообщение</button>
            </div>


        </div>
    </div>
</template>


<style scoped>
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
            sinf: '',
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
            //console.log('this value: ', JSON.parse(event.data))
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

    computed: {

    },
    methods: {
        async get_type(item) {
            console.log('вот это сообщение: ', item['sinf']['type'])
        },
        async send_settings() {
            const jplist = window.localStorage.getItem('lst_ply_lst')
            this.sinf = ({ 
                info: jplist,
                type: 'config',
            })
            //console.info('this.settings: ', settings.mark)
        },

        async apply_setting(item) { // применяется только когда клиент получил сообщение
            alert(item['message'])
            
            window.localStorage.setItem('lst_ply_lst', item['sinf'].info)
        },

        async get_message() { // запрашивает все сообщения при старте 
            const response = await fetch('/message/g', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': window.localStorage.getItem('jwt'),
                },
                // body: JSON.stringify({'partion': 'book'})
            })
            
            this.messages=await response.json()
            console.log(this.messages)
        },
        async send() { // send me // show only my client but not send on server
            if (this.message!=="") {
                let current_time = new Date();
                // this.messages.push({'name': this.name, 'message': this.message, 'time': `${current_time.getHours()}:${current_time.getMinutes()}`})
                
                console.log('current_time: ', current_time.toISOString())

                const mess = { 
                    'name': this.name, 
                    'message': this.message, 
                    'time': current_time.toISOString(), 
                    'sinf': this.sinf 
                }
                // 
                this.messages.push(mess)
                await this.sendMessage()
                document.getElementById('cont1').scrollTop += [...document.getElementsByClassName('myclass')].slice(-1)[0].offsetHeight + 4
                
                // document.getElementById('cont1').scrollTop=document.getElementById("tabl1").offsetHeight
                
                
                // alert(document.getElementsByClassName('child').heigth()); //document.getElementsByClassName('child').height();
                // this.messages.reverse()
   
            }
            
        },
        async sendMessage() { // send all users
            console.log(this.connection);
            const current_time = new Date();


            const mess = {
                'name': this.name.toString(),
                'message': this.message, 
                'time': current_time.toISOString(),
                'sinf': this.sinf
            }
            
            
            // await this.connection.send(JSON.stringify({'name': this.name, 'message': this.message, 'time': `${current_time.getHours()}:${current_time.getMinutes()}`}));
            await this.connection.send(JSON.stringify(mess))
            this.message=""
            this.sinf = ""
            
        },

        async setNewName() {
            window.localStorage.setItem('user', this.name);
        }
    }



}
</script>
