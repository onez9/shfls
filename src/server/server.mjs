import express from 'express'
import { v4 } from 'uuid'
import path from 'path'
import fileUpload from 'express-fileupload'
import { WebSocketServer } from 'ws' // для создания websocket
import {createServer} from 'http'
import config from './configs/config.mjs';
import dotenv from 'dotenv' //  используется для чтения переменных окружения
const urlencodedParser = express.urlencoded({ extended: false })
import fs from 'fs'
import bodyParser from 'body-parser'
import redis from 'redis' 
//import cors from 'cors'
//import {createServer} from 'vite';
import { createServer as createViteServer } from 'vite'




//async function createServer1() {
dotenv.config()
//console.log(`Ещё раз читаем переменные среды окружения: ${process.env.VITE_APP_F23}`)
// (async () => {
//     await redisClient.Connect();
// })();

// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const __dirname = path.resolve();


// создаем объект приложения
const app = express()
app.set('trust proxy', false)
const http = createServer(app)



//const vite = await createViteServer({
//    server: { middlewareMode: 'ssr' }
//})
//const vite = await createViteServer({
//    server: { middlewareMode: true },
//    appType: 'custom'
//})
//
//app.use(vite.middlewares)
//app.static.mime.define({'text/plain': ['md']});
//express.static.mime.define({'javascript': ['md']});

const redisConfig = {
    url: 'redis://0.0.0.0:6379',
    password: '123'
}
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

    ws.id = v4()
    ws.name = "";
    ws.on('message', async m => {

        console.log('m', m)
        let buffer = new Buffer(m)
        console.log('buffer', buffer)
        console.log(buffer.toString())
        console.log('Новое сообщение')
        // console.log(m.toString())
        console.log('Тип сообщения: ', typeof m)



        try {
            const redisConfig = {
                url: 'redis://0.0.0.0:6379',
                password: '123'
            }
        
            const client = redis.createClient(redisConfig)
            await client.connect()

            client.on('ready', () => {
                console.log("Connected! Success! Ready!");
                // client.set("variable34", "zakhar1101", redis.print)
                // client.get('variable34', redis.print)
            });
        
            client.on('connect', () => {
                console.log("Connected! Success! Connect!");
        
            });
        
            client.on('error', (err) => {
                console.error(err);
            });


            // console.log
            // let message = new Blob(['привет я с сервера'], {
            // 	type: 'text/plain'
            // })


            await client.lPush('conversation', buffer.toString())

            // console.log(await client.lRange('conversation', 0, -1))

            console.log(JSON.parse(buffer))

            await client.disconnect();
        } catch (e) {

            if (e['code']=='ECONNREFUSED') {
                console.log('Необходимо запустить бд')
            } else {
                throw e;
            }
        }
        
        try {
            ws.name=JSON.parse(buffer)['name']

        } catch (err) {
            console.log(err)
            console.log('произошла какая-то хуйня! На главном файле сервера')
            console.log('неправильная форма данных!')
        }
        // console.log(wsServer.clients)
        wsServer.clients.forEach(client => {
            if (ws.id!==client.id) { // отправка только не мне
                // client.send(buffer.toString()+" "+ws.id+"\n"+client.id)
                client.send(buffer.toString())
            }
        })
        
        /*
        fs.writeFile('file888888', buffer, (data)=>{
            console.log(data)
            wsServer.clients.forEach(client => client.send("Загрузка завершена"))
            
        })
        */
        
        // let message = 'Привет я с сервера, а ты кто такой?'
        
        // setInterval(() => {
        // 	wsServer.clients.forEach(client => client.send(message))
        // }, 1000)


    })

    ws.on("error", e => ws.send(e));
    const m1=JSON.stringify({
        'name': ws.name,
        'message': "Прибыл на вечеринку!"
    })
    ws.send(m1.toString());
})


// настройка приложения
app.use(express.json());
app.use(urlencodedParser);
//app.use(cors())

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

//app.use(function (req, res, next) {
//    // Website you wish to allow to connect
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
//
//    // Request methods you wish to allow
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//    // Request headers you wish to allow
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//    // Set to true if you need the website to include cookies in the requests sent
//    // to the API (e.g. in case you use sessions)
//    res.setHeader('Access-Control-Allow-Credentials', true);
//
//    // Pass to next layer of middleware
//    next();
//});

import get from './Controllers/get.mjs'
import uploadFile from './Controllers/upload.mjs'
import downloadFile from './Controllers/download.mjs'
import qrCode from './Controllers/qrcode.mjs'
// import { create } from 'domain'
import deleteFile from './Controllers/delete.mjs'
import control from './Controllers/control.mjs'
import { fstat } from 'fs'


app.use(function (req, res, next) {
    req.wsServer = wsServer;
    next();
});


app.use(express.static(__dirname + '/dist'));
app.use('/g', get);
app.use('/upload', uploadFile);
app.use('/download', downloadFile);
app.use('/del', deleteFile);
app.use('/qr', qrCode);
app.use('/control', control);


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
    // res.setHeader('Content-Type', 'text/html');
    console.log(path.resolve('index.html'))
    res.sendFile(path.resolve('index.html'))
})


//import arr_upload = upload.fields([{ name: 'file', maxCount: 10 }]);
// запуск приложения
http.listen(config.wlan0.port, config.wlan0.host, () => {

    console.log('А тут мы читаем переменные среды окружения: ', process.env.VITE_TEST_VAR)
    console.log(`Сервер запущен - http://${config.wlan0.host}:${config.wlan0.port}/`);
    console.log('Остановить сервер - Ctrl+C');

});
//}

//createServer1()


