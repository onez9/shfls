<script setup>
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12 mt-2 mb-2 input-group">
        <input type="text" class="form-control" :disabled="wait" v-model="url" placeholder="Вставьте ссылку на видео">
        <button class="btn btn-secondary" @click="run_download(url)">
          <i v-if="wait==false" class="bi bi-download"></i>
          <span v-if="wait==true" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-if="wait==true"> Loading</span>
        </button>
        <button v-if="wait==true" class="btn btn-danger" @click="wait=false">
          <i class="bi bi-x-diamond"></i>
        </button>
      </div>
      <div class="col-12 mb-2">
        <button class="form-control btn btn-warning" @click="sendMessage('здравствуйте я с клиента')">Кнопка для тестирования WebSocket</button>
      </div>
      <div class="col-4" v-for="(item, i) in array_videos" :key="i">

        <figure>
          <video class="w-100 m-0 p-0" controls>
            <source :src="`/g?name=${encodeURIComponent(item)}`" type="video/mp4" />
          </video>
          <!-- <figcaption class="text-break">{{ item }}</figcaption> -->
        </figure>
        <br />
      </div>


    </div>
  </div>
</template>


<style scoped>
/* video{
  width: ;
} */
</style>
<script>
export default {
  data() {
    return {
      // img: '/files/1625818612_6-kartinkin-com-p-anime-v-realnoi-zhizni-oboi-anime-krasivo-6.jpg',
      array_videos: [],
      url: "",
      re1: '',
      connection: null,
      route: '',
      wait: false

    }
  },
  async mounted() {
    await this.g()
  },
  props: {
    // wait: Boolean,
  },
  created() {
    console.log("Запускаю процедуру подключения к WebSocket Server")
    this.connection = new WebSocket("ws://192.168.36.184:3000")

    this.connection.onmessage = function (event) {
      // console.log(event.data.text());
      console.log(event.data);

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

    async sendMessage(message) {
      // alert(message)
      console.log(this.connection);
      this.connection.send(message);
    },

    async g() {
      let properties = {
        type: "video"
      }
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })
      
      let result = await response.json()
      this.array_videos = result['items']
      this.folder = result['route']
      


    },

    async run_download(url) {
      this.wait=true
      // this.$emit('wait', true)
      const response = await fetch(`/g/s?url=${url}`, {
        method: "GET",

      })
      this.wait = (await response.json())['wait']
      this.url = ""
      // console.log('аааааааааа')
      await this.g()
    },

    async somefunc(image) {
      image.remove();
      URL.revokeObjectURL(image.src); //удаляет внутреннюю ссылку на объект,
      //что позволяет удалить его (если нет другой ссылки) сборщику мусора,
      //и память будет освобождена.
    }

  }
}
</script>