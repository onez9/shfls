//import 'vite/modulepreload-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.mjs'

import '../public/assets/bootstrap/dist/js/bootstrap.bundle.min'
import './assets/main.css'

// import hljs from 'highlight.js'
// import HighLight from "vue3-highlight-component";

// Register the language if it's not supported by default
// hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))



const app = createApp(App)


// app.use(hljsVuePlugin)
app.use(router)

app.mount('#app')
