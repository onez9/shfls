<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
</script>
<template>
    <div class="row">
        <div class="col-12 input-group mb-2 mt-2">
            <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
            <input type="text" placeholder="Название видео" class="form-control" v-on:input="searching(name)"
                v-model="name">
        
            <span class="input-group-text" id="">{{ match_books.length }}</span>

        </div>
        <div class="col-12">
            <button @click="send_on_download" class="btn btn-success">Выставить на загрузку</button>
        </div>
        <!-- <search 
        placeholder="Название книги" 
        :type="type"
        @input="onInputChild">

    </search> -->
        <!-- <p>{{ match_books.length }}</p> -->
        <div class="col">
            <div v-for="(item, i) in match_books" :key="i">{{ item }}</div>

        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            books: [],
            type: 'file',
            count: '',
            name: '',
            match_books: []
        }
    },
    async mounted() {
        await this.get_books()
    },
    components: {
        search
    },
    methods: {
        async send_on_download() {
            // alert(this.v1)
            const response = await fetch('/g/ch1', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({'partion': 'book'})
            })
            // this.rx_array=[]
            // this.array_videos=[]
            // await this.g()
        },
        // async onInputChild(value) {
        //     console.log(value)
        //     alert(value)
        //     // this.count=value
        // },
        async searching() {
            let rx = new RegExp(this.name)
            this.match_books = []
            this.books.forEach(item => {
                if (rx.test(item.toLowerCase())) {
                    this.match_books.push(item)
                }
            })
        },
        async get_books() {
            let properties = {
                type: "book",
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
            console.log(result)
            this.books = result['items']
            this.route = result['route']
            this.match_books=this.books
        }
    }
}
</script>