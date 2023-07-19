<script setup>
import Swal from 'sweetalert2';
</script>

<template>
  <div class="col-12 input-group mb-2 mt-2">
    <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
    <input type="text" :placeholder="placeholder" class="form-control" v-on:input="searching(name)" v-model="name">
  </div>


  <div class="form-check form-switch">
    <input class="form-check-input" v-model="v1" @change="func" type="checkbox" id="flexSwitchCheckDefault">
    <label class="form-check-label" for="flexSwitchCheckDefault">Нормальное видео</label>
  </div>
  {{ v1 }}
  <!-- <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked>
    <label class="form-check-label" for="flexSwitchCheckChecked">Checked switch checkbox input</label>
  </div> -->
</template>

<script>
export default {
  data: function () {
    return {
      placeholder: "Введите интересующую вас тему",
      name: '',
      v1: '',
    }
  },
  props: {

  },
  mounted() {

  },
  created() {

  },
  methods: {
    async func() {
      // alert(this.v1)
      const response = await fetch('/g/ch1', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'srak1': v1})
      })
    }
  }
}
</script>