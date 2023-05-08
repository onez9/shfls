<script setup>
import Swal from 'sweetalert2';
</script>

<template>
	<div class="row">
		<div class="col">
			<label for="id_upload">Загрузить новый файл</label>
			<input id="id_upload" name="file" type="file" class="form-control mb-1">

			<div class="row">
				<div class="col">
					<button class="btn btn-danger mb-3 form-control" @click="upload_file">
						<i class="bi bi-upload"></i> Загрузить
					</button>
				</div>
				<div class="col">
					<button class="btn btn-dark form-control mb-3" @click="show_qr">
						<i class="bi bi-qr-code"></i> Создать qr-код
					</button>
				</div>

			</div>
			<br />

			<table id="id_table" class="table">
				<tbody>
					<tr v-for="(item, i) in array" :key="i">
						<!-- <td><button class="btn btn-danger"><i class="bi bi-file-binary-fill"></i></button></td> -->
						<td class="m-0 p-0 align-middle text-break">{{ item }}</td>
						<td class='m-0 p-0' align="right">

							<button @click="download_file(item)" class="btn btn-dark mt-1 mb-1"><i class="bi bi-download"></i></button>
						</td>

					</tr>
				</tbody>
			</table>


		</div>
	</div>
</template>


<style>
.d-flex,.justify-content-end {
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
		}
	},
	props: {

	},
	computed: {

	},
	async mounted() {
		await this.g()
	},
	methods: {
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

		async upload_file() {
			let formData = new FormData()
			let input = document.querySelector('input[type="file"]')

			formData.append('file', input.files[0])
			// formData.append('email', window.localStorage.getItem('user'))



			const response = await fetch('/upload', {
				method: 'POST',
				credentials: 'include',
				// headers: {
				//     'authorization': window.localStorage.getItem('jwt')
				// },
				body: formData

			})
			let result = await response.json()
			console.log('Тут ответ который возвращает запрос: ', result)
			document.querySelector('input[type=file]').value = "";
			await this.g()


		},
		async show_qr() {
			const response = await fetch('/qr', {
				method: 'GET',
				credentials: 'include',
				// headers: {
				//     'authorization': window.localStorage.getItem('jwt')
				// },
				//body: JSON.stringify({200: 200})

			})
			window.open(response.url)
			console.log(response)
		}
	}
}
</script>
