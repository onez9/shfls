<script setup>
import Swal from 'sweetalert2';
</script>

<template>
  <div class="row" id="elements">
    <div class="col">
      <!-- <div class="row"> -->
      <!-- <label for="id_upload">Загрузить новый файл</label> -->
      <input id="id_upload" title="это подсказка для тебя" name="file" type="file"
        class="form-control mb-1 mt-1 bg-dark text-white" multiple>
      <!-- <progress id="progressBar" value="0" max="100" class="form-control mt-2"></progress> -->

      <div class="progress mb-1" v-if="this.proccess_value!==0">
        <div 
          class="progress-bar progress-bar-striped progress-bar-animated" 
          role="progressbar" 
          aria-label="Example with label" 
          :aria-valuenow="proccess_value"
          aria-valuemin="0" 
          aria-valuemax="100" 
          id="progressBar" :style="'width: ' + proccess_value +'%;'"> {{ proccess_value }}%

        </div>
      </div>
      <!-- 
      <div>
        <b-progress :value="value" :max="max" show-progress animated></b-progress>
        <b-progress class="mt-2" :max="max" show-value>
          <b-progress-bar :value="value * (6 / 10)" variant="success"></b-progress-bar>
          <b-progress-bar :value="value * (2.5 / 10)" variant="warning"></b-progress-bar>
          <b-progress-bar :value="value * (1.5 / 10)" variant="danger"></b-progress-bar>
        </b-progress>

        <b-button class="mt-3" @click="randomValue">Click me</b-button>
      </div> -->

      <!-- </div> -->
      <!-- <p align="left">sdfsdf fsdfjo jfosdof j</p> -->
      <!-- <p><img src="/images/europe.png" alt="Европа" width="422" height="387" usemap="#Map">
				<map name="Map">
					<area shape="poly"
						coords="192.168.1.103,192.168.1.103,192.168.1.103,84,95, 192.168.1.103,192.168.1.103,192.168.1.103"
						href="is.html" alt="Исландия">
					<area shape="poly"
						coords="192.168.1.103,192.168.1.103,192.168.1.103, 192.168.1.103,192.168.1.103,192.168.1.103,192.168.1.103"
						href="fr.html" alt="Франция">
					<area shape="poly"
						coords="192.168.1.103,192.168.1.103,192.168.1.103, 192.168.1.103,192.168.1.103,192.168.1.103"
						href="pl.html" alt="Польша">
				</map>
			</p> -->
      <!-- <p>Напитки</p>
			<ol>

				<li>Кофе</li>
				<li>Чай
					<ul>
						<li>Зелёный Чай</li>
						<li>Черный Чай</li>
					</ul>
				</li>
			</ol> -->
      <div class="row">
        <div class="col-sm">
          <button class="btn btn-outline-danger mb-1 w-100" @click="upload_file">
            <i class="bi bi-upload"></i>
          </button>
        </div>
        <div class="col-sm">
          <button class="btn btn-outline-danger mb-1 w-100" @click="show_qr">
            <i class="bi bi-qr-code"></i>
          </button>
          <!-- <button @click="send_on_download" class="btn btn-info mb-3">Стандартная папка</button> -->
        </div>
        <div class="col-sm">
          <button v-if="item1 == true" class="btn btn-outline-danger mb-1 w-100" @click="show_all_pic">
            Развернуть
          </button>
          <button v-else class="btn btn-outline-danger mb-1 w-100" @click="show_all_pic">
            Скрыть
          </button>
        </div>

      </div>

      <!-- <table id="id_table" class="table text-nowrap table-borderless table-hover"> -->
      <table id="id_table" class="table table-hover">
        <thead>
          <tr>
            <td>name</td>
            <td>size</td>
            <td>mdate</td>
            <td>mtime</td>
            <td>options</td>
          </tr>
        </thead>
        <tbody>
          <template @click="activeElem = element" v-for="(item, index) in array" :key="index">
            <tr>
              <!-- {{ item }} -->
              <!-- <td><button class="btn btn-danger"><i class="bi bi-file-binary-fill"></i></button></td> -->
              <td @click="item.showmode =! item.showmode" class="align-middle text-break p-0">{{ item.name }}</td>
              <td class="align-middle text-break p-0">{{ parseInt(item.info.size / 1024) }} Kb</td>
              <td class="align-middle text-break p-0">{{ item.info.mtime.split('T')[0].toString() }}</td>
              <td class="align-middle text-break p-0">{{ item.info.mtime.split('T')[1].toString() }}</td>
              <!-- <td><img v-if="item.showmode" class="w-100" :src="`/downloads/${item.name}`" alt=""></td> -->
              <!-- {{ item }} -->


              <td class="p-0">
                <div class="d-flex justify-content-end">
                  <button @click="delete_file(item)" class="btn btn-sm btn-outline-info mt-1 mb-1 me-1"><i class="bi bi-recycle"></i></button>
                  <button @click="download_file(item)" class="btn btn-sm btn-info mt-1 mb-1"><i class="bi bi-download"></i></button>
                </div>

              </td>


            </tr>
            <tr v-if="item.showmode" class="bg-dark">
              <td>
                  <img style="width: 100%;" class="rounded" :src="`/downloads/${item.name}`" alt="">
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="d-flex justify-content-center"><p v-if="array.length==0">Файлов не обнаружено</p></div>


    </div>
  </div>
</template>


<style scoped>
.d-flex,
.justify-content-end {
  padding: 0;
  margin: 0;
}

.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  /* ackground-color:rgb(255, 0, 0); */
  color: #3b31c2;
}
</style>

<script>



export default {
  el: '#elements',
  data() {
    return {
      array: [],
      result: [],
      route: '',
      ws: null,
      item1: true,
      proccess_value: 0,
      value: 1
    }
  },
  created() {
    console.log("Запускаю процедуру подключения к WebSocket Server")
    this.ws = new WebSocket("ws://192.168.1.103:3000")
    // this.ws.binaryData = "blob";
    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = function (event) {
      // console.log(event.data.text());
      console.log(event.data);

    }

    this.ws.onopen = function (event) {
      console.log('onopen ws', event)
      // alert("Соединение установлено.");
      console.log("Подключение успешно завершено к websocket server...")
    }

    this.ws.onclose = function (event) {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения'); // например, "убит" процесс сервера
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

  },
  props: {

  },
  computed: {

  },
  async mounted() {
    await this.g()
  },
  methods: {
    async show_all_pic() {
      // console.log(item)
      for (let i = 0; i < this.array.length; i++) {
        this.array[i].showmode = this.item1;
      }
      this.item1 = !this.item1
      console.log(this.item1)
      // item.show = !item.show
    },
    async sendMessage(message) {
      // alert(message)
      const file = document.querySelector('input[type="file"]').files[0]
      var reader = new FileReader();

      var rawData = new ArrayBuffer();

      const slice = file.slice(0, 100000);

      console.log(this.ws);
      // this.ws.send(message);

      reader.onload = (e) => {

        // const int8Array = new Int8Array(reader.result);

        // const data = [];

        // this.forEach(int8Array, (item) => {
        // 	data.push(item);
        // });



        rawData = e.target.result;
        console.log('rawData: ', rawData)
        this.ws.send(rawData);

        alert("the File has been transferred.")

      }

      console.log(reader.readAsArrayBuffer(file));

    },
    async g() {
      let properties = {
        type: "file",
      }
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(properties)
      })
      this.result = await response.json()
      this.array = this.result['items']

      this.route = this.result['route']
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

    async delete_file(item) {
      console.log('this name is name: ', item)
      console.log('this with a indexOf: ', this.array.indexOf(item))
      let index = this.array.map(item => item.name).indexOf(item.name)
      console.log('1: ', this.array)
      if (index > -1) {
        this.array.splice(index, 1)
      }
      const response = await fetch(`/del?name=${item.name}`, {
        // const response = await fetch('/download', {
        method: 'DELETE',
        // credentials: 'include',
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({name: name})
      })
      console.log('2: ', this.array)
      // console.log('123,', this.array.indexOf(name))
      // await this.g();
    },

    async SendFile(fileMeta, fileData) {
      const fileMetaJson = JSON.stringify({
        lastModified: fileMeta.lastModified,
        name: fileMeta.name,
        size: fileMeta.size,
        type: fileMeta.type,
      });

      // _must_ do this to encode as a ArrayBuffer / Uint8Array
      const enc = new TextEncoder(); // always utf-8, Uint8Array()
      const buf1 = enc.encode('!');
      const buf2 = enc.encode(fileMetaJson);
      const buf3 = enc.encode("\r\n\r\n");
      const buf4 = fileData;

      let sendData = new Uint8Array(buf1.byteLength + buf2.byteLength + buf3.byteLength + buf4.byteLength);
      sendData.set(new Uint8Array(buf1), 0);
      sendData.set(new Uint8Array(buf2), buf1.byteLength);
      sendData.set(new Uint8Array(buf3), buf1.byteLength + buf2.byteLength);
      sendData.set(new Uint8Array(buf4), buf1.byteLength + buf2.byteLength + buf3.byteLength);

      this.conn.binaryType = "arraybuffer";
      this.conn.send(sendData);
      this.conn.binaryType = "blob";
    },

    async upload_file() {
      // await this.sendMessage("hello")
      // let formData = new FormData()
      // let input = document.querySelector('input[type="file"]')
      // // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
      // // console.log('show_input: ', input.files[0].originname)
      // console.log(input.files);

      // for (const file of input.files) {
      //   console.log(file)
      //   formData.append('file', file)
      // }

      // const response = await fetch('/upload', {
      //   method: 'POST',
      //   credentials: 'include',
      //   headers: {
      //     // 'Content-Type': 'text/html; charset=utf-8',
      //     // 'Content-Type': 'application/x-www-form-urlencoded'
      //     // 'Content-Type': 'text/plain;'
      //     // 'Content-Type': 'multipart/form-data'
      //     // 'authorization': window.localStorage.getItem('jwt')
      //   },
      //   body: formData

      // })

      // let result = await response.json()
      // console.log('Тут ответ который возвращает запрос: ', result)
      // document.querySelector('input[type=file]').value = "";
      // await this.g()


      //document.getElementById("file-form").addEventListener("submit", function(event) {
      //  event.preventDefault();

      // var files = document.getElementById("file-input").files;
      // var formData = new FormData();





      await ((method, url) => {
        return new Promise( (resolve, reject) => {
          let formData = new FormData()
          let files = document.querySelector('input[type="file"]').files
          for (var i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
          }

          var xhr = new XMLHttpRequest();
          xhr.open(method, url, true);
          xhr.onload = () => {
            if (xhr.status === 200) {
              // alert("Upload successful!");
              this.proccess_value = 0;
              resolve(xhr.response)

            } else {
              alert("Error uploading files. Please try again.");
            }
          };

          xhr.upload.onprogress = (event) => {
            let progress = (event.loaded / event.total) * 100;
            // document.getElementById("progressBar").value = progress;
            this.proccess_value = progress;
          };


          xhr.onerror = function () {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          };

          xhr.send(formData);
          document.querySelector('input[type=file]').value = "";
        })
      })('POST', '/upload')


      await this.g()
      console.log('После всего что произошло: ', this.array)

      // let result = await response.json()
      // console.log('Тут ответ который возвращает запрос: ', result)
      // document.querySelector('input[type=file]').value = "";
      // await this.g()


      // formData.append('email', window.localStorage.getItem('user'))
      // let file = input.files[0]
      // let file = input.files[0];
      // console.log(file.name)
      // console.log(file.lastModified)
      // let reader = new FileReader();
      // reader.readAsText(file);
      // reader.readAsArrayBuffer(file)
      // console.log('hello')
      // reader.onload = function() {
      // 	console.log('done')
      // 	console.log(reader.result);
      // };
      // reader.onerror = function() {
      // 	console.log(reader.error);
      // };
      // reader.onprogress = function() {
      // 	console.log(reader.LOADING)
      // }
      // this.ws.
      // await this.sendMessage(new Blob([input.files[0]], {type: "image/png"}))
      // const fileReader = new FileReader();
      // fileReader.onload = () => {
      // 	const int8Array = new Int8Array(fileReader.result);
      // 	const data = [];
      // 	each(int8Array, (item) => {
      // 		data.push(item);
      // 	});
      // 	// function right below is for emit websocket message to server it takes 2 parameters: 1 - type of message, 2 - data to send
      // 	executeWebsocketRequest(SLICE_UPLOAD, {
      // 		name: file.name,
      // 		type: file.type,
      // 		size: file.size,
      // 		data,
      // 	});
      // };
      // fileReader.readAsArrayBuffer(slice);
      // console.log(input.files.length)
      // for (let i = 0; i < input.files.length; i++) {
      // 	const file = input.files[i]
      // 	const reader = new FileReader()
      // 	reader.onabort = function (e) { /* @TODO */ }
      // 	reader.onerror = function (e) { /* @TODO */ }
      // 	reader.onloadstart = function (e) { /* @TODO */ }
      // 	reader.onprogress = function (e) { /* @TODO */ }
      // 	reader.onload = function (e) {
      // 		console.log('blabla bla bla bla')
      // 		let rawData = new ArrayBuffer();
      // 		rawData = e.target.result;
      // 		this.ws.SendFile(file, rawData);
      // 	}
      // 	reader.readAsArrayBuffer(file)
      // }
    },
    async show_qr() {

      this.canvas()


      const response = await fetch('/qr', {
        method: 'GET',
        credentials: 'include',
        // headers: {
        //     'authorization': window.localStorage.getItem('jwt')
        // },
        //body: JSON.stringify({200: 200})

      })
      // window.open(response.url)
      console.log(response)
    },

    async canvas() {
      let url = `/qr`;
      let f = await fetch(url);
      let blob = await f.blob();
      // создаём <img>
      let img = document.createElement('img');
      let div = document.createElement('div')
      // let bl = document.createElement('input');
      // let br = document.createElement('input');

      img.addEventListener("click", () => {

        this.somefunc(img)
        div.remove()
      }, false);
      // bl.addEventListener("click", () => bl.remove(), false);
      // br.addEventListener("click", () => br.remove(), false);
      div.style = 'display:flex;\
			position:fixed;\
			top:0px;\
			left:0px;\
			align-items:center;\
			justify-content:center;\
			width:100%;\
			height:100%;';
      // img.style = 'Background-Color: gray'
      img.src = URL.createObjectURL(blob);

      div.append(img)

      // display:flex;
      // align-items:center;
      // justify-content:center;
      // top:0px;
      // left:0px;
      // bl.style = 'position:fixed;top:10%;left:2%;width:7%;height:100px';
      // br.style = 'position:fixed;top:10%;right:2%;width:7%;height:100px';
      // bl.type = "button";
      // br.type = "button";
      // bl.value = "left";
      // br.value = "right";
      // img.style = 'margin:auto;display:block;width:40%;';
      // img.tabIndex="213";
      document.body.append(div);
      console.log('Высота картинки: ', img.naturalHeight)
      console.log('Ширина картинки: ', img.naturalWidth)
      // document.body.append(bl);
      // document.body.append(br);
      // выводим на экран
      /*
      setTimeout(() => { // прячем через три секунды
        somefunc(img);
      }, 3000);
      */
    },
    // async send_on_download() {
    //     // alert(this.v1)
    // 	console.log('files')
    // 	this.array=[]
    //     fetch('/g/ch1', {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: {
    //         	'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({'partion': 'file'})
    //     }).then(()=>{
    // 		this.g()
    // 	})
    // },

    async somefunc(image) {
      image.remove();
      URL.revokeObjectURL(image.src); //удаляет внутреннюю ссылку на объект,
      //что позволяет удалить его (если нет другой ссылки) сборщику мусора,
      //и память будет освобождена.
    }

  }
}
</script>
