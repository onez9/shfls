<script setup>
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div v-for="(item, i) in array_img" :key="i">
          <figure>
            <figcaption class="text-break">{{ item }}</figcaption>
            {{ folder }}
            <img class="img-thumbnail" :src="`${route}/${encodeURIComponent(item)}`" @click="canvas2(item)" alt="">
          </figure>

        </div>

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
      route: '',
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
      let bl = document.createElement('input');
      let br = document.createElement('input');

      img.addEventListener("click", () => this.somefunc(img), false);
      // bl.addEventListener("click", () => bl.remove(), false);
      // br.addEventListener("click", () => br.remove(), false);

      img.style = 'position:fixed;top:10%;left:10%;width:80%;';
      // bl.style = 'position:fixed;top:10%;left:2%;width:7%;height:100px';
      // br.style = 'position:fixed;top:10%;right:2%;width:7%;height:100px';
      // bl.type = "button";
      // br.type = "button";
      // bl.value = "left";
      // br.value = "right";
      // img.style = 'margin:auto;display:block;width:40%;';
      // img.tabIndex="213";
      document.body.append(img);
      // document.body.append(bl);
      // document.body.append(br);

      // выводим на экран
      img.src = URL.createObjectURL(blob);

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