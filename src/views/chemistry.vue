<script setup>
import Swal from 'sweetalert2';
</script>

<template>
  <div class="container">
    <div class="row">
      <p>Коллекция полезных знаний из школы</p>


      <button @click="b1 = !b1" class="btn btn-outline-success mb-2 mt-2">Периодическая таблица</button>
      <div v-if="b1 == true" class="col bg-dark mb-2">
        <img src="/images/periodic_table.jpg" alt="">

      </div>
      <button @click="b4 = !b4" class="btn btn-outline-success mb-2">Таблица расстворимости солей кислот и оснований в
        воде</button>
      <div v-if="b4 == true" class="col bg-dark mb-2">
        <img src="/images/tablica_rastvorimosti_solej_kislot_i_osnovanij_v_vode_3.jpg" alt="">

      </div>
      <button @click="b2 = !b2" class="btn btn-outline-success mb-2">Маркировка резисторов</button>
      <div v-if="b2 == true" class="col bg-dark mb-2">
        <img src="/images/resistor2.png" alt="">

      </div>
      <button @click="b3 = !b3" class="btn btn-outline-success mb-2">Маркировка smd-резисторов c 3-х значным
        кодом</button>
      <div v-if="b3 == true" class="col bg-dark mb-2" style="display: flex;">
        <div style="display: flex;"><img src="/images/resistor3-smd.jpg" alt=""></div>
        <div style="display:flex;"><img src="/images/smd_resistor_3.jpeg" alt=""></div>
      </div>
      <div class="col bg-dark mb-2">

      </div>
      <progress max="100" value="25">

      </progress>
      <br>
      <div class="progress">
        <div class="progress-bar" role="progressbar" aria-label="Example with label" style="width: 25%;"
          aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
          aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"
          style="width: 75%"></div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" aria-label="Default striped example"
          style="width: 10%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-success" role="progressbar" aria-label="Success striped example"
          style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-info" role="progressbar" aria-label="Info striped example"
          style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-warning" role="progressbar" aria-label="Warning striped example"
          style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <br>
      <div class="progress">
        <div class="progress-bar progress-bar-striped bg-danger" role="progressbar" aria-label="Danger striped example"
          style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
      </div>

      <br>
      <div class="btn-group">
        <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          Action
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
          <li>
            <hr class="dropdown-divider">
          </li>
          <li><a class="dropdown-item" href="#">Separated link</a></li>
        </ul>
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