<script setup>
import Swal from 'sweetalert2';
</script>

<template>
	<div class="row">
		<div class="col">
			<label for="id_upload">Загрузить новый файл</label>
			<input id="id_upload" name="file" type="file" class="form-control mb-1">
			<!-- <p align="left">sdfsdf fsdfjo jfosdof j</p> -->
			<!-- <p><img src="/images/europe.png" alt="Европа" width="422" height="387" usemap="#Map">
				<map name="Map">
					<area shape="poly"
						coords="34,83,42,90,52,87,64,85,71,81,79,87,84,95, 75,110,61,120,42,116,37,110,25,94,32,82"
						href="is.html" alt="Исландия">
					<area shape="poly"
						coords="168,262,173,254,180,254,207,272,201,290,206,309, 197,318,182,316,182,323,165,320,152,317,154,292,138,276,168,263"
						href="fr.html" alt="Франция">
					<area shape="poly"
						coords="250,223,264,217,274,222,295,221,298,235,301,257, 290,269,274,268,247,254,243,241,243,241"
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
				<div class="col">
					<button class="btn btn-danger me-1 mb-3" @click="upload_file">
						<i class="bi bi-upload"></i> Загрузить
					</button>


					<button class="btn btn-dark me-1 mb-3" @click="show_qr">
						<i class="bi bi-qr-code"></i> Создать qr-код
					</button>
					<!-- <button @click="send_on_download" class="btn btn-info mb-3">Стандартная папка</button> -->
				</div>

			</div>
			<br />

			<table id="id_table" class="table">
				<tbody>
					<tr v-for="(item, i) in array" :key="i">
						<!-- <td><button class="btn btn-danger"><i class="bi bi-file-binary-fill"></i></button></td> -->
						<td class="m-0 p-0 align-middle text-break">{{ item }}</td>
						<td class='m-0 p-0' align="right">

							<button @click="delete_file(item)" class="btn btn-dark mt-1 mb-1 me-1"><i
									class="bi bi-recycle"></i></button>
							<button @click="download_file(item)" class="btn btn-info mt-1 mb-1"><i
									class="bi bi-download"></i></button>
						</td>

					</tr>
				</tbody>
			</table>


		</div>
	</div>
</template>


<style>
.d-flex,
.justify-content-end {
	padding: 0;
	margin: 0;
}
</style>

<script>



export default {
	data() {
		return {
			array: [],
			route: '',
			ws: null
		}
	},
	created() {
		console.log("Запускаю процедуру подключения к WebSocket Server")
		this.ws = new WebSocket("ws://192.168.188.184:3000")
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
			const result = await response.json()
			this.array = result['items']
			this.route = result['route']
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
		async delete_file(name) {
			console.log(this.array.indexOf(name))
			let index = this.array.indexOf(name)
			if (index > -1) {
				this.array.splice(index, 1)
			}
			const response = await fetch(`/del?name=${name}`, {
				// const response = await fetch('/download', {
				method: 'DELETE',
				// credentials: 'include',
				// headers: {
				//     'Content-Type': 'application/json',
				// },
				// body: JSON.stringify({name: name})
			})
			// console.log('123,', this.array.indexOf(name))

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
			let formData = new FormData()
			let input = document.querySelector('input[type="file"]')


			// file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
			// console.log('show_input: ', input.files[0].originname)
			formData.append('file', input.files[0])

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







			const response = await fetch('/upload', {
				method: 'POST',
				credentials: 'include',
				headers: {
					// 'Content-Type': 'text/html; charset=utf-8',
					// 'Content-Type': 'application/x-www-form-urlencoded'
					// 'Content-Type': 'text/plain;'
					// 'Content-Type': 'multipart/form-data'
					// 'authorization': window.localStorage.getItem('jwt')
				},
				body: formData

			})
			let result = await response.json()
			console.log('Тут ответ который возвращает запрос: ', result)
			document.querySelector('input[type=file]').value = "";
			await this.g()


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
