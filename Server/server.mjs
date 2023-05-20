import express from 'express'
import { v4 } from 'uuid'
import path from 'path'
import fileUpload from 'express-fileupload'
import { WebSocketServer } from 'ws' // для создания websocket
import {createServer} from 'http'
import config from '../Configs/config.mjs';
import dotenv from 'dotenv' //  используется для чтения переменных окружения
const urlencodedParser = express.urlencoded({ extended: false })
import fs from 'fs'
import bodyParser from 'body-parser'





dotenv.config()
console.log(`Ещё раз читаем переменные среды окружения: ${process.env.VITE_APP_F23}`)
// (async () => {
//     await redisClient.Connect();
// })();



// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve();


// создаем объект приложения
const app = express()
const http = createServer(app)



// const dispatchEvent = (message, ws) => {
// 	const json = JSON.parse(message);
// 	switch (json.event) {
// 		case "chat-message": webSocketServer.clients.forEach(client => client.send(message));
// 		default: ws.send((new Error("Wrong query")).message);
// 	}
// }


// создаём экземпляр ws
const wsServer = new WebSocketServer({
	server: http,
})

wsServer.on('connection', ws => {
	ws.on('message', m => {
		console.log('Новое сообщение')
		// console.log(m.toString())
		console.log('Тип сообщения: ', typeof m)
		// let message = new Blob(['привет я с сервера'], {
		// 	type: 'text/plain'
		// })

		console.log('m', m)
		let buffer = new Buffer(m)
		console.log('buffer', buffer)
		fs.writeFile('file888888', buffer, (data)=>{
			console.log(data)
			wsServer.clients.forEach(client => client.send("Загрузка завершена"))
		})
		// let message = 'Привет я с сервера, а ты кто такой?'
		
		// setInterval(() => {
		// 	wsServer.clients.forEach(client => client.send(message))
		// }, 1000)


	})

	ws.on("error", e => ws.send(e));

	ws.send('Привет всем, я сервер websocket');
})


// настройка приложения
app.use(express.json());
app.use(urlencodedParser);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));





// // app.use(cookieParser('secret key'));
app.use(fileUpload({
	defCharset: 'utf8',
    defParamCharset: 'utf8',
	useTempFiles: true,
	tempFileDir: config.folders.files
}));



import get from './Controllers/get.mjs'
import uploadFile from './Controllers/upload.mjs'
import downloadFile from './Controllers/download.mjs'
import qrCode from './Controllers/qrcode.mjs'
// import { create } from 'domain'
import deleteFile from './Controllers/delete.mjs'
import { fstat } from 'fs'


app.use(function (req, res, next) {
	req.wsServer = wsServer;
	next();
});



app.use('/g', get);
app.use('/upload', uploadFile);
app.use('/download', downloadFile);
app.use('/del', deleteFile);
app.use('/qr', qrCode);


console.log(__dirname)
app.use(config.routes.files, express.static(path.join(__dirname, config.folders.files)))
app.use(config.routes.gifs, express.static(path.join(__dirname, config.folders.gifs)))
app.use(config.routes.images, express.static(path.join(__dirname, config.folders.images)))
app.use(config.routes.public, express.static(path.join(__dirname, config.folders.public)))
app.use(config.routes.musics, express.static(path.join(__dirname, config.folders.musics)))
// app.use(express.static('files'));
// app.use('/files1', express.static(path.resolve(__dirname, 'files')));
// app.use('/files', express.static('files'));
// app.use('/js', express.static('js'));
// app.use('/private', express.static('private'));


app.get('*', (req, res) => {
	console.log('отправка стандартного файла')
	res.sendFile(path.resolve('index.html'))
})


//import arr_upload = upload.fields([{ name: 'file', maxCount: 10 }]);
// запуск приложения
http.listen(config.wlan0.port, config.wlan0.host, () => {

	console.log('А тут мы читаем переменные среды окружения: ', process.env.VITE_TEST_VAR)
	console.log(`Сервер запущен - http://${config.wlan0.host}:${config.wlan0.port}/`);
	console.log('Остановить сервер - Ctrl+C');

});