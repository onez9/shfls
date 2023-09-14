<script setup>
import Swal from 'sweetalert2';
</script>

<template>
  <div class="container">
    <div class="row">
      <p>Коллекция полезных знаний из школы</p>


      <button @click="b1=!b1" class="btn btn-outline-success mb-2 mt-2">Периодическая таблица</button>
      <div v-if="b1==true" class="col bg-dark mb-2">
        <img src="/images/periodic_table.jpg" alt="">

      </div>
      <button @click="b4=!b4" class="btn btn-outline-success mb-2">Таблица расстворимости солей кислот и оснований в воде</button>
      <div v-if="b4==true" class="col bg-dark mb-2">
        <img src="/images/tablica_rastvorimosti_solej_kislot_i_osnovanij_v_vode_3.jpg" alt="">

      </div>
      <button @click="b2=!b2" class="btn btn-outline-success mb-2">Маркировка резисторов</button>
      <div v-if="b2==true" class="col bg-dark mb-2">
        <img src="/images/resistor2.png" alt="">

      </div>
      <button @click="b3=!b3" class="btn btn-outline-success mb-2">Маркировка smd-резисторов c 3-х значным кодом</button>
      <div v-if="b3==true" class="col bg-dark mb-2" style="display: flex;">
        <div style="display: flex;"><img src="/images/resistor3-smd.jpg" alt=""></div>
        <div style="display:flex;"><img src="/images/smd_resistor_3.jpeg" alt=""></div>
      </div>
      <div class="col bg-dark mb-2">
        <progress max="100" value="25">

        </progress>

      </div>


    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      b1: false,
      b2: false,
      b3: false,
      b4: false,
    }
  },
  async mounted() {
  },
  components: {
    // search
  },
  methods: {

  }
}
</script>