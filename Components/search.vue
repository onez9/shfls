<script>
export default {
  data() {
    return {
      count: 0,
      mArray: [],
      name: ''
    }
  },
  props: {
    array: [],
    type: String,
    placeholder: String,
  },
  // emits: {
  //   update: modelValue
  // },
  methods: {

    // doSomethingInParentComponentFunction () {
    //   this.$emit("click", 123)
    // },
    async searching(p1) {
      this.$emit("input", p1)



      // let rx = new RegExp(this.name)
      // this.mArray = []
      // this.array.forEach(item => {
      //   if (rx.test(item.name.toLowerCase())) {
      //     this.mArray.push(item)
      //   }
      // })
    },
  }
}
</script>

<template>
  <div class="col-12 input-group mb-2 mt-2">
    <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
    <input type="text" 
    :placeholder="placeholder" 
    class="form-control" 
    v-on:input="searching(name)" 
    v-model="name">
  </div>

</template>