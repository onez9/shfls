<script setup>
import search from '../../Components/search.vue'
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- <search></search>  -->
      <div class="col-12 input-group mb-2 mt-2">
        <span class="input-group-text" id=""><i class="bi bi-search"></i></span>
        <input type="text" placeholder="Поиск картинок" class="form-control" v-on:input="searching(name)" v-model="name">
      </div>

      <!-- {{ computed_func }} -->
      <!-- {{ theme }} -->

      <!-- <div class="col">
        <button class="btn btn-outline-danger me-1 form-control" @click="sorting">
          <i class="bi bi-filter"></i>
        </button>
      </div> -->
      <div class="col">
        <button class="btn btn-outline-info me-1 form-control" @click="reversing">
          <i :class="{'bi bi-sort-alpha-down': true, 'bi bi-sort-alpha-up': (reverse==false)}"></i>
        </button>
      </div>
      <div class="col" v-show="false">
        <button class="btn btn-outline-success form-control" @click="show_image=false">
          Скрыть изображения
        </button>
      </div>
      <div class="col" v-show="false">
        <button class="btn btn-outline-warning form-control" @click="show_image=true">
          Показать изображения
        </button>
      </div>

      <div class="col">
        <select v-model="selected" class="form-select" name="">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
          <option value="6">Six</option>
          <option value="12">Twelve</option>
        </select>
      </div>
      <!-- <input type="number" class="form-control" aria-describedby="passwordHelpInline"> -->
      <!-- <span id="passwordHelpInline" class="form-text">
        Пароль должен быть от 8 до 20 символов
      </span> -->
        <!-- <button class="btn btn-warning" @click="sort_on_time">Сортировать по дате</button> -->

      <div class="col-12"></div>


      <div :class="{'pb-1 pt-1': true, 'col-1': (selected==12), 'col-2': (selected==6), 'col-3': (selected==4), 'col-sm-4': (selected==3), 'col-6': (selected==2), 'col-12': (selected==1) }" v-for="(item, i) in find_arr" :key="i">
        <!-- {{ item }} -->
        <figure v-if="show_image==true">
          <!-- {{ folder }} -->
          <img loading="lazy" class="img-thumbnail p-0" :src="`${route}/${encodeURIComponent(item['name'])}`" @click="canvas2(item['name'])" alt="">
          <figcaption class="text-break">{{ item['name'] }}</figcaption>
        </figure>
        <p v-else class="mt-0 mb-0">{{ `${item['name']}` }}</p>

      </div>


    </div>
  </div>
</template>


<style scoped>
.img-thumbnail {
  width: 100%;
}
</style>



<script>
export default {
  data() {
    return {
      // img: '/files/1625818612_6-kartinkin-com-p-anime-v-realnoi-zhizni-oboi-anime-krasivo-6.jpg',
      array_img: [],
      // mySetChangeTracker: 1,
      find_arr: [],
      route: '',
      name: '',
      reverse: true,
      show_image: true,
      selected: 1,
    }
  },
  async mounted() {
    await this.g()
  },
  props: {
    theme: String
  },
  computed: {
    // computed_func() {
    //   // return this.name.split('').reverse().join('')
    //   const re = new RegExp(this.name);
    //   let arr_tmp=[]
    //   this.array_img.forEach((item) => {
    //     // if(re.test(item['name'].toLowerCase())){
    //     if(re.test(item.name.toLowerCase())){
    //       // this.find_arr.add(item)
    //       arr_tmp.push(item['name'])
    //       // console.log(item)
    //     }

        
    //   })

    //   console.log([...new Set(arr_tmp)])
    //   this.find_arr = [...new Set(arr_tmp)]
    //   // return this.mySetChangeTracker && Array.from(this.find_arr);
    //   // return this.find_arr
    // }
  },
  methods: {
    // async sort_on_time() {
    //   this.array_img.sort(function(a,b){
    //     var c = new Date(a.ctime);
    //     var d = new Date(b.ctime);
    //     // console.log(c, d)
    //     if(c > d){
    //       return d
    //     }
    //   })
    // },
    async searching() {
      let rx = new RegExp(this.name)
      this.find_arr=[]
      this.array_img.forEach(item=>{
        if(rx.test(item.name.toLowerCase())){
          this.find_arr.push(item)
        }
      })
    },
    async sorting() {
      console.log('Sorting!')
      this.find_arr.sort()
    },
    async reversing() {
      console.log('Sorting!')
      if (this.reverse) {
        this.reverse=false
      } else {
        this.reverse=true
      }
      this.find_arr.reverse()
    },
    async g() {
      let properties = {
        type: "image"
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
      this.array_img = result['items']
      this.route = result['route']
      this.find_arr = this.array_img
      // console.log(this.find_arr[2])
      // console.log(this.array_img[2])
    },

    async canvas1(image) {
      // берём любое изображение

      let url = `${this.route}/${image}`;
      let f = await fetch(url);
      let blob = await f.blob();
      let img = document.createElement('img');
      img.style = 'position:fixed;top:10%;left:10%;width:80%';
      document.body.append(img);
      img.src = URL.createObjectURL(blob);

      let img1 = document.querySelector('img');

      // создаём <canvas> того же размера
      let canvas = document.createElement('canvas');
      canvas.width = img1.clientWidth;
      canvas.height = img1.clientHeight;

      let context = canvas.getContext('2d');

      // копируем изображение в  canvas (метод позволяет вырезать часть изображения)
      context.drawImage(img1, 1, 0);
      // мы можем вращать изображение при помощи context.rotate() и делать множество других преобразований

      // toBlob является асинхронной операцией, для которой callback-функция вызывается при завершении
      canvas.toBlob((blob) => {
        // после того, как Blob создан, загружаем его
        let link = document.createElement('a');
        link.download = 'example.png';

        link.href = URL.createObjectURL(blob);
        link.click();

        // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    },


    async canvas2(image) {
      let url = `${this.route}/${image}`;
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
      img.style = 'height: 100%;\
      Background-Color: White'
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


    async somefunc(image) { 
      image.remove();
      URL.revokeObjectURL(image.src); //удаляет внутреннюю ссылку на объект,
      //что позволяет удалить его (если нет другой ссылки) сборщику мусора,
      //и память будет освобождена.
    }                

  }
}
</script>