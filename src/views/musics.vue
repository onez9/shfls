<script setup>
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <div class="col-sm-6" v-for="(item, i) in array_music" :key="i">

          <figure>
            <figcaption>{{ item }}:</figcaption>
            <audio controls :src="`/musics/${item}`">
              <a :href='`/${folder}/${item}`'>
                Download audio
              </a>
            </audio>
          </figure>


        </div>

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
      array_music: [],
      folder: '',
    }
  },
  async mounted() {
    await this.g()
  },
  props: {

  },
  methods: {
    async g() {
      let properties = {
        type: "music"
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
      this.array_music = result['items']
      this.folder = result['folder']
    },


  }
}
</script>