<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import axios from 'axios';
import Swal from 'sweetalert2';



</script>
<template>

  <!-- {{ selected_id }} -->
  <div class="row">


    <div class="col-sm-12" v-if="!show_menu">
      <div class="d-flex p-0 mt-1">
        <input v-model="one" ref="myinput" type="text" class="form-control p-0 me-1 ps-1" title="Иностранный" placeholder="Иностранный"/>
        <input v-model="two" type="text" class="form-control p-0 me-1 ps-1" title="Родной" placeholder="Транскрипция"/>
        <input v-model="three" type="text" class="form-control p-0 me-1 ps-1" title="Родной" placeholder="Родной"/>
        <button @click="send_new_word(one, two, three)" class="btn btn-sm btn-outline-danger" :disabled="(one=='' || three=='')? true : false"><i class="bi bi-send"></i></button>
      
      </div>
    </div>

    <div class="col-sm-4 rounded m-0 p-1" v-if="show_menu">
      <div v-if="false" class="border rounded p-1 mt-1 " >
        <input type="search" id="site-search" name="q" />
      </div>
      
      <div v-if="false" class="border rounded p-1 mt-1 " >
        <!-- <button type="color" class="btn btn-sm btn-outline-danger">123</button> -->
        <input type="week" />
      </div>
      <div v-if="false" class="border rounded p-1 mt-1 " >
        <!-- <button type="color" class="btn btn-sm btn-outline-danger">123</button> -->
        <input type="color" value="#ff0000" />
      </div>
      <div v-if="false" class="border rounded p-1 mt-1 " >
        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-gear"></i></button>
      </div>


      <!-- <div v-if="show_menu"> -->
      <div class="border rounded p-0 px-1">
        <label @click="create_mode_dictionary =! create_mode_dictionary" class="w-100">Создать новый словарь</label>
        <template v-if="create_mode_dictionary">
          <input class="form-control p-0 ps-1" title="Название словаря" placeholder="Название словаря" v-model="name_dictionary">
          <button @click="create_new_dict" class="btn btn-sm form-control btn-outline-danger my-1">Создать</button>
        </template>
      </div>



      <div class="border rounded mt-1 p-1" v-if="mode_filter">
        <!-- <input type="radio" id="one" value="one" v-model="mode_request">
        <label for="one"> Период</label>
        <br>
        <input type="radio" id="two" value="two" v-model="mode_request">
        <label for="two"> Конкретная дата</label>
        <br> -->
        <label @click="mode_filter=false" class="w-100">Дни активности:</label>
        <!-- <input class="form-control p-0 ps-1" title="Название словаря" placeholder="Название словаря"> -->
        <!-- <button @click="set_date(date['date'])" class="btn btn-sm form-control btn-outline-danger d-flex justify-content-left mt-1 " v-for="(date, key) in action_days">{{ date['date'] }} ({{ date['count'] }})</button> -->
        <select @change="set_date(select_day)" v-model="select_day" class="form-select mt-1 bg-dark text-white p-0 ps-1" name="" title="Выберете дату">
          <option  v-for="(value, key) in action_days" :value="value['date']">{{ value['date'] }} ({{  value['count'] }})</option>
        </select>






        <div class="form-check">
          <input class="form-check-input" type="radio" name="exampleRadios" id="specific_date" value="specific_date" v-model="mode_request">
          <label class="form-check-label" for="specific_date">
            Конкретная дата
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="exampleRadios" id="specific_period" value="specific_period" v-model="mode_request">
          <label class="form-check-label" for="specific_period">
            Период
          </label>
        </div>




        <label for="made1">Начало:</label>
        <div id="made1" class="mb-1">
          <input type="date" class="btn btn-sm btn-outline-danger me-1 form-control" v-model="select_date_from">
          <!-- {{select_date_from}} -->
          <!-- <input type="time" step="1" class="btn btn-sm btn-outline-danger" v-model="select_time_from"> -->
        </div>

        <template v-if="mode_request == 'specific_period'">
          <label for="made2">Конец:</label>
          <div id="made2" class="mb-1">
            <input type="date" class="btn btn-sm btn-outline-danger me-1 form-control" v-model="select_date_to">
            <!-- <input type="time" step="1" class="btn btn-sm btn-outline-danger" v-model="select_time_to"> -->
          </div>

        </template>
        <button @click="requestFiltrLst" class="btn btn-sm btn-outline-danger form-control">Отправить</button>
      </div>



      <select @change="selLang(name_lang, 1)" v-model="name_lang" class="form-select mt-1 bg-dark text-white p-0 ps-1" name="" title="Выберете язык">
        <option  v-for="(value, key) in dict_lang" v-bind:value="value['id']">{{ value['name'] }}</option>
      </select>
      <div v-if="false" class="border rounded p-1 mt-1">
        <label class="d-flex justify-content-start" @click="show_alphavit_mode =! show_alphavit_mode">Показать алфавит</label>
        <div v-if="show_alphavit_mode" class="border rounded p-1 mt-1 " >
          <img class="w-100" style="background-color: white;" src="/images/hiragana.png" alt="">
        </div>
        <div v-if="show_alphavit_mode" class="border rounded p-1 mt-1 ">
          <img class="w-100" src="/images/katakana.jpeg" alt="">
        </div>
      </div>
      <div :class="{'border rounded mt-1 p-0 px-1': true, 'border-my': new_word_mode}">
        <label 
          @click="new_word_func" 
          class="d-flex justify-content-start">
            Открыть слова

        </label>

        <input v-if="new_word_mode" v-model="one" ref="myinput" type="text" class="form-control ps-1 p-0" title="Иностранный" :placeholder="dict_lang[name_lang-1]?.name"/>
        <input v-if="new_word_mode" v-model="two" type="text" class="form-control mt-1 ps-1 p-0" title="Родной" placeholder="Транскрипция"/>
        <input v-if="new_word_mode" v-model="three" type="text" class="form-control mt-1 ps-1 p-0" title="Родной" placeholder="Родной"/>
        <button v-if="new_word_mode" @click="send_new_word(one, two, three)" class="my-btn-send" :disabled="(one=='' || three=='')? true : false"><i class="bi bi-send"></i></button>
        <button v-if="new_word_mode" class="my-btn-clear">Стереть</button>  
        <!-- <button v-if="new_word_mode" @click="get_words()" class="btn btn-sm btn-outline-danger form-control mt-1">Показать слова</button> -->
      </div>

      <div :class="{'border rounded px-1 mt-1 p-0': true, 'border-my': (add_phrase_mode)}">
        <label @click="add_phrase_func" class="d-flex justify-content-start">Открыть фразеологизмы</label>
        <!-- <input type="text" class="form-control mb-1" title="Название" placeholder="Название"> -->
        <textarea v-if="add_phrase_mode" v-model="fi_phrase" type="text" class="form-control mb-1" title="Описание" placeholder="Иностранный"></textarea>
        <textarea v-if="add_phrase_mode" v-model="fo_phrase" type="text" class="form-control mb-1" title="Описание" placeholder="Русский"></textarea>
        <button v-if="add_phrase_mode" @click="phraseological_unit(fi_phrase, fo_phrase)" class="btn btn-sm btn-outline-danger form-control" :disabled="(fi_phrase=='' || fo_phrase=='')? true : false">Создать</button>
        <button v-if="add_phrase_mode" @click="get_phrase()" class="btn btn-sm btn-outline-danger form-control mt-1 mb-1">Показать фразеологизмы</button>
      </div>

      <button @click="create_rule_func" class="btn btn-sm btn-outline-danger mt-1 form-control d-flex justify-conten-start">Грамматика</button>


      <div class="border rounded px-1 mt-1 p-0">
        <label @click="show_groups_func" class="d-flex justify-content-start">Группы ({{ current_group }})</label>
        <div v-if="new_group_mode">
          <input v-if="true" v-model="name_group" ref="myinput1" v-on:keyup.enter="create_group(name_group)" type="text" class="form-control mb-1" title="Название" placeholder="Название">
          <button v-if="true" @click="create_group(name_group)" class="btn btn-sm btn-outline-danger form-control mb-1">Создать</button>
      
      
          <div v-for="(item, index) in groups" :key="item" class="border rounded p-0 mb-1 d-flex align-items-center">
            <!-- <div class="me-auto ps-2"></div> -->
            <!-- {{ item }} -->
            <button @click="get_values_from_group(item)" class="btn btn-sm btn-outline-danger me-1 w-100">{{ item['name'] }}</button>
            <button @click="add_to_group" class="btn btn-sm btn-outline-danger me-1"><i class="bi bi-save"></i></button>
            <!-- <button @click="" class="btn btn-sm btn-outline-danger me-1"><i class="bi bi-pen"></i></button> -->
            <button @click="selGroup(item)" class="btn btn-sm btn-outline-danger me-1"><i class="bi bi-plus"></i></button>
            <button @click="delGroup(item)" class="btn btn-sm btn-outline-danger"><i class="bi bi-x"></i></button>
          </div>
        </div>
      </div>
      <div class="border rounded px-1 mt-1 p-0 mb-1">
        <label @click="edit_list_mode =! edit_list_mode" class="d-flex justify-content-start">Настроить список</label>
        <div v-if="edit_list_mode" class="border rounded p-1">
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
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="check_date_and_time" id="flexCheck_date_and_time" >
            <label class="form-check-label" for="flexCheck_date_and_time">
              Сортировка по дате и времени
            </label>
          </div>
        </div>
      </div>
      <div class="border rounded px-1 mt-1 p-0 mb-1" v-if="click_one_tmp[0] || click_one_tmp[1] || click_one_tmp[2]">
        <p class="my-0 py-0" style="font-size: 30px;">{{ click_one_tmp[0] }}</p>
        <p class="my-0 py-0">{{ click_one_tmp[1] }}</p>
        <p class="my-0 py-0"
          style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">{{ click_one_tmp[2] }}</p>
      </div>
    </div>

    <!-- <div class="col-sm-12">
      <input type="color">
    </div> -->


    <div :class="{'col-sm-8': show_menu, 'col-sm-12': !show_menu}">

      <div class="row">
        <div class="col-sm-12 mt-1">
          <div class="input-group">
            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-search"></i></button>
            <button @click="show_menu =! show_menu" class="btn btn-sm btn-outline-danger"><i class="bi bi-gear"></i></button>
            <input 
              v-model="word" 
              @input="word_change" 
              @keyup.enter="find_func" 
              @keyup.escape="csr"
              class="form-control p-0 m-0 ps-1 _edit_mode" 
              placeholder="Поиск по ключевым словам" 
              title="Панель для поиска" />

            <label class="border lc d-flex align-items-center px-2">{{ this.tablo_result }}</label>
            
            <!-- <button @click="collection" class="btn btn-sm btn-outline-danger"><i class="bi bi-collection"></i></button> -->
            <button @click="mode_filter =! mode_filter" class="btn btn-sm btn-outline-danger"><i class="bi bi-funnel"></i></button>
            <!-- <button @click="downl_search" class="btn btn-sm btn-outline-danger"><i class="bi bi-sliders2-vertical"></i></button> -->
            <button @click="downl_search" class="btn btn-sm btn-outline-danger"><i class="bi bi-arrow-clockwise"></i></button>
            <button @click="csr" class="btn btn-sm btn-outline-danger"><i class="bi bi-backspace"></i></button>
          </div>
        </div>
        <div class="col-sm-12" v-if="create_rule_mode">
          <div :class="{'border rounded mt-1 px-1 p-0': true, 'border-my': (create_rule_mode)}">
            <label @click="" class="d-flex justify-content-start">Правила</label>
            <input v-model="name_rule" type="text" class="form-control mb-1" title="Название" placeholder="Название">
            <textarea v-model="description_rule" type="text" class="form-control mb-1" title="Описание" placeholder="Описание"></textarea>
            <button @click="add_rule(name_rule, description_rule)" class="btn btn-sm btn-outline-danger form-control mb-1" :disabled="(name_rule=='' || description_rule=='')? true : false">Создать</button>
            <!-- <button v-if="create_rule_mode" @click="get_rules()" class="btn btn-sm btn-outline-danger form-control mt-1">Показать правила</button> -->
          </div>
        </div>
      </div>


      <div class="rounded p-1 mt-1 style_searching" v-if="resu_search.length!==0">
        <div class="" v-for="(item, index) in resu_search.slice(0, 20)" :key="item">
          {{ item[1] }}
        </div>
      </div>


      <table v-if="resu.length !== 0 && !create_rule_mode" class="table table-bordered table-hover table-dark mt-1 rounded"  >
        <thead class="p-0">
          <tr class="bg-info p-0">
            <td class="p-0 m-0">
              <button @click="check_edit_record =! check_edit_record" class="btn btn-sm btn-outline-danger"><i class="bi bi-check-square"></i></button>
            </td>
            <td v-if="check_foreign_word" class="p-0 m-0">
              <div class="d-flex">
                <!-- <button @click="requestSortLst('one', f1), f1 =! f1" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f1==true), 'bi-sort-alpha-up': (f1==false)}"></i></button> -->
                <button @click="requestSortLst('one')" class="btn btn-sm btn-outline-danger"><i class="bi bi-filter-square"></i></button>

              </div>
            </td>
            <td v-if="check_trascription" class="p-0 m-0">
              <div class="d-flex">
                <!-- <button @click="requestSortLst('two', f2), f2 =! f2" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f2==true), 'bi-sort-alpha-up': (f2==false)}"></i></button> -->
                <button @click="requestSortLst('two')" class="btn btn-sm btn-outline-danger"><i class="bi bi-filter-square"></i></button>
              </div>
            </td>
            <td v-if="check_translate" class="p-0 m-0">
              <div class="d-flex">
                <button @click="requestSortLst('three')" class="btn btn-sm btn-outline-danger"><i class="bi bi-filter-square"></i></button>
                <!-- <button @click="requestSortLst('three', f3), f3 =! f3" class="btn btn-sm btn-outline-danger"><i :class="{'bi': true,  'bi-sort-alpha-down': (f3==true), 'bi-sort-alpha-up': (f3==false)}"></i></button> -->
              </div>
            </td>
            <td v-if="check_date" class="p-0 m-0">
              <div class="d-flex">
                <button @click="requestSortLst('date')" class="btn btn-sm btn-outline-danger"><i class="bi bi-filter-square"></i></button>
                <!-- <button class="btn  btn-sm btn-outline-danger"><i class="bi bi-calendar"></i></button> -->
                <!-- <input type="date" v-model="select_date" class="btn btn-sm btn-outline-danger" @change="get_date(select_date)"> -->
              </div>
            </td>
            <td v-if="check_time" class="p-0 m-0">
              <div class="d-flex">
                <button  @click="requestSortLst('time')" class="btn btn-sm btn-outline-danger"><i class="bi bi-filter-square"></i></button>
                <!-- <button class="btn  btn-sm btn-outline-danger"><i class="bi bi-clock-history"></i></button> -->
                <!-- <input type="time" v-model="select_time" step="1" class="btn btn-sm btn-outline-danger" @change="get_time(select_time)"> -->
              </div>
            </td>
            <td class="p-0 m-0">
              <!-- <button class="btn btn-sm btn-outline-danger mt-1 me-1"><i class="bi bi-sort-alpha-down"></i></button> -->
            </td>
          </tr>
        </thead>
        <tbody class="">
          <tr v-for="(value, index) of resu">
            <!-- {{ value }} -->
            <td :class="{'p-0 align-middle': true, 'bg-selected': value['edit']}" style="width: 1%;">
              <div class="d-flex justify-content-center">
                <div v-if="check_edit_record"  class="form-check ">
                  <input class="form-check-input " type="checkbox" v-model="value['select']" @change="add_selected(value.id)">
                </div>
                <label v-else class="badge w-100"> {{ index + 1 }} </label>
              </div>
            </td>
            
            <td 
              @mouseover="click_one(value)" 
              v-if="check_foreign_word" 
              :class="{'p-0 px-1 align-middle col': true, 'bg-selected': value['edit']}">
              <label 
                v-if="!value['edit']">
                {{ value['one'] }}
              </label>
              <input v-if="value['edit']" class="form-control border-0 rounded-0 p-0 align-middle bg-selected" v-model="value['one']" data-style-base="form-control" data-style="">
            </td>
            <td v-if="check_trascription" :class="{'p-0 px-1 align-middle col': true, 'bg-selected': value['edit']}">
              <label v-if="!value['edit']">{{ value['two'] }}</label>
              <input v-if="value['edit']" class="form-control border-0 rounded-0 p-0 align-middle bg-selected" v-model="value['two']">
            </td>
            <td v-if="check_translate" :class="{'p-0 px-1 align-middle col': true, 'bg-selected': value['edit']}">
              <label v-if="!value['edit']">{{ value['three'] }}</label>
              <input v-if="value['edit']" class="form-control border-0 rounded-0 p-0 align-middle bg-selected" v-model="value['three']">
            </td>
            <td v-if="check_date" class="p-0 px-1 align-middle col">
              <label class="text-nowrap">{{ value['date'] }}</label>
              <!-- <input type="date" v-if="value['select']" class="form-control" v-model="value['date']"> -->
            </td>
            <td v-if="check_time" class="p-0 px-1 align-middle col">
              <label>{{ value['time'] }}</label>
              <!-- <input type="time" v-if="value['select']" class="form-control" v-model="value['time']"> -->
            </td>
            <td class="p-0 col" style="width: 1%;">
              <div class="d-flex justify-content-end">
                <button v-if="value['edit']" @click="save_value(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-save"></i></button>
                <button v-if="!value['edit']" @click="next1(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-pen"></i></button>

                <button v-if="value['edit']" @click="del_value(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-trash"></i></button>
                <button v-if="value['edit']" @click="back(value)" class="btn btn-sm btn-outline-danger" ><i class="bi bi-back"></i></button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>

      <label v-if="resu.length == 0 && rules.length == 0" class="d-flex justify-content-center mt-5">Тут ничего нет</label>

      <template v-if="create_rule_mode">
        <div v-for="(item, index) in rules" class="border rounded mt-1 p-1">
          <div class="input-group mb-1">
            <button @click="item['edit_mode'] =! item['edit_mode']" class="btn btn-sm btn-outline-danger"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-x-lg"></i></button>
            <button @click="item['edit_mode'] = false" class="btn btn-sm btn-outline-danger"><i class="bi bi-save"></i></button>
          </div>
          <div class="border rounded mb-1 d-flex p-0">
            <p v-if="!item['edit_mode']" style="color: #7b7b7b" class="ps-1 p-0 m-0 edit_font">{{ item['one'] }}</p>
            <input v-else class="form-control p-0 m-0 ps-1 border-0 edit_font" v-model="item['one']">
            <p style="color: #7b7b7b" class="ms-auto m-0 mx-1 edit_font">{{ item['date'] }}</p>
            <p style="color: #7b7b7b" class="m-0 me-1 edit_font">{{ item['time'] }}</p>
          </div>
          <p style="color: #7b7b7b" class="border rounded mb-1 ps-1 p-0 edit_font" v-html="item['three']"></p>
          <div  v-if="item['edit_mode']">
            <textarea class="form-control ps-1 p-0 edit_font" v-model="item['three']"></textarea>
          </div>
        </div>
      </template>


      
      <div v-if="rules.length==0">
        <!-- переключатель страниц -->
        <div class="mt-1 d-flex justify-content-center">
          <nav aria-label="Page navigation mt-1 example">
            <ul class="pagination">
              <li v-if="currentPage > 0" class="page-item"><a class="page-link extreme_button" href="#"
                  @click="checker_page(currentPage - 1)">&lt;</a></li>
              <li v-if="currentPage > 2" class="page-item"><a class="page-link" href="#" @click="checker_page(0)">1</a></li>

              <template v-for="(page, i) in totalpages">
                <li v-if="(currentPage - 2 < page) && (currentPage + 4 > page)"
                  :class="{ 'page-item': true, 'active': (page - 1 == currentPage) }">
                  <a class="page-link" @click="checker_page(page - 1)" href="#">{{ page }}</a>
                </li>
              </template>



              <li v-if="currentPage < totalpages - 3" class="page-item">
                <a class="page-link" href="#" @click="checker_page(totalpages - 1)">
                  {{ totalpages }}
                </a>
              </li>
              <!-- <li v-if="currentPage==totalpages-2" class="page-item"><a class="page-link" href="#" @click="checker_page(currentPage+1)">{{ currentPage }}</a></li> -->
              <li v-if="currentPage < totalpages - 1" class="page-item"><a class="page-link extreme_button" href="#"
                  @click="checker_page(currentPage + 1)">&gt;</a></li>
            </ul>
          </nav>
        </div>
      </div>


    </div>

  </div>
</template>



<style scoped>

.my-btn {
  margin: 0;
  padding: 0;
  padding-inline: 2px;
  border: 1px solid yellow;
  border-radius: 3px;
  font-size: 10px;
}
.my-btn-send {
  width: 100%;
  border: 0 solid #111111;
  margin-top: 4px;
  /* margin-bottom: 4px; */
  border-radius: 15px;
  background-color: #0a4f4f;
  text-align: center;
}
.my-btn-clear {
  width: 100%;
  border: 0 solid #111111;
  margin-top: 4px;
  margin-bottom: 4px;
  border-radius: 15px;
  background-color: #0a4f4f;
  text-align: center;
}
.my-btn-clear:hover {
  background-color: orangered;
}
.my-btn-send:disabled {
  background-color: #444444;
}
.edit_font {
  font-size: 13px;
}
.pagination>li:first-child>a, .pagination>li:first-child>span {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
    
}
.pagination>li:last-child>a, .pagination>li:last-child>span {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.style_searching {
  background-color: #111111;
  padding: 5px;
  border-radius: 5px;
  text-decoration: underline;
  /* z-index: 1000; */
  position: relative;
  display: inline-block;
  width: 100%;
  /* box-sizing: border-box;
  -moz-box-sizing: border-box; */
}
tr, td, tbody {
  border-radius: 3%;
}
.lc {
  font-size: 10px;
  border-color: #0a4f4f;
}
.badge {
  font-size: 10px;
  background-color: #0a4f4f;
}
.bg-selected {
  background-color: rgb(120, 24, 24);
}
.bg-selected:focus {
  background-color: rgb(56, 10, 10);
}
.extreme_button {
  background-color: #0a4f4f;
}
.active {
  background-color: #031313 !important;
}
.pagination > .active > a
{
  color: white;
  background-color: #5A4181 !Important;
  border: solid 1px #5A4181 !Important;
}
.pagination > .active > a:hover
{
  background-color: #5A4181 !Important;
  border: solid 1px #5A4181;
}
.btn-outline-danger {
  border-color: #0a4f4f;
  color: #c3b5b5;
}
.border-danger  {
  border-color: #0a4f4f;
  color: #c3b5b5;
}
.border {
  border-color: #0a4f4f;
  color: #c3b5b5;
}
.border-my {
  border-color: #0a4f4f;
  color: #c3b5b5;
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
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before {
  background-color: green!important;
}
.form-check-input .custom-checkbox .custom-control-input:checked:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 255, 0, 0.25)
}
.form-check-input .custom-checkbox .custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 0, 0, 0.25)
}
.form-check-input .custom-checkbox .custom-control-input:active ~ .custom-control-label::before {
  background-color: #C8FFC8; 
}

</style>


<script>
export default {
  data() {
    return {
      selected_id: [],
      one_mode: 0,
      two_mode: 0, 
      three_mode: 0,
      show_menu: true,
      books: [],
      type: 'file',
      focused: false,
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
      date_mode: true,
      time_mode: true,
      fi_phrase: '',
      fo_phrase: '',
      name_rule: '',
      description_rule: '',
      new_word_mode: true,
      create_rule_mode: false,
      add_phrase_mode: false,
      new_group_mode: false,
      edit_list_mode: false,
      change_lang_mode: false,
      show_alphavit_mode: false,
      phraseologicals: [],
      rules: [],
      groups: [],
      select_date_from: '',
      select_time_from: '',
      select_date_to: '',
      select_time_to: '',
      name_group: '',
      current_group: {},
      currentPage: 0,
      words_on_page: 30,
      rls: [],
      tablo_result: 0,
      check_date_and_time: false,
      sort_mode: { name: 'one', order: true, date_order: true, time_order: true, m2: false},
      filter_mode: {},
      last_column_sort: '',
      mode_request: 'specific_date',
      mode_filter: false,
      mode_collection: false,
      action_days: [],
      name_dictionary: '',
      create_mode_dictionary: false,
      rule_array: [],
      scroll: 0,
      html_text: '',
      edit_rule_mode: false,
      select_day: '',
      click_one_tmp: {},
    }
  },
  props: {
    search: String,
    // word: String
  },
  async mounted() {

    this.html_text = '<h1>hello world</h1>'
    // настройка сортирови
    if (window.localStorage.getItem('sort_mode.name') == null) {
      window.localStorage.setItem('sort_mode.name', JSON.stringify(this.sort_mode.name))
    } else {
      this.sort_mode.name = window.localStorage.getItem('sort_mode.name')
    }
    if (window.localStorage.getItem('sort_mode.order') == null) {
      window.localStorage.setItem('sort_mode.order', JSON.stringify(this.sort_mode.order))
    } else {
      this.sort_mode.order = JSON.parse(window.localStorage.getItem('sort_mode.order'))
    }
    if (window.localStorage.getItem('sort_mode.date_order') == null) {
      window.localStorage.setItem('sort_mode.date_order', JSON.stringify(this.sort_mode.date_order))
    } else {
      this.sort_mode.date_order = JSON.parse(window.localStorage.getItem('sort_mode.date_order'))
    }
    if (window.localStorage.getItem('sort_mode.time_order') == null) {
      window.localStorage.setItem('sort_mode.time_order', JSON.stringify(this.sort_mode.time_order))
    } else {
      this.sort_mode.time_order = JSON.parse(window.localStorage.getItem('sort_mode.time_order'))
    }
    if (window.localStorage.getItem('sort_mode.m2') == null) {
      window.localStorage.setItem('sort_mode.m2', JSON.stringify(this.sort_mode.m2))
    } else {
      this.sort_mode.m2 = JSON.parse(window.localStorage.getItem('sort_mode.m2'))
    }







    // настройка списка
    if (window.localStorage.getItem('check_foreign_word') == null) {
      window.localStorage.setItem('check_foreign_word', this.check_foreign_word)
    } else {
      this.check_foreign_word = JSON.parse(window.localStorage.getItem('check_foreign_word'))
    }
    if (window.localStorage.getItem('check_trascription') == null) {
      window.localStorage.setItem('check_trascription', this.check_trascription)
    } else {
      this.check_trascription = JSON.parse(window.localStorage.getItem('check_trascription'))
    }
    if (window.localStorage.getItem('check_translate') == null) {
      window.localStorage.setItem('check_translate', this.check_translate)
    } else {
      this.check_translate = JSON.parse(window.localStorage.getItem('check_translate'))
    }
    if (window.localStorage.getItem('check_date') == null) {
      window.localStorage.setItem('check_date', this.check_date)
    } else {
      this.check_date = JSON.parse(window.localStorage.getItem('check_date'))
    }
    if (window.localStorage.getItem('check_time') == null) {
      window.localStorage.setItem('check_time', this.check_time)
    } else {
      this.check_time = JSON.parse(window.localStorage.getItem('check_time'))
    }
    if (window.localStorage.getItem('check_date_and_time') == null) {
      window.localStorage.setItem('check_date_and_time', this.check_date_and_time)
    } else {
      this.check_date_and_time = JSON.parse(window.localStorage.getItem('check_date_and_time'))
    }


    // настройка страницы запрашиваемой при открытии
    if (window.localStorage.getItem('currentPage') == null) {
      window.localStorage.setItem('currentPage', this.currentPage)
    } else {
      this.currentPage = Number(window.localStorage.getItem('currentPage'))
    }

    // настройка языка при открытии
    if (window.localStorage.getItem('name_lang') == null) {
      window.localStorage.setItem('name_lang', this.name_lang)
    } else {
      this.name_lang = window.localStorage.getItem('name_lang')
    }




    await this.support_lang()
    await this.selLang(this.name_lang)
    // await this.downl_search()
    // await this.get_collection()

    
  },
  directives: {

  },
  watch: {
    currentPage() {
      window.localStorage.setItem('currentPage', this.currentPage)
    },
    name_lang() {
      window.localStorage.setItem('name_lang', this.name_lang)
    },
    check_foreign_word() {
      window.localStorage.setItem('check_foreign_word', this.check_foreign_word)
    },
    check_trascription() {
      window.localStorage.setItem('check_trascription', this.check_trascription)
    },
    check_translate() {
      window.localStorage.setItem('check_translate', this.check_translate)
    },
    check_date() {
      window.localStorage.setItem('check_date', this.check_date)
    },
    check_time() {
      window.localStorage.setItem('check_time', this.check_time)
    },
    check_date_and_time() {
      this.sort_mode.m2 =! this.sort_mode.m2
      window.localStorage.setItem('check_date_and_time', this.check_date_and_time)
    },

    mode_filter() {
      if (!this.mode_filter){
        this.select_date_from=""
        this.select_date_to=""
        this.select_time_from=""
        this.select_time_to=""
      }
    },

    mode_request() {
      if (this.mode_request == 'specific_date') {
        this.select_date_to = ""
        this.select_time_to = ""
        this.currentPage = 0
      }
    },

    // search() {
    //   this.word = this.search
    // },

    // sort_mode: { name: 'one', order: true, date_order: true, time_order: true, m2: false}
    /*
    word() {
      let rx = new RegExp(this.word.toLowerCase())

      this.resu_search = []
      if (this.word!=='') {
        for (let i=0;i<this.resu.length;i++) {
          if (rx.test(this.resu[i]['one'].toLowerCase())) {
            // console.log(this.resu[i])
            this.resu_search.push(this.resu[i]['one']);
          }
          if (rx.test(this.resu[i]['two'].toLowerCase())) {
            // console.log(this.resu[i])
            this.resu_search.push(this.resu[i]['two']);
          }
          if (rx.test(this.resu[i]['three'].toLowerCase())) {
            // console.log(this.resu[i])
            this.resu_search.push(this.resu[i]['three']);
          }
        
        }
      } else {
        this.resu = this.resu_backup.slice(0)
      }



    }
    */

  },
  components: {
  },
  methods: {
    async add_selected(id) {
      this.selected_id.push(id)
    },
    async click_one(value) {
      value.color =! value.color;
      if (value.color) {
        this.click_one_tmp[0] = value.one;
        this.click_one_tmp[1] = value.two;
        this.click_one_tmp[2] = value.three;
      }

    },
    async csr() {
      this.resu_search = []; 
      this.word = ''; 
      this.resu = this.resu_backup.slice()
    },
    async start() {
      document.addEventListener('scroll', (event) => {
        // if (window.scrollY ) {
        console.log(window.scrollY)
        this.scroll = window.scrollY
        // window.scrollY %= 768

        // }
      })
    },
    async set_date(date) {
      console.info(date)
      this.select_date_from = date.split(".").reverse().join("-");
    },
    async get_collection() {
      const response = await fetch('/books/g/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          lang: this.name_lang
        })
      })

      let result = await response.json()
      this.action_days = result
      console.log(result)

    },
    async collection() {
      this.mode_collection =! this.mode_collection


    },
    async create_new_dict() {
      const response = await fetch('/books/c/dictionary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          name: this.name_dictionary
        })
      })

      let result = await response.json()
      if (result.answer == 'ok') {
        this.dict_lang.push(this.name_dictionary)
        this.name_dictionary = ""
      } else {
        console.info('answer: ', result)
      }
      console.log(result)

    },
    async request_by_date() {
      console.info(this.select_date_from)
      console.info(this.select_time_from)
      console.info(this.select_date_to)
      console.info(this.select_time_to)
      
      let properties;


      if (this.select_date_to == '') {
        properties = {
          lang: this.name_lang,
          date_from: this.select_date_from,
          time_from: this.select_time_from,
        }
      } else {
        properties = {
          lang: this.name_lang,
          date_from: this.select_date_from,
          time_from: this.select_time_from,
          date_to: this.select_date_to,
          time_to: this.select_time_to
        }
      }
      
      // this.resu = []
     


      const response = await fetch('/g/period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify(properties),
        "mode": "cors"
      })


      let result = await response.json()
      this.resu = result



    },
    async del_value(value) {
      console.log(value)
      const response = await fetch('/books/d/word', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          value: value
        })
      })

      let result = await response.json()
      console.log('del value from word: ', result)


      this.resu.splice(this.resu.indexOf(value), 1)
      this.rls.splice(this.rls.indexOf(value), 1)
      this.resu_search.splice(this.resu_search.indexOf(value), 1)
      this.resu_backup.splice(this.resu_backup.indexOf(value), 1)





    },
    async downl_search() {
      const properties = {
        lang: this.name_lang,
      }
      const response = await fetch('/books/g/all_words', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify(properties),
        "mode":"cors"

      })

      this.rls = (await response.json())
      console.log(this.rls)
      this.tablo_result = this.rls.length
    },
    async checker_page(page) {
      this.currentPage = page
      if (this.mode_filter) await this.requestFiltrLst()
      else await this.selLang(this.name_lang)

      // await this.requestSortLst()
    },
    async delGroup(item) {
      console.log('Удаляю группу 23482347823849234')
      console.log(item)
      // item.index_lang=this.name_lang
      axios({
        method: 'DELETE',
        url: '/books/d/group',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        //responseType: 'stream'
        data: item,
        "mode":"cors"
      
      }).then((response) => {
        console.log(response)
        if (response['data']['result'] == 'success') {
          this.groups.splice(this.groups.indexOf(item), 1)
        } else if (response['data']['result'] == 'failed') {
          alert('Произошла ошибка где-то на сервере!')
        } else {
          alert('Я не знаю где ошибка!')
        }
        //response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))

      });
    },
    async get_values_from_group(item) {
      this.current_group = item
      const response = await fetch('/books/g/w/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          group_id: this.current_group['id'],
          lang: this.name_lang
        }),
        "mode":"cors"
      })

      let result = await response.json()
      console.log('Arrive a result: ', result)

      this.resu = result
    },
    async add_to_group() {
      this.check_edit_record = true
      
      let selected_group = []
      this.resu
      .filter(item => {
        if (item['select'] === true) selected_group.push(item)
        return item['select'] !== true
      })

      console.log(selected_group)
      //this.resu=selected_group.slice(0)


      if (selected_group.length != 0) {
        const response = await fetch('/books/a/w/group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: window.localStorage.getItem('jwt'),
          },
          body: JSON.stringify({
            group_id: this.current_group['id'],
            items: selected_group.map(item => item['id']),
          }),
          "mode":"cors"
        })

        let result = await response.json()
        //console.log(result)
        alert('Данные добавленны!', result)
      } else {
        console.info('Список пуст не каких запросов не будет!')
        alert('Список пуст не каких запросов не будет!')
      }

    },
    async selGroup(item) {
      this.current_group = item
      this.check_edit_record = true 
      this.resu = this.resu_backup.slice(0)
    },
    async create_group(name) {
      const time_date = new Date()
      const time = time_date.toLocaleTimeString()
      const date = time_date.toLocaleDateString()

      if (name.trim() != "") {
        const obj = {
          name: name,
          time: time,
          date: date,
          lang: this.name_lang
        }
        
        const response = await fetch('/books/c/group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: window.localStorage.getItem('jwt'),
          },
          body: JSON.stringify(obj),
          "mode":"cors"
        })


        let result = await response.json()
        if(result.answer=='success'){
          this.groups.unshift(obj)
        }else if(result.answer=='fall'){
          alert('Имя занято')
        }


        this.name_group = ""

        console.log(`Result creating group: ${JSON.stringify(result)}`)
        
        await this.submitData1() // смена фокуса
     
     
     
      } else {
        alert('Придумай название группы!')
        //Swal.fire('Придумай название группы!')

      }



    },
    async show_groups_func() {
      this.new_group_mode =! this.new_group_mode
      this.add_phrase_mode = false
      this.new_word_mode = false
      this.create_rule_mode = false

      if (this.new_group_mode==true) {
        await this.get_groups()
      } else {
        this.current_group = {}
      }

    },
    async add_phrase_func() {
      this.add_phrase_mode =! this.add_phrase_mode
      this.new_word_mode = false
      this.create_rule_mode = false
      this.new_group_mode = false

      if (this.add_phrase_mode==true) {
        await this.get_phrase()
      }

    },
    async create_rule_func() {
      this.create_rule_mode =! this.create_rule_mode
      this.add_phrase_mode = false
      this.new_word_mode = false
      this.new_group_mode = false
      

      if (this.create_rule_mode==true) { // загружаем правила
        await this.get_rules() 
      } else { // возвращаем всё как было
        this.rules = []
        await this.support_lang() 
        await this.selLang(this.name_lang)

      }
    },
    async new_word_func() {
      this.new_word_mode =! this.new_word_mode
      this.add_phrase_mode = false
      this.create_rule_mode = false
      this.new_group_mode = false

      if (this.new_word_mode==true) {
        await this.get_words()
        this.rules = []
      }
    },
    async get_time(value) {
      console.log('типо время: ', value)

      if (value.split(':').length == 3) {
        const response = await fetch('/g/time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: window.localStorage.getItem('jwt'),

          },
          body: JSON.stringify({
            lang: this.name_lang,
            time: value,
          }),
          "mode": "cors"
        })


        let result = await response.json()
        this.resu = result
      }


    },
    async get_date(value) {
      const response = await fetch('/g/date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify({
          lang: this.name_lang,
          date: value,
        }),
        "mode": "cors"
      })


      let result = await response.json()
      this.resu = result


      // this.resu = this.resu_backup.slice(0)

      // if (value !== "") {
      //   let date = value.split('-')
      //   date = `${date[2]}.${date[1]}.${date[0]}`
      //   this.resu = this.resu.filter(item => item['date'] == date)

      // }
      
    },
    async get_words() {
      this.resu = this.resu_backup.slice(0)
      this.tablo_result = this.resu.length
    },
    async get_groups() {
      console.log('Загрузка всех всех всех групп')
      const response = await fetch('/books/g/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          lang: this.name_lang
        }),
        "mode": "cors"
      })

      let result = await response.json()
      //console.log(result)
      this.groups = result
      console.log('Список загруженных групп: ', this.groups)

    },
    async get_phrase() {
      // this.show_words_mode = false
      if (this.phraseologicals.length==0) {
        const response = await fetch('/books/g/phrase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('jwt'),

          },
          body: JSON.stringify({
            lang: this.name_lang
          }),
          "mode": "cors"
        })


        let result = await response.json()
        this.phraseologicals = result

      } 
      this.rule_array = this.phraseologicals.slice(0)
      this.resu = []

    },
    async get_rules() {
      const response = await fetch('/books/g/rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify({
          lang: this.name_lang
        }),
        "mode": "cors"
      })


      let result = await response.json()
      console.log('rules: ', result)
      this.rules = result
      this.resu = []

    },
    async phraseological_unit(fi, fo) {
      const time = new Date().toLocaleTimeString()
      const date = new Date().toLocaleDateString('en-CA')
      const response = await fetch('/books/c/phrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('jwt'),


        },
        body: JSON.stringify({
          input: fi,
          output: fo,
          lang: this.name_lang,
          time: time,
          date: date
        }),
        "mode":"cors"
      })

      this.phraseologicals.unshift({one: fi, three: fo, time: time, date: date})
      this.resu = this.phraseologicals.slice(0)
      this.fi_phrase = ""
      this.fo_phrase = ""


      let result = await response.json()
      //console.log(`add new phrase unit(this answer): ${result}`)
    },
    async add_rule(name, description) {
      const date_time = new Date()
      const time = date_time.toLocaleTimeString()
      const date = date_time.toLocaleDateString('en-CA')
      
      //console.info(name, description)
      const response = await fetch('/books/c/rule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify({
          name: name,
          description: description,
          lang: this.name_lang,
          time: time,
          date: date
        }),
        "mode":"cors"
      })

      this.rules.unshift({one: name, three: description, time: time, date: date})
      // this.resu = this.rules.slice(0)

      this.name_rule = ""
      this.description_rule = ""

      let result = await response.json()
      //console.log('add new rule: answer: ', result)
    },
    async submitData() {
      this.$refs.myinput.focus()
    },
    async submitData1() {
      this.$refs.myinput1.focus()
    },
    async next1(value) {
      // this.edit_color = true
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
      // this.edit_color = false
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

      value['date'] = new Date().toLocaleDateString('en-CA')
      value['time'] = new Date().toLocaleTimeString()

      if (true) {
        const response = await fetch('/books/u/word', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
            authorization: window.localStorage.getItem('jwt'),

          },
          body: JSON.stringify(value),
          "mode":"cors"
        })

        let result = await response.json()
        console.log('это результат с /g/upd', result)
      }

      value['edit'] = false
    },
    async word_change() {
      //console.log('i\'m running !')
      try {
        let rx = new RegExp(this.word.toLowerCase())

        this.resu_search = []
        if (this.word!=='') {
          // for (let i=0, count=0;i<this.resu.length;i++) {
          this.resu_search = this.rls.filter(item => rx.test(item[1].toLowerCase()))
          this.tablo_result = this.resu_search.length
          // console.log(this.resu[i])
          // this.resu_search.push(this.resu[i]);
          // count += 1
          // if (count >= 5) break
          // }
          // }

        } else {
          this.resu = this.resu_backup.slice(0)
          this.tablo_result = this.rls.length
        }

      } catch (e) {
        console.log(e)
      }


    },
    async delete_selected() {
      let send_on_del = []
      this.resu = this.resu
      .filter(item => {
        try {
          if (item['select'] === true) send_on_del.push(item)
          return item['select'] !== true
        } catch (e) {
          console.log(e)
        }
      })
      //console.info('Это то что нужно удалить: ', send_on_del)

      if (true) {
        const response = await fetch('/d/word', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem('jwt'),

          },
          body: JSON.stringify(send_on_del),
          "mode":"cors"
        })

        let result = await response.json()
        //console.log('Ответ на запрос об удалении из БД: ', result)
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
        date: send_date.toLocaleDateString('en-CA'), 
        time: send_date.toLocaleTimeString()
      })
      this.resu_backup = this.resu.slice(0)


      let words = { 
        one: this.one, 
        two: this.two, 
        three: this.three, 
        name_lang: this.name_lang, 
        date: send_date.toLocaleDateString('en-CA'),
        time: send_date.toLocaleTimeString()
      }

      const responce = await fetch('/books/c/word', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify(words),
        "mode": "cors"

      })

      //console.log(await responce.json())

      this.one = ""
      this.two = ""
      this.three = "";

      await this.submitData()







    },
    async find_func() {
      if (this.word!=="") {
        let arr = this.resu_search.map(item => item[0])
        console.log(arr)
        this.tablo_result = arr.length

        const response = await fetch('/books/s/word', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            arr: arr,
            lang: this.name_lang
          })
        })

        this.resu = await response.json()
        this.resu_search = []
        
      } else {
        console.info('435 3485 3485 3458 34 53845 3458')
        this.tablo_result = this.rls.length
      }
    },
    async support_lang() {  // запрос доступных языков
      // for (let l of ['Английский', 'Японский', 'Китайский', 'Корейский', 'Немецкий']) this.dict_lang.push(l)
      // let ls = {'en': 'Английский', 'jp': 'Японский', 'cn': 'Китайский', 'kr': 'Корейский', 'de': 'Немецкий'}
      //this.dict_lang = ls;


      const response = await fetch('/books/g/name-book', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': window.localStorage.getItem('jwt'),
        },
        "mode": "cors"
        //body: JSON.stringify({ 'lang': lang_code })
      })

      this.dict_lang = await response.json()
      //console.log('Это ответ: ', this.dict_lang)
    },
    async requestSortLst(column) { // сортировка по колонкам
      this.sort_mode['name'] = column
      this.sort_mode['order'] =! this.sort_mode['order']


      window.localStorage.setItem('sort_mode.name', this.sort_mode.name)
      window.localStorage.setItem('sort_mode.order', this.sort_mode.order)

      // sort_mode.date_order
      // sort_mode.time_order
      // 231.m2
      if (['one', 'two', 'three'].indexOf(column) > -1) {
        this.check_date_and_time = false;
      }


      if (this.check_date_and_time) {
        if (column == 'date') {
          this.sort_mode['date_order'] =! this.sort_mode['date_order']
          window.localStorage.setItem('sort_mode.date_order', this.sort_mode.date_order)
        }

        if (column == 'time') {
          this.sort_mode['time_order'] =! this.sort_mode['time_order']
          window.localStorage.setItem('sort_mode.time_order', this.sort_mode.time_order)
        }

      }
      await this.selLang(this.name_lang)

      

    },
    async requestFiltrLst() {
      if (this.mode_filter) {
        if (this.select_date_to == '') {
          console.info(this.select_date_from)
          console.info(this.select_date_to)
          this.filter_mode['date_from'] = this.select_date_from
          this.filter_mode['time_from'] = this.select_time_from

        } else {
          this.filter_mode['date_from'] = this.select_date_from
          this.filter_mode['time_from'] = this.select_time_from
          this.filter_mode['date_to'] = this.select_date_to
          this.filter_mode['time_to'] = this.select_time_to
        }


      } else {
        console.log('i\'m running!')
      }


      // this.currentPage = 0;
      await this.selLang(this.name_lang)

    },
    async selLang(lang_code, nlm=0) { // запрашивает слова из указанного словаря
      if (nlm==1) {
        this.currentPage = 0
        this.create_rule_mode = false
        this.click_one_tmp={}
        await this.downl_search()
      }
      console.info('lang_code: ', lang_code)


      const properties = {
        page: this.currentPage,
        limit: this.words_on_page,
        lang: lang_code,
        sort_mode: this.sort_mode,
        filter_mode: this.filter_mode,
 

      }


      const response = await fetch('/books/g/words', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'Application/json',
          'Authorization': window.localStorage.getItem('jwt'),

        },
        body: JSON.stringify(properties),
        "mode":"cors"

      })

      let result = (await response.json())
      // result.sort((a, b) => .localeCompare(b.firstname))
      
      // console.log('Это результат: ', result)
      // let items = Object.keys(result).map(function(key) {
      //   return [key, result[key]];
      // });
      console.info('это результат: ', result)
      this.totalpages = Math.ceil(result.count123 / this.words_on_page)
      this.resu = result.body123
      this.resu_backup = this.resu.slice(0)
      // this.dict = result
      this.tablo_result = result.count123
      this.filter_mode = {}
      this.current_group = {}
      await this.get_groups()
      // await this.get_rules()
      await this.get_collection()



    },

  }
}
</script>
