import express from 'express'
import {v4} from 'uuid'
import path from 'path'
import fileUpload from 'express-fileupload'
import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve();

const app = express()

// настройка приложения
app.use(express.json());
// // app.use(cookieParser('secret key'));
app.use(fileUpload({    
	useTempFiles : true,
	tempFileDir : 'files/'
}));



import getFiles from './Controllers/get.mjs'
import uploadFile from './Controllers/upload.mjs'
import downloadFile from './Controllers/download.mjs'
import qrCode from './Controllers/qrcode.mjs'
import config from './config.mjs'






app.use('/get', getFiles);
app.use('/upload', uploadFile);
app.use('/download', downloadFile);
app.use('/qr', qrCode);


console.log(__dirname)
app.use('/files', express.static(path.join(__dirname,'files')))
app.use('/public', express.static(path.join(__dirname,'public')))
// app.use(express.static('files'));



// app.use('/files1', express.static(path.resolve(__dirname, 'files')));
// app.use('/files', express.static('files'));
// app.use('/js', express.static('js'));
// app.use('/private', express.static('private'));


app.get('*', (req, res)=>{
	console.log('отправка стандартного файла')
	res.sendFile(path.resolve('index.html'))
})


//import arr_upload = upload.fields([{ name: 'file', maxCount: 10 }]);
// запуск приложения
app.listen(config.wlan0.port, config.wlan0.host, () => {
	console.log(`Сервер запущен - http://${config.wlan0.host}:${config.wlan0.port}/`);
	console.log('Остановить сервер - Ctrl+C');

});
