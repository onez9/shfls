<script setup>
import Swal from 'sweetalert2';
import axios from 'axios'
</script>

<template>
<div class="row">
    <div class="col">
        <button class="btn btn-secondary">Начать</button>
    </div>
</div>
</template>

<script>
export default {
    data: function() {
        return {
            url: 'https://kwork.ru/projects'
        }
    },
    props: {

    },
    async mounted() {
        await this.pars()
    },
    methods: {
        async pars() {
            axios.get(this.url).then(data=>console.log(data))

            // response.then(data=>console.log(data))
        }
    }
}
</script>