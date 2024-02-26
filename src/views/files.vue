<script setup>
import Swal from 'sweetalert2';
</script>

<template>
  <div class="row" id="elements">
    <div class="col">
      <!-- <div class="row"> -->
      <!-- <label for="id_upload">Загрузить новый файл</label> -->
      <input id="id_upload" title="это подсказка для тебя" name="file" type="file"
        class="form-control my-2 bg-dark text-white p-0 ps-1" multiple>
      <!-- <progress id="progressBar" value="0" max="100" class="form-control mt-2"></progress> -->

      <div class="progress my-2" v-if="this.proccess_value !== 0">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
          aria-label="Example with label" :aria-valuenow="proccess_value" aria-valuemin="0" aria-valuemax="100"
          id="progressBar" :style="'width: ' + proccess_value + '%;'"> {{ proccess_value }}%

        </div>
      </div>
      <div class="row">
        <div class="col-sm">
          <!-- <button type="button" class="btn btn-primary btn-sm">Small button</button> -->
          <button class="my-btn-style mb-1 me-1" @click="upload_file">
            <i class="bi bi-upload"></i>
          </button>

          <button class="my-btn-style mb-1 me-1" @click="show_qr">
            <i class="bi bi-qr-code"></i>
          </button>
          <!-- <button @click="send_on_download" class="btn btn-info mb-3">Стандартная папка</button> -->

          <button v-if="item1 == true" class="my-btn-style mb-1 me-1" @click="show_all_pic">
            Развернуть
          </button>
          <button v-else class="my-btn-style mb-1 me-1" @click="show_all_pic">
            Скрыть
          </button>

          <button class="my-btn-style mb-1 me-1" @click="show_info = !show_info">
            <i class="bi bi-list"></i>
          </button>
          <button class="my-btn-style mb-1 me-1" @click="show_debug_info =! show_debug_info">
            <i class="bi bi-asterisk"></i>
          </button>
          <input 
            class="mb-1 input-search me-1" 
            placeholder="Type your files name"
            @beforeinput="searching"
            @keyup.enter=""
            @keyup.escape="name = ''"
            v-model="name">
          <!-- <button @click="send_on_download" class="btn btn-info mb-3">Стандартная папка</button> -->
          <button
            class="my-btn-style me-1"><i class="bi bi-arrow-clockwise"></i></button>

          <label class="tablo">{{ result['total_files'] }}</label>
        </div>

      </div>
      <div 
        class="row"
        v-if="samples.length!==0">
        <div
          class="col">
          <div
            class="results_for_searching">
            <p
              class="my-label"
              v-for="(item, index) in samples">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
      <!-- <table id="id_table" class="table text-nowrap table-borderless table-hover"> -->
      <div v-if="show_debug_info" class="d-flex flex-column fixed-bottom" style="background-color: #111111; opacity: .9; font-size: 10px;">
        <div>document.documentElement.scrollHeight: {{ scrollHeight }}</div>
        <div>window.scrollY: {{ scrollY }}</div>
        <div>document.documentElement.scrollTop: {{ scrollTop }}</div>
        <div>window.innerHeight: {{ innerHeight }}</div>
        <div>document.documentElement.clientHeight: {{ clientHeight }}</div>
        <div>document.documentElement.clientWidth: {{ clientWidth }}</div>
        <div>scrollHeight - scrollTop: {{ left }}</div>
        <div>search: {{ search }}</div>
      </div>
      <table id="id_table" class="table table-hover">
        <thead v-if="show_info">
          <tr>
            <td class="p-0"><button class="btn btn-outline-warning btn-sm"><i class="bi bi-filter-square"></i></button></td>
            <td class="p-0"><button class="btn btn-outline-warning btn-sm"><i class="bi bi-filter-square"></i></button></td>
            <td class="p-0"><button class="btn btn-outline-warning btn-sm"><i class="bi bi-filter-square"></i></button></td>
            <td class="p-0"><button class="btn btn-outline-warning btn-sm"><i class="bi bi-filter-square"></i></button></td>
            <td class="p-0"><button class="btn btn-outline-warning btn-sm"><i class="bi bi-filter-square"></i></button></td>
            <td class="p-0"></td>
          </tr>
        </thead>
        <tbody>
          <template class="p-0 m-0" @click="activeElem = element" v-for="(item, index) in  array " :key="index">
            
            <tr class="p-0 m-0">
              <td @click="item.showmode = !item.showmode" class="align-middle text-break p-0 m-0">{{ item.name }}</td>
              <td v-if="show_info" class="align-middle px-1 p-0 m-0">{{ item.name.split('.').slice(-1)[0] }}</td>
              <td v-if="show_info" class="align-middle px-1 p-0 m-0">{{ parseInt(item.info.size / 1024) }}Kb</td>
              <td v-if="show_info" class="align-middle px-1 p-0 m-0">{{ new Date(item.info.mtime).toLocaleDateString() }}</td>
              <td v-if="show_info" class="align-middle px-1 p-0 m-0">{{ new Date(item.info.mtime).toLocaleTimeString() }}</td>

              <td class="p-0">
                <div class="d-flex justify-content-end p-0">
                  <!-- <button @click="delete_file(item)" class="btn btn-sm btn-outline-info me-1 m-0"><i class="bi bi-recycle"></i></button> -->
                  <button @click="delete_file(item)" class="btn btn-sm btn-outline-danger me-1 m-0"><i class="bi bi-trash"></i></button>
                  <button @click="download_file(item.name)" class="btn btn-sm btn-outline-warning m-0"><i class="bi bi-download"></i></button>
                
                </div>

              </td>


            </tr>
            <tr v-if="item.showmode && ['png', 'jpg', 'jpeg', 'gif'].indexOf(item.name.split('.').reverse()[0]) > -1" class="bg-dark p-0">
              <img loading="lazy" style="width: 100%;" class="rounded blur" :src="`/downloads/${item.name}`" alt="">
            </tr>
          </template>
        </tbody>
      </table>
      <div class="d-flex justify-content-center">
        <p v-if=" array.length == 0 ">Файлов не обнаружено</p>

      </div>



    </div>
  </div>
</template>


<style scoped>
.tablo {
  border: 2px solid black;
  border-radius: 5pt;
  padding-inline: 5pt;
  /* font-size: 10px; */
}
.my-label {
  margin: 0;
}
.results_for_searching {
  background-color: black;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 2ch;
  
  /* margin-inline: 10px; */
}
.input-search {
  border-radius: 5px;
  border: 0 solid black;
  
}
.my-btn-style {
  border-radius: 5px;
  border: 0 solid black;
}
.my-btn-style:hover {
  background-color: darkgoldenrod;
}

.d-flex, .justify-content-end {
  padding: 0;
  margin: 0;
}

.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  /* ackground-color:rgb(255, 0, 0); */
  color: #3b31c2;
}


/* .blur{
  filter: blur(30px);
  -webkit-filter: blur(10px);


  height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
} 
*/


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
      value: 1,
      show_info: false,
      num: 0,
      count: 0,
      currentPage: 0,
      lastScrollTop: 0,
      countItems: 20,
      countPage: 0,
      scrollHeight: 0,
      scrollTop: 0,
      scrollY: 0,
      clientHeight: 0,
      left: 0,
      clientHeight: 0,
      clientWidth: 0,
      innerHeight: 0,
      show_debug_info: false,
      name: '',
      samples: [],
    }
  },
  created() {
    console.log("Запускаю процедуру подключения к WebSocket Server")
    this.ws = new WebSocket("ws://192.168.0.5:3000")
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
    search: String
  },
  computed: {

  },
  async mounted() {
    console.log(this.color_header)

    await this.g()
    await this.start()
  },
  methods: {
    async searching() {
      try {
        let rx = new RegExp(this.name.toLowerCase())
        this.samples = [];
        if (this.name) {
          this.samples = this.array.filter(item => rx.test(item.name.toLowerCase()))
        } else {
          this.samples = [];
        }
      } catch (e) {
        console.error(e);
      }



    },
    async start() {
      document.addEventListener('scroll', (event) => {
        
        // console.log(parseInt(window.scrollY))
        // let pos1 = Math.ceil(window.scrollY)
        // // console.log(pos1, this.num)
        // if (window.scrollY>=this.num) {
        //   // window.scrollY %= 768
        //   // console.log('hello ', window.scrollY)
        //   this.num += 668
        //   this.count += 1
        // } else if (this.num - window.scrollY >= 668) {
        //   this.num -= 668
        //   this.count -= 1
        // }
        // let st = window.scrollY || document.documentElement.scrollTop
        // if (this.currentPage > 0) {
        //   if (st > this.lastScrollTop) {
        //     // if (event.originalEvent.wheelDelta >= 0) {
        //     console.log('вниз');
        //   } else {
        //     console.log('вверх');
        //   }
        // }
        // console.log(parseInt(this.lastScrollTop + document.documentElement.clientHeight))
        // this.lastScrollTop = (st <= 0)? 0 : st;


        this.scrollHeight = document.documentElement.scrollHeight;
        
        this.scrollTop = document.documentElement.scrollTop;
        this.scrollY = window.scrollY;

        this.clientHeight = document.documentElement.clientHeight;
        this.innerHeight = window.innerHeight;
        this.left = this.scrollHeight - Math.ceil(this.scrollTop);
        this.clientWidth = document.documentElement.clientWidth;
        // если конец страницы
        // if(parseInt(document.documentElement.scrollHeight - document.documentElement.scrollTop) == document.documentElement.clientHeight) 
        //   alert(parseInt(document.documentElement.scrollHeight - document.documentElement.scrollTop) == document.documentElement.clientHeight)
        // console.error(Math.abs(this.left - this.innerHeight) <= 1)
        // console.error(this.currentPage < this.countPage-1)
        console.error(this.currentPage, this.countPage-1)
        if (this.currentPage < this.countPage-1 && Math.abs(this.left - this.innerHeight) <= 1) {
          this.currentPage +=1;
          console.log('new page end: ', this.currentPage)
          this.g(this.currentPage)



        }
        // если начало
        // if (this.currentPage>0 && document.documentElement.scrollTop == 0) {
        //   this.currentPage--;
        //   console.log('new page start: ', this.currentPage)
        //   this.g(this.currentPage)
        // }



      })
    },
    async show_all_pic() {
      // console.log(item)
      for (let i = 0; i < this.array.length; i++) {
        if (['png', 'jpg', 'jpeg', 'gif'].indexOf(this.array[i].name.split('.').reverse()[0]) > -1) {
          this.array[i].showmode = this.item1;
        }
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
    async g(currentPage=0, countItems=this.countItems) {
      let properties = {
        type: "file",
        currentPage: currentPage,
        count: countItems,
      }
      const response = await fetch('/files/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify(properties),
        // "mode": "cors"
      })
      this.result = await response.json()
      
      console.error(this.countItems)
      console.error(this.result)
      this.array.push(...this.result['items'])
      this.countPage = Math.ceil(this.result['total_files'] / countItems)
      console.log('this.countPage: ', this.countPage)
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
      // console.log('this name is name: ', item)
      // console.log('this with a indexOf: ', this.array.indexOf(item))
      
      let index = this.array.map(item => item.name).indexOf(item.name)
      
      
      // console.log('this.array: ', this.array)
      // console.log('this.array.map(item => item.name): ', this.array.map(item => item.name))
      // console.log('this.array.map(item => item.name).indexOf(item.name): ', this.array.map(item => item.name).indexOf(item.name))


      // console.log('1: ', this.array)
      if (index > -1) {
        this.array.splice(index, 1)
      
        const response = await fetch(`/files/d/file?name=${item.name}`, {
          method: 'DELETE',
          heaaders: {
            'authorization': window.localStorage.getItem('jwt'),
          },
          "mode":"cors"
        })

        console.log(await response.json())
      }
      // console.log('2: ', this.array)
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
        return new Promise((resolve, reject) => {
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
      })('POST', '/files/u/files')


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
        //credentials: 'include',
        headers: {
          'Authorization': window.localStorage.getItem('jwt')
        },
        "mode":"cors"
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
