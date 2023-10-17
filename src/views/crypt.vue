<script setup>
import { RouterLink, RouterView } from 'vue-router'
import search from '../../Components/search.vue'
import aesjs from 'aes-js'
</script>
<template>
  <div class="row">
    <div class="col-sm-6">

      <textarea v-model="text" class="form-control mt-2 mb-1" name="ta1" id="id_ta1" placeholder="Открытый текст"
        cols="20" rows="10"></textarea>
      <div class="d-flex">
        <button v-if="enc_mode==1" @click="crypt('enc')" class="btn btn-sm btn-info mb-1 form-control me-1">Зашифровать</button>
        <button v-if="enc_mode==-1" @click="crypt('dec')" class="btn btn-sm btn-danger mb-1 form-control me-1">Расшифровать</button>
        <button @click="this.text=''" class="btn btn-sm btn-info mb-1 form-control me-1">Очистить</button>
        <button class="btn btn-sm btn-success mb-1 form-control me-1">Скопировать</button>
        <button @click="metathesis" class="btn btn-sm btn-success mb-1 form-control"><i class="bi bi-arrow-down-up"></i></button>
      </div>
      <!-- <textarea v-model="en_text" class="form-control mb-2" name="ta1" id="id_ta1" placeholder="Шифротекст"
        cols="20" rows="10" disabled></textarea> -->

    </div>


    <div class="col-sm-6">


      <!-- <ul class="btn-toggle-nav list-unstyled ">
        <li><button class="btn btn-sm btn-info form-control mb-1 mt-2">Шифр Цезаря</button></li>
        <li><button class="btn btn-sm btn-info form-control mb-1">Base64</button></li>
        <li><button class="btn btn-sm btn-info form-control mb-1">AES</button></li>
        <li><button class="btn btn-sm btn-info form-control mb-1">RSA</button></li>
      </ul>
    -->
      <ul class="list-unstyled mb-2 mt-2">

        <li class="mb-1">
          <button class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#history1" aria-expanded="true">
            История
          </button>
          <div class="collapse mt-1" id="history1">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <!-- <li><a href="#" @click="func_stock" class="link-dark d-inline-flex text-decoration-none rounded">Акции</a> -->
              <li><textarea v-model="history" class="form-control mе-1" name="ta1" id="id_ta1" placeholder="История"
        cols="20" rows="10" disabled></textarea></li>
            </ul>
          </div>
        </li>
        <li class="mb-1">
          <button @click="type_crypt='caesar'" class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#download-collapse" aria-expanded="true">
            Шифр Цезаря
          </button>
          <div class="collapse" id="download-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <!-- <li><a href="#" @click="func_stock" class="link-dark d-inline-flex text-decoration-none rounded">Акции</a> -->
              <li><input class="form-control mt-1" v-model="caesar_shift" placeholder="Введите сдвиг"></li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button @click="type_crypt='aes'" class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
            AES
          </button>
          <div class="collapse" id="home-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><input class="form-control mt-1" placeholder="Введите ключ"></li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button @click="type_crypt='xor'" class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
            XOR
          </button>
          <div class="collapse" id="dashboard-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><input v-model="xor_key" class="form-control mt-1" placeholder="Введите ключ"></li>
            </ul>
          </div>
        </li>

        <li class="mb-1">
          <button @click="type_crypt='hex'" class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
            HEX
          </button>
          <!-- <div class="collapse ms-4" id="orders-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              <li><a href="#" @click="" class="link-dark d-inline-flex text-decoration-none rounded">Новый
                  отчёт</a></li>
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Мои отчёты</a></li>
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Удалить отчёт</a>
              </li>
            </ul>
          </div> -->
        </li>
        <!-- <li class="border-top my-3"></li> -->
        <li class="mb-1">
          <button @click="type_crypt='base64'" class="btn btn-sm btn-info w-100 btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
            data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
            base64
          </button>
          <!-- <div class="collapse ms-4" id="account-collapse">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Создать новый</a>
              </li>
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Мой профиль</a>
              </li>
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Настройки
                  профиля</a></li>
              <li><a href="#" class="link-dark d-inline-flex text-decoration-none rounded">Выйти</a></li>
            </ul>
          </div> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      type: 'file',
      count: '',
      name: '',
      match_books: [],
      text: '',
      en_text: '',
      caesar_shift: '',
      type_crypt: '',
      xor_key: 0,
      enc_mode: 1,
      history: ""
    }
  },
  async mounted() {
    await this.get_books()
  },
  components: {
    search
  },
  methods: {
    async crypt(d) {
      console.log('jowfeo ower jrweor jrowe423')
      switch (this.type_crypt) {
        case 'hex':
          await this.hex(d)
          break
        case 'xor':
          await this.xor()
          break
        case 'aes':
          await this.aes(d)
          break
        case 'caesar':
          await this.caesar(d)
          break
        case 'base64':
          console.log('jowfeo ower jrweor jrowe423')
          await this.base64(this.text, d)
          console.log('jowfeo ower jrweor jrowe423')
          break
        default:
          await this.caesar()
          break
      }

    },
    async hex(d) {

      String.prototype.hexEncode = function () {
        let res = "";
        for (let i=0;i<this.length;i++){
          let hex=this.charCodeAt(i).toString(16)
          console.log(('000'+hex).slice(-4))
          res+=('000'+hex).slice(-4)
        }

        return res
      }
      String.prototype.hexDecode = function () {
        let res=''
        let hexes=this.match(/.{1,4}/g)||[]
        for(let i=0;i<hexes.length;i++){
          res+=String.fromCharCode(parseInt(hexes[i], 16))
        }
        return res
      }
      let cry=""
      if (d=='enc') {
        cry=this.text.hexEncode()
      } else {
        cry=this.text.hexDecode()
      }
      this.history+=`${this.text} (hex): ${cry}\n`
      this.text=cry
    },
    async metathesis() {

      this.enc_mode*=-1; // один из немногих случаев, когда точка с запятой нужна в js
      // [this.text, this.en_text]=[this.en_text,this.text]
      // this.text=this.en_text
      // this.text=""
    },
    async xor() {
      // this.text=""
      let string="";
      for (let i=0;i<this.text.length;i++) {
        // this.en_text+=(this.text[i].charCodeAt(0)^this.xor_key).toString()+ " "
        string+=String.fromCharCode(this.text[i].charCodeAt(0)^this.xor_key)
      }
      this.history += `${this.text} (xor): ${string}\n`
      this.text=string
    },
    async aes(d) {
      let key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
      // let text = 'Text may be any length you wish, no padding is required.';



      // var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

      if (d=='enc') {
        let textBytes=aesjs.utils.utf8.toBytes(this.text);

        let aesCtr=new aesjs.ModeOfOperation.ctr(key);

        let encryptedBytes=aesCtr.encrypt(textBytes)

        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

        this.text=encryptedHex

      } else {
        let encryptedBytes = aesjs.utils.hex.toBytes(this.text);

        let aesCtr = new aesjs.ModeOfOperation.ctr(key);

        let decryptedBytes = aesCtr.decrypt(encryptedBytes);

        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

        this.text=decryptedText

      }
    },
    async caesar(d) {

      // window.addEventListener('DOMContentLoaded', function () {

      var UserText = this.text;
      // var UserSelectStap = document.getElementById('encrypt-step');
      var UserStep = Number(this.caesar_shift);
      // var result = this.en_text;
      // var Encrypt = document.getElementById('encrypt-btn');
      // var Decrypt = document.getElementById('decrypt-btn');
      // var Reset = document.getElementById('btn-reset');
      // var TextToWork;
      var pos;

      var OtherSymbols = [' ', ',', '.', ':', ';', '!', '?', '-', '_', '=', '+', '(', ')', '[', ']', '@', '`', "'", '"', '<', '>', '|', '/', '%', '$', '^', '&', '*', '~'];
      var Numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      var RusAlfUp = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
      var RusAlfLower = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
      var EngAlfUp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      var EngAlfLower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'm', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      // var UkrAlfUp = ['А','Б','В','Г','Ґ','Д','Е','Є','Ж','З','И','І','Ї','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
      // var UkrAlfLower = ['а','б','в','г','ґ','д','е','є','ж','з','и','і','ї','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ь','ю','я'];
      var RusAlfUpEncrypt = Array(33);
      var RusAlfLowerEncrypt = Array(33);
      var EngAlfUpEncrypt = Array(26);
      var EngAlfLowerEncrypt = Array(26);
      // var UkrAlfUpEncrypt = Array(33);
      // var UkrAlfLowerEncrypt = Array(33);
      var NumbersEncrypt = Array(10);

      initEncrypt();

      // UserSelectStap.addEventListener('change', function () {
      //   UserStep = Number(this.value);
      //   initEncrypt();
      // });

      function initEncrypt() {
        RusAlfUpEncrypt = CezarEncrypt(UserStep, RusAlfUp);
        RusAlfLowerEncrypt = CezarEncrypt(UserStep, RusAlfLower);
        NumbersEncrypt = CezarEncrypt(UserStep, Numbers);
        EngAlfUpEncrypt = CezarEncrypt(UserStep, EngAlfUp);
        EngAlfLowerEncrypt = CezarEncrypt(UserStep, EngAlfLower);
      }
      // UkrAlfUpEncrypt = CezarEncrypt(3, UkrAlfUp);
      // UkrAlfLowerEncrypt = CezarEncrypt(3, UkrAlfLower);

      function CezarEncrypt(stap, arr) {
        var CopyAlf = arr.slice();
        var i = 0;

        while ((i + stap) < (CopyAlf.length)) {
          var buff = CopyAlf[i];
          CopyAlf[i] = CopyAlf[i + stap];
          CopyAlf[i + stap] = buff;
          i++;
        }
        return CopyAlf;
      }

      // console.log(RusAlfUp);
      // console.log(RusAlfUpEncrypt);
      // console.log(RusAlfLower);
      // console.log(RusAlfLowerEncrypt);

      function contains(symb, arr) {
        var letter = symb;
        pos = 0;
        for (var i = 0; i < arr.length; i++) {
          if (letter === arr[i]) {
            pos = i;
            return true;
            break;
          }
        }
      }

      let decrypt = (text) => {
        var result = '';
        for (var i = 0; i <= text.length; i++) {
          var symbol = text[i];
          if (contains(symbol, OtherSymbols)) {
            result += symbol;
          }
          if (contains(symbol, Numbers)) {
            symbol = NumbersEncrypt[pos];
            result += symbol;
          }
          if (contains(symbol, RusAlfUp)) {
            symbol = RusAlfUpEncrypt[pos];
            result += symbol;
          }
          if ((contains(symbol, RusAlfLower))) {
            symbol = RusAlfLowerEncrypt[pos];
            result += symbol;
          }
          if (contains(symbol, EngAlfUp)) {
            symbol = EngAlfUpEncrypt[pos];
            result += symbol;
          }
          if ((contains(symbol, EngAlfLower))) {
            symbol = EngAlfLowerEncrypt[pos];
            result += symbol;
          }
          // if (contains(symbol, UkrAlfUp)) {
          //     symbol = UkrAlfUpEncrypt[pos];
          //     result += symbol;
          // }
          // if ((contains(symbol, UkrAlfLower))) {
          //     symbol = UkrAlfLowerEncrypt[pos];
          //     result += symbol;
          // }
        }
        // return result;
        this.history +=`${text} (Цезарь): ${result}\n`
        this.text = result
      }

      let encrypt = (text) => {
        var result = '';
        for (var i = 0; i <= text.length; i++) {
          var symbol = text[i];
          if (contains(symbol, OtherSymbols)) {
            result += symbol;
          }
          if (contains(symbol, NumbersEncrypt)) {
            symbol = Numbers[pos];
            result += symbol;
          }
          if (contains(symbol, RusAlfUpEncrypt)) {
            symbol = RusAlfUp[pos];
            result += symbol;
          }
          if ((contains(symbol, RusAlfLowerEncrypt))) {
            symbol = RusAlfLower[pos];
            result += symbol;
          }
          if (contains(symbol, EngAlfUpEncrypt)) {
            symbol = EngAlfUp[pos];
            result += symbol;
          }
          if ((contains(symbol, EngAlfLowerEncrypt))) {
            symbol = EngAlfLower[pos];
            result += symbol;
          }
          // if (contains(symbol, UkrAlfUpEncrypt)) {
          //     symbol = UkrAlfUp[pos];
          //     result += symbol;
          // }
          // if ((contains(symbol, UkrAlfLowerEncrypt))) {
          //     symbol = UkrAlfLower[pos];
          //     result += symbol;
          // }
        }
        this.history+=`${text} (Цезарь): ${result}\n`
        this.text = result;
      }

      if (d=='enc') {
        encrypt(this.text)
      } else {
        decrypt(this.text)
      }

      // Encrypt.addEventListener('click', function () {
      //   TextToWork = UserText.value;
      //   result.value = encrypt(TextToWork);
      // });
      // Decrypt.addEventListener('click', function () {
      //   TextToWork = UserText.value;
      //   result.value = decrypt(TextToWork);
      // });
      // Reset.addEventListener('click', function () {
      //   UserText.value = '';
      //   result.value = '';
      // });









    },
    async base64(str, d) {
      if (d=='enc') {

        this.text = window.btoa(unescape(encodeURIComponent(str)));
        this.history=`${str} (base64): ${this.text}\n`
      } else {
        this.text = decodeURIComponent(escape(window.atob(str)));
        this.history=`${str} (base64): ${this.text}\n`
      }
    

    },
    async send_on_download() {
      // alert(this.v1)
      const response = await fetch('/g/ch1', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify({ 'partion': 'book' })
      })
      // this.rx_array=[]
      // this.array_videos=[]
      // await this.g()
    },
    // async onInputChild(value) {
    //     console.log(value)
    //     alert(value)
    //     // this.count=value
    // },
    async searching() {
      let rx = new RegExp(this.name)
      this.match_books = []
      this.books.forEach(item => {
        if (rx.test(item.toLowerCase())) {
          this.match_books.push(item)
        }
      })
    },
    async get_books() {
      let properties = {
        type: "book",
      }
      const response = await fetch('/g', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'authorization': window.localStorage.getItem('jwt'),
        },
        body: JSON.stringify(properties)
      })
      const result = await response.json()
      console.log(result)
      this.books = result['items']
      this.route = result['route']
      this.match_books = this.books
    }
  }
}
</script>