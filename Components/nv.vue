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
    theme: String
    // type: String,
    // placeholder: String,
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
  <div class="content-header">

    <nav :class="{ 'navbar navbar-expand-lg bg-light': true, 'bg-dark navbar-dark': (theme == 'dark') }">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <!-- <li class="nav-item"> -->
              <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
              <!-- <router-link class="nav-link" to="/"><i class="bi-house"></i> Главная</router-link> -->
              <!-- <router-link class="nav-link" to="/"><i class="bi bi-globe"></i></router-link> -->
            <!-- </li> -->
            <li class="nav-item">
              <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
              <router-link class="nav-link" to="/g/files"><i class="bi bi-card-list"></i> Файлы</router-link>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Основные разделы
              </a>
              <!-- <ul class="dropdown-menu dropdown-menu-dark"> -->
              <ul class="dropdown-menu">

                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/images"><i class="bi bi-images"></i> Картинки</router-link>
                </li>
                <li><router-link class="dropdown-item" to="/g/videos"><i class="bi bi-play-circle"></i> Видео</router-link>
                </li>
                <!-- <li><router-link class="dropdown-item" to="/g/videos"><i class="bi bi-file-play"></i> Видео</router-link>
                </li> -->
                <li><router-link class="dropdown-item" to="/g/musics"><i class="bi bi-music-player"></i>
                    Музыка</router-link></li>
                <li><router-link class="dropdown-item" to="/g/books"><i class="bi bi-book"></i> Книги</router-link></li>
                <li><router-link class="dropdown-item" to="/g/works"><i class="bi bi-person-workspace"></i>
                    Работа</router-link></li>
                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/lang"><i class="bi bi-translate"></i> Язык</router-link>
                </li>

                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/crypt"><i class="bi bi-terminal-fill"></i>
                    Шифрование</router-link>
                </li>
                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/code"><i class="bi bi-terminal-fill"></i> Code</router-link>
                </li>
                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/poligon"><i class="bi bi-back"></i> Полигон</router-link>
                </li>
                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/chat"><i class="bi bi-chat-dots"></i> Чат</router-link>
                </li>
                <li>
                  <!-- <a class="nav-link active" aria-current="page" href="index.html"><i class="bi-house"></i> Главная</a> -->
                  <router-link class="dropdown-item" to="/g/settings"><i class="bi bi-gear-wide-connected"></i> Настройки</router-link>
                </li>



              </ul>
            </li>
            <!-- <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false"><i class="bi bi-gear-wide-connected"></i> Настройки </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="theme = 'dark'"><i
                      class="bi bi-brightness-alt-low"></i>Тёмная</a></li>
                <li><a class="dropdown-item" href="#" @click="theme = 'white'"><i
                      class="bi bi-brightness-alt-low-fill"></i>Светлая</a></li>
              </ul>
            </li> -->
            <!-- <li class="nav-item">
              <router-link class="nav-link" to="/g/search"><i class="bi bi-search-heart"></i> поиск</router-link>
            </li> -->


          </ul>
        </div>
      </div>
    </nav>
  </div>

  <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

  <!--<div class="wrapper">
  <HelloWorld msg="You did it!" />

  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</div> -->
  <!-- </header> -->
</template>