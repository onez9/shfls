//import 'vite/modulepreload-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.mjs'

import '../public/assets/bootstrap/dist/js/bootstrap.bundle.min'
import './assets/main.css'
// import { VueShortkey } from 'vue-shortkey'
// import hljs from 'highlight.js'
// import HighLight from "vue3-highlight-component";

// Register the language if it's not supported by default
// hljs.registerLanguage('js', require('highlight.js/lib/languages/javascript'))


// import ShortKey from 'vue-shortkey';
const app = createApp(App)

// app.use(ShortKey, { prevent: ['input', 'textarea'] })
// app.use(hljsVuePlugin)
app.use(router)
// app.use(VueShortkey)
app.mount('#app')
