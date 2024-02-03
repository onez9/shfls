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
import jwt from 'jsonwebtoken'
import session from 'express-session';
import cors from 'cors'
import cookieParser from 'cookie-parser';



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
// app.set('trust proxy', false)
const http = createServer(app)

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin, profilerefid(whatever header you need)");
//     next();
// }); 

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat',
    // name: '123',
    // secret: "anyrandomstring",
    // cookie: {
    //   maxAge:269999999999
    // },
    cookie: { 
        secure: false,
        // originalMaxAge: 3600,
        // path: '/'
    }
}))





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





// const corsOptions = {
//     origin: "http://192.168.1.103:5173",
//     credentials: true,
// };

// app.use(cors(corsOptions))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));





app.use(cookieParser());


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
import books from './Controllers/books.mjs'
import users from './Controllers/users.mjs'
import files from './Controllers/files.mjs'
import message from './Controllers/message.mjs'
import { fstat } from 'fs'


app.use(function (req, res, next) {
    req.wsServer = wsServer;
    next();
});


app.use((req, res, next) => {
    // console.log('headers: ', req.headers);
    // console.log('header: ', req.header.toString());
    console.log('req.socket: ', req.socket.remoteAddress)
    console.log('req.socket: ', req.socket.remotePort)
    req.headers['remoteFamily'] = req.socket.remoteFamily;
	req.headers['remoteAddress'] = req.socket.remoteAddress;
	req.headers['remotePort'] = req.socket.remotePort;
    next();
})
// CORS middleware
// const allowCrossDomain = function(req, res, next) {
// 	res.header('Access-Control-Allow-Methods', '*');
// 	res.header('Access-Control-Allow-Headers', '*');
// 	next();
// }
// app.use(allowCrossDomain) // позволяем запросы с разных сайтов


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

//     console.log(req.headers)
//     next();
// });



app.use((req, res, next) => {
    // console.log('Авторизация ёбаная: ', req.headers.authorization, req.headers, req.header, req.rawHeaders)
    console.log('jwt headers: ', req.headers)
    try {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, config.wlan0.secret, (err, payload) => {
                try {
                    if (err) {
                        console.log(err)
                        throw 'Токены не совпадают'
                        // return next()
                        // return 

                    } else if (payload) {
                        if (req.session.user_id === payload.id) {
                            req.user = req.session.email
                            console.log('Все прошло успешно!')
                            return next()
                        }
                        // res.send(200)
                        if (!req.user) return next()
                    }
                } catch (e) {
                    if (e instanceof JsonWebTokenError) {
                        console.error('Токен искажён!')
                        console.error(e)

                        res.json({'answer': 'exit'})
                        //res.redirect('/g/login')
                    }
                }


            })

        } else {

            console.log("\x1b[5m\x1b[31m%s\x1b[0m", 'JWT malformed/JWT отсутствует. Возможен парсинг');
            // res.json({'answer': 'exit'})
            // res.redirect('/g/login')
            //throw 'Need authorization. Token authorization is Undefined.'
            return next()
        }   

    } catch (e) {
        //res.redirect('/g/login')
        console.error(e)
    }


})





app.use(fileUpload({
    defCharset: 'utf8',
    defParamCharset: 'utf8',
    useTempFiles: true,
    tempFileDir: config.folders.files
}));


app.use(express.static(__dirname + '/dist'));
app.use('/g', get);

app.use('/books', books)
app.use('/users', users)
app.use('/files', files)
app.use('/message', message)

app.use('/upload', uploadFile);
app.use('/download', downloadFile);
app.use('/del', deleteFile);
app.use('/qr', qrCode);
app.use('/control', control);






console.log(__dirname)
app.use(config.routes.files, express.static(path.join(__dirname, config.folders.files)))
// app.use(config.routes.gifs, (req, res, next) => {
//     // console.log('мы находимся в мидлваре: ', req.query.name, path.join(__dirname, config.folders.gifs), config.folders.gifs)
//     let path_to_pass=path.join(__dirname, config.folders.gifs);
//     // console.log('m1: ', req.query);
//     // if(req.query.path=='porno'){
//     //     path_to_pass=path.join(path_to_pass,'porno')
//     console.log('Передаю патчтупасс: ', path_to_pass)
//     // }
//     express.static(path_to_pass);
//     // next();
// })

app.use(config.routes.gifs, express.static(path.join(__dirname, config.folders.gifs)))


app.use(config.routes.images, express.static(path.join(__dirname, config.folders.images)))
app.use(config.routes.public, express.static(path.join(__dirname, config.folders.public)))
app.use(config.routes.musics, express.static(path.join(__dirname, config.folders.musics)))


// app.get('/gifs', (req, res)=>{
// 	console.log('А вот и я!!!!');
// 	res.json('123');
// })

// const corsOptions = {
// 	origin: 'http://192.168.1.103:5173',  //Your Client, do not write '*'
// 	credentials: true,
// };
// app.use(cors(corsOptions));



// app.use(express.static('files'));
// app.use('/files1', express.static(path.resolve(__dirname, 'files')));
// app.use('/files', express.static('files'));
// app.use('/js', express.static('js'));
// app.use('/private', express.static('private'));



















app.get('*', (req, res) => {
    console.log('Sending default file.')
    // res.setHeader('Content-Type', 'text/html');
    console.log(path.resolve('index.html'))
    res.sendFile(path.resolve('index.html'))
})



//import arr_upload = upload.fields([{ name: 'file', maxCount: 10 }]);



http.listen(config.wlan0.port, config.wlan0.host4, () => {

    console.log('Environment variables: ', process.env.VITE_TEST_VAR)
    console.log(`Address: http://${config.wlan0.host4}:${config.wlan0.port}`);
    // console.log('Остановить сервер - Ctrl+C');

});



