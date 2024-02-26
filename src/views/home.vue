<script setup>
import Swal from 'sweetalert2';
</script>

<template>
    <div class="row">
        <div class="col-3">
            <div class="mt-1">
                <img 
                    loading="lazy" 
                    style="width: 100%;" 
                    class="rounded blur" 
                    :src="path_image"
                    alt="">
                <input 
                    id="setImageId"
                    type="file" 
                    class="form-control mt-1"
                    accept="images/*"
                    @change="someFunc">
                <p class="my-1">login: {{ login }}</p>
                <p class="my-1">email: {{ email }}</p>
                <!-- <p v-for="(item, index) of files" :key="item">{{ item }}</p> -->

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            userinfo: {},
            login: '',
            email: '',
            files: [],
            path_image: "/images/3ee366609ea655210ec146eeace51048.jpg",
        }
    },
    async mounted(){
        this.userinfo=JSON.parse(window.localStorage.getItem('user_info'))
        this.email=this.userinfo?.email
        this.login=this.userinfo?.login
        if(window.localStorage.getItem('path_image')!=null){
            this.path_image=window.localStorage.getItem('path_image')
        }else{
            const response=await fetch('/u/get_image_name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt'),
                },
                body: JSON.stringify({
                    login: this.login,
                    email: this.email
                })
            })
            // console.log("Получил imagepath: ", await response.json())
            this.path_image= (await response.json())['name']
            window.localStorage.setItem('path_image', this.path_image)
        }
    },
    methods:{
        async someFunc() {
            let preview = document.querySelector('img');
            this.files=document.querySelector('input[type=file]').files
            console.info(this.files)
            let file    = this.files[0];
            let reader  = new FileReader();

            reader.onloadend = function () {
                preview.src = reader.result;
            }

            if (file) {
                reader.readAsDataURL(file);
            } else {
                preview.src = "";
            }

            // await this.sendMessage("hello")
            let formData = new FormData()
            let input = document.querySelector('input[type="file"]')
            // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') 
            // console.log('show_input: ', input.files[0].originname)
            console.log(input.files);

            for (const file of input.files) {
              console.log(file)
              formData.append('file', file)
            }
            formData.append('login', this.login)
            formData.append('email', this.email)




            const response = await fetch('/u/set_image', {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    // 'Content-Type': 'application/json',
                    'Authorization': window.localStorage.getItem('jwt'),
                },
                body: formData
                // body: JSON.stringify({
                //     login: this.login,
                //     email: this.email,
                //     pictures: formData
                // })
                

            })
            this.path_image = await response.json()
            window.localStorage.setItem("path_image", this.path_image)
            // const result = await response.json()
            // if (file) {
            //     reader.readAsDataURL(result);
            // } else {
            //     preview.src = "";
            // }
        }
    }
}
</script>