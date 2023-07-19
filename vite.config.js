import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// export default defineConfig({
//  plugins: [vue()],
//  resolve: {
//    alias: {
//      '@': fileURLToPath(new URL('./src', import.meta.url))
//    }
//  }
// })


export default defineConfig({
  //Массив плагинов для использования. Falsy значения 
    //будут проигнорированы и массив плагинов будет выровнен (flattened). 
    //Смотрите Plugin API для получения большей 
    //информации о Vite плагинах.
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  //build: {
  //  // generate manifest.json in outDir
  //  manifest: true,
  //  rollupOptions: {
  //    // overwrite default .html entry
  //    input: './src/main.js'
  //  }
  //},
  build: {
    outDir: 'dist',
    manifest: true,
    rollupOptions: {
      input: ['src/main.js', './index.html']
      //input: ['src/server/server.mjs' ]
    }
  }
  // define: {
  //   __VALUE__: `"${process.env.VITE_TEST_VAR}"` // wrapping in "" since it's a string
  // },
})
