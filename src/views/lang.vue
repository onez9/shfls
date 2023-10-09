<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import axios from 'axios';

</script>
<template>


  <div class="row">
    <div class="col-sm-4">
      <div class="col-sm mb-1 mt-1">
        <label>Выберете язык</label>
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
          <input class="form-check-input" type="checkbox" v-model="check_date" id="flexCheck_date" >
          <label class="form-check-label" for="flexCheck_date">
            Дата модификации
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="checkbox" v-model="check_time" id="flexCheck_time" >
          <label class="form-check-label" for="flexCheck_time">
            Время модификации
          </label>
        </div>


        <label class="mt-1">Перевернуть список</label>
        <button @click="reverse_array" class="form-control btn btn-sm btn-outline-danger mb-1">reverse</button>
        <label>Вернуть в исходное состояние</label>
        <button @click="reset_array" class="form-control btn btn-sm btn-outline-danger">reset</button>
        <label>Удалить выделенное</label>
        <button @click="delete_selected" class="btn btn-sm btn-outline-danger form-control">Delete</button>
        <label>Объеденить в группу (муляж)</label>
        <button class="btn btn-sm btn-outline-danger form-control">merge</button>
        <!-- <label v-if="check_edit_record">Сохранить выделенную группу</label> -->
        <!-- <button v-if="check_edit_record" @click="save_selected" class="btn btn-sm btn-outline-danger form-control">Save</button> -->
   
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
            <button class="btn btn-outline-danger"><i class="bi bi-search"></i></button>
            <input v-model="word" @keyup.enter="find_func" class="form-control" placeholder="Введите текст" title="Панель для поиска" />

            <button @click="resu_search = []; word = ''" class="btn btn-outline-danger"><i class="bi bi-backspace"></i></button>
          </div>
        </div>
      </div>

      <div class="col-sm-12 rounded p-1 mt-1" v-if="resu_search.length!==0" style="background-color: #111111;">
        <div class="" v-for="(item, index) in resu_search.slice(0, 10)" :key="item">
          {{ item['one'] }} - {{ item['two'] }} - {{ item['three'] }}
        </div>
      </div>

      <table class="table table-bordered table-dark mt-1 rounded"  >
        <thead class="p-0">
          <tr class="bg-info p-0">
            <td class="p-0 m-0">
              <button @click="check_edit_record =! check_edit_record" class="btn btn-sm btn-outline-danger"><i class="bi bi-check-square"></i></button>
            </td>
            <td v-if="check_foreign_word" class="p-0 m-0">
              <div class="d-flex">
                <button @click="sortArr('one', f1), f1 =! f1" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f1==true), 'bi-sort-alpha-up': (f1==false)}"></i></button>
              </div>
            </td>
            <td v-if="check_trascription" class="p-0 m-0">
              <div class="d-flex">
                <button @click="sortArr('two', f2), f2 =! f2" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f2==true), 'bi-sort-alpha-up': (f2==false)}"></i></button>
              </div>
            </td>
            <td v-if="check_translate" class="p-0 m-0">
              <div class="d-flex">
                <button @click="sortArr('three', f3), f3 =! f3" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f3==true), 'bi-sort-alpha-up': (f3==false)}"></i></button>
              </div>
            </td>
            <td v-if="check_date" class="p-0 m-0">
              <div class="d-flex">
                <button @click="sortArr('date', f4), f4 =! f4" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f4==true), 'bi-sort-alpha-up': (f4==false)}"></i></button>
              </div>
            </td>
            <td v-if="check_time" class="p-0 m-0">
              <div class="d-flex">
                <button  @click="sortArr('time', f5), f5 =! f5" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f5==true), 'bi-sort-alpha-up': (f5==false)}"></i></button>
                
              </div>
            </td>
            <td class="p-0 m-0">
              <!-- <button class="btn btn-sm btn-outline-danger mt-1 me-1"><i class="bi bi-sort-alpha-down"></i></button> -->
            </td>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="(value, index) of resu">

            <td  class="p-0 align-middle" style="width: 1%;">
              <div class="d-flex justify-content-center">
                <div v-if="check_edit_record"  class="form-check ">
                  <input class="form-check-input " type="checkbox" v-model="value['select']" >
                </div>
                <label v-else class="badge text-bg-danger"> {{ index + 1 }} </label>
              </div>
            </td>
            
            <td v-if="check_foreign_word" class="p-0 px-1 align-middle col">
              <label v-if="!value['edit']">{{ value['one'] }} </label>
              <input v-if="value['edit']" class="form-control border-0 p-0 align-middle" v-model="value['one']" data-style-base="form-control" data-style="">
            </td>
            <td v-if="check_trascription" class="p-0 px-1 align-middle col">
              <label v-if="!value['edit']">{{ value['two'] }}</label>
              <input v-if="value['edit']" class="form-control border-0 p-0 align-middle" v-model="value['two']">
            </td>
            <td v-if="check_translate" class="p-0 px-1 align-middle col">
              <label v-if="!value['edit']">{{ value['three'] }}</label>
              <input v-if="value['edit']" class="form-control border-0 p-0 align-middle" v-model="value['three']">
            </td>
            <td v-if="check_date" class="p-0 px-1 align-middle col">
              <label>{{ value['date'] }}</label>
              <!-- <input type="date" v-if="value['select']" class="form-control" v-model="value['date']"> -->
            </td>
            <td v-if="check_time" class="p-0 px-1 align-middle col">
              <label>{{ value['time'] }}</label>
              <!-- <input type="time" v-if="value['select']" class="form-control" v-model="value['time']"> -->
            </td>
            <td class="p-0 col" style="width: 1%;">
              <div class="d-flex">
                <button v-if="value['edit']" @click="save_value(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-save"></i></button>
                <button v-if="!value['edit']" @click="next1(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-pen"></i></button>
                <button v-if="value['edit']" @click="back(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-back"></i></button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>

    </div>

  </div>
</template>


<style scoped>
tr, td, tbody {
  border-radius: 3%;
}

.bootstrap-select .form-control:focus {
    outline: 0px none #fff !important;
}

.bootstrap-select .form-control > div.filter-option:focus {
    outline: 0px none #fff !important;
}

.bootstrap-select .form-control > div.filter-option > div.filter-option-inner:focus {
    outline: 0px none #fff !important;
}

.bootstrap-select .form-control > div.filter-option > div.filter-option-inner > div.filter-option-inner-inner:focus {
    outline: 0px none #fff !important;
}

*:focus {
    box-shadow: none !important;
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
      check_date: false,
      check_time: false,
      check_edit_record: false,
      flag_save: false,
      f1: true,
      f2: true,
      f3: true,
      f4: true,
      f5: true

    }
  },
  async mounted() {
    await this.support_lang()
    await this.selLang('en')
  },
  watch: {
    // check_edit_record() { // при любом изменении check_edit_record, item['select'] будет равен false
    //   this.resu = this.resu.map(item => {
    //     if (item['select']===true) {
    //       item['select'] = false

    //       item['one'] = item['one_bak']
    //       item['two'] = item['two_bak']
    //       item['three'] = item['three_bak']
    //       item['date'] = item['date_bak']
    //       item['time'] = item['time_bak']
    //       item['lang'] = this.name_lang


    //     }


    //     return item;
    //   })
    // },


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
    async next1(value) {
      value['edit'] = true
      
      // создаём копии для отката
      value['one_bak'] = value['one']
      value['two_bak'] = value['two']
      value['three_bak'] = value['three']
      value['date_bak'] = value['date']
      value['time_bak'] = value['time']
      value['lang'] = this.name_lang

    },
    async back(value) {
      value['edit'] = false
      
      // откат
      value['one'] = value['one_bak']
      value['two'] = value['two_bak']
      value['three'] = value['three_bak']
      value['date'] = value['date_bak']
      value['time'] = value['time_bak']

    },

    async save_value(value) {
      //let modify_lst = [] 
      //modify_lst = this.resu.filter(item => item['edit'] === true)
      console.info('Это список который отправится в БД для обновления: ', value)

      value['date'] = new Date().toLocaleDateString()
      value['time'] = new Date().toLocaleTimeString()

      if (true) {
        const response = await fetch('/g/upd', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
          },
          body: JSON.stringify(value)
        })

        let result = await response.json()
        console.log('это результат с /g/upd', result)
      }

      value['edit'] = false
    },



    async delete_selected() {
      let send_on_del = []
      this.resu = this.resu
      .filter(item => {
        if (item['select'] === true) send_on_del.push(item)
        return item['select'] !== true
      })
      console.info('Это то что нужно удалить: ', send_on_del)

      if (true) {
        const response = await fetch('/g/del', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(send_on_del)
        })

        let result = await response.json()
        console.log('Ответ на запрос об удалении из БД: ', result)
      }


    },
    async reverse_array() {
      this.resu.reverse()
    },
    async reset_array() {
      this.resu = this.resu_backup.slice(0)
    },

    async send_new_word(one, two, three) {
      // let send_date = new Date().toISOString()

      let send_date = new Date()
      this.resu.unshift({
        one: one, 
        two: two, 
        three: three, 
        date: send_date.toLocaleDateString(), 
        time: send_date.toLocaleTimeString()
      })
      this.resu_backup = this.resu.slice(0)


      let words = { 
        one: this.one, 
        two: this.two, 
        three: this.three, 
        name_lang: this.name_lang, 
        date: send_date.toLocaleDateString(),
        time: send_date.toLocaleTimeString()
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

    async sortArr(mode='one', field) { // сортировка по колонкам
      // console.log(Object.keys(result).sort())
      // console.info('firts: ', first)
      // console.info('second: ', second)
      console.log(this.resu)
      this.resu.sort(function(first, second) {
        // console.log(`first: ${first['one']}\nsecond: ${second}`)
        return first[mode].localeCompare(second[mode]);
      })
      if (!field) {
        this.resu.reverse()
      }
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
