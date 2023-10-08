<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import axios from 'axios';

</script>
<template>


  <div class="row">
    <div class="col-sm-4">
      <div class="col-sm mb-1 mt-1">
        <!-- <input type="number" class="form-control mt-1" min="1" max="4"> -->
        <select @change="selLang(name_lang)" v-model="name_lang" class="form-select mt-1 bg-dark text-white " name="" title="Выберете язык">
          <option  v-for="(value, key) of dict_lang" v-bind:value="key">{{ value }}</option>
        </select>

      </div>

   
      <div class="border rounded p-1">
        <p class="border rounded d-flex justify-content-center">Настройка списка</p>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_foreign_word" id="flexCheck_foreign_word" >
          <label class="form-check-label" for="flexCheck_foreign_word">
            Иностранное слово
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_trascription" id="flexCheck_transcription" >
          <label class="form-check-label" for="flexCheck_transcription">
            Транскрипция
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_translate" id="flexCheck_translate" >
          <label class="form-check-label" for="flexCheck_translate">
            Перевод
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_modify" id="flexCheck_modify" >
          <label class="form-check-label" for="flexCheck_modify">
            Дата модификации
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_edit_record" id="flexCheck_edit_record" >
          <label class="form-check-label" for="flexCheck_edit_record">
            Редактировать записи
          </label>
        </div>

        <label class="mt-1">Перевернуть список</label>
        <button @click="reverse_array" class="form-control btn btn-sm btn-outline-danger mb-1">reverse</button>
        <label>Вернуть в исходное состояние</label>
        <button @click="reset_array" class="form-control btn btn-sm btn-outline-danger">reset</button>
        <label>Удалить выделенное (муляж)</label>
        <button @click="delete_selected" class="btn btn-sm btn-outline-danger form-control">Delete</button>
        <label>Объеденить в группу (муляж)</label>
        <button class="btn btn-sm btn-outline-danger form-control">merge</button>
   
      </div>


      <div class="border rounded p-1 mt-1">
        <p class="border rounded d-flex justify-content-center">Добавить новое слово:</p>
        <input v-model="one" type="text" class="form-control" title="Иностранный" placeholder="Иностранный"/>
        <input v-model="two" type="text" class="form-control mt-1" title="Родной" placeholder="Расшифровка"/>
        <input v-model="three" type="text" class="form-control mt-1" title="Родной" placeholder="Родной"/>
        <button @click="send_new_word(one, two, three)" class="btn btn-sm btn-outline-info form-control mb-1 mt-1"><i class="bi bi-send"></i></button>
      </div>


    </div>


    <div class="col-sm-8">

      <div class="row">
        <div class="col-sm-12 mt-1">
          <div class="input-group">
            <button class="btn btn-outline-warning"><i class="bi bi-search"></i></button>
            <input v-model="word" @keyup.enter="find_func" class="form-control" placeholder="Введите текст" title="Панель для поиска" />

            <button @click="resu_search = []; word = ''" class="btn btn-outline-warning"><i class="bi bi-backspace"></i></button>
          </div>
        </div>
      </div>

      <div class="col-sm-12 rounded p-1 mt-1" v-if="resu_search.length!==0" style="background-color: #111111;">
        <div class="" v-for="(item, index) in resu_search.slice(0, 10)" :key="item">
          {{ item['one'] }} - {{ item['two'] }} - {{ item['three'] }}
        </div>
      </div>

      <table class="table table-bordered border-secondary mt-1 rounded"  >
        <thead class="p-0">
          <tr>
            <td v-if="check_edit_record" class="p-1"></td>
            <td v-if="check_foreign_word" class="p-1">
              <button @click="sortArr('one')" class="btn btn-sm btn-outline-warning mt-1 me-1">Sort</button>
            </td>
            <td v-if="check_trascription" class="p-1">
              <button @click="sortArr('two')" class="btn btn-sm btn-outline-warning mt-1 me-1">Sort</button>
            </td>
            <td v-if="check_translate" class="p-1">
              <button @click="sortArr('three')" class="btn btn-sm btn-outline-warning mt-1 me-1">Sort</button>
            </td>
            <td v-if="check_modify" class="p-1">
              <button @click="sortArr('date')" class="btn btn-sm btn-outline-warning mt-1 me-1">Sort</button>
            </td>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="(value, index) of resu">

            <th v-if="check_edit_record" class="p-0 ps-1">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="value['select']" >
                <!-- {{ value }} -->
              </div>
            </th>
            
            <td v-if="check_foreign_word" class="p-0 ps-1">
              {{ value['one'] }}
            </td>
            <td v-if="check_trascription" class="p-0 ps-1">
              {{ value['two'] }}
            </td>
            <td v-if="check_translate" class="p-0 ps-1">
              {{ value['three'] }}
            </td>
            <td v-if="check_modify" class="p-0 ps-1">
              {{ value['date'] }}
            </td>
          </tr>
        </tbody>

      </table>

    </div>

  </div>
</template>


<style scoped>
/* .table,.tbody,.thead {
  border-radius: 3%;
} */
tr, td, tbody {
  border-radius: 3%;
}

</style>
<script>
export default {
  data() {
    return {
      books: [],
      type: 'file',
      count: '',
      name: '',
      match_books: [],
      dict: '',
      ll1: '',
      dict_lang: [],
      name_lang: 'en',
      resu: [],
      resu_backup: [],
      resu_search: [],
      // reverse_array: false,
      // reset_array: false,
      word: '',
      one: '',
      two: '',
      three: '',
      check_foreign_word: true,
      check_trascription: false,
      check_translate: true,
      check_modify: false,
      check_edit_record: false,

    }
  },
  async mounted() {
    await this.support_lang()
    await this.selLang('en')
  },
  watch: {

    word() {
      let rx = new RegExp(this.word.toLowerCase())

      this.resu_search = []
      if (this.word!=='') {
        for (let i=0;i<this.resu.length;i++) {
          if (rx.test(this.resu[i]['one'].toLowerCase())) {
            this.resu_search.push(this.resu[i]);
          }
          if (rx.test(this.resu[i]['two'].toLowerCase())) {
            this.resu_search.push(this.resu[i]);
          }
          if (rx.test(this.resu[i]['three'].toLowerCase())) {
            this.resu_search.push(this.resu[i]);
          }
        
        }
      } else {
        this.resu = this.resu_backup.slice(0)
      }



    }

  },
  components: {
  },
  methods: {
    async delete_selected() {
      let send_on_del = []
      this.resu = this.resu
      .filter(item => {
        if (item['select'] === true) send_on_del.push(item)
        return item['select'] !== true
      })
      console.info('Это то что нужно удалить: ', send_on_del)

      const response = await fetch('/g/del', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(send_on_del)
      })

      let result = await response.json()
      console.log('Ответ на запрос об удалении из БД: ', result)


    },
    async reverse_array() {
      this.resu.reverse()
    },
    async reset_array() {
      this.resu = this.resu_backup.slice(0)
    },

    async send_new_word(one, two, three) {
      let send_date = new Date().toISOString()
      this.resu.unshift({one: one, two: two, three: three, date: send_date})
      this.resu_backup = this.resu.slice(0)


      let words = { 
        one: this.one, 
        two: this.two, 
        three: this.three, 
        name_lang: this.name_lang, 
        date: send_date
      }

      const responce = await fetch('/upload/dict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(words)

      })

      console.log(await responce.json())

      this.one = ""
      this.two = ""
      this.three = ""








    },

    async find_func() {
      this.resu = this.resu_search.slice(0)
    },

    async support_lang() {  // запрос доступных языков
      // for (let l of ['Английский', 'Японский', 'Китайский', 'Корейский', 'Немецкий']) this.dict_lang.push(l)
      // let ls = {'en': 'Английский', 'jp': 'Японский', 'cn': 'Китайский', 'kr': 'Корейский', 'de': 'Немецкий'}
      //this.dict_lang = ls;


      const response = await fetch('/upload/lang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ 'lang': lang_code })
      })

      this.dict_lang = await response.json()
      console.log('Это ответ: ', this.dict_lang)
    },

    async sortArr(mode='one') { // сортировка по колонкам
      // console.log(Object.keys(result).sort())
      // console.info('firts: ', first)
      // console.info('second: ', second)
      console.log(this.resu)
      this.resu.sort(function(first, second) {
        // console.log(`first: ${first['one']}\nsecond: ${second}`)
        return first[mode].localeCompare(second[mode]);
      })

      // console.log(items)


    },
    async selLang(lang_code) { // запрашивает словари
      const response = await fetch('/g/lang', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'lang': lang_code })
      })

      let result = (await response.json())
      // result.sort((a, b) => .localeCompare(b.firstname))
      
      console.log('Это результат: ', result)
      // let items = Object.keys(result).map(function(key) {
      //   return [key, result[key]];
      // });

      this.resu = result
      this.resu_backup = this.resu.slice(0)
      this.dict = result
      // console.log('Я тут получил кое-что: ', this.dict)
      // this.rx_array=[]
      // this.array_videos=[]
      // await this.g()
    },

  }
}
</script>
