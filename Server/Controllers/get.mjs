import express from 'express'; // web-сервер
import path from 'path'; // Разрешение путей
import fs from 'fs' // доступ к файлам
const router = express.Router();
import { v4 } from 'uuid'
import Iconv from 'iconv'
import youtubedl from 'youtube-dl-exec' // Загрузка видео
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from 'progress-estimator'
import { chdir } from 'process';
import config from '../../Configs/config.mjs'; // Настройки проекта
import { WebSocketServer } from 'ws' // websocket
import { execa } from 'execa';
import redis from 'redis' // драйвер для подключения к NoSql
import user_agent from '../../Configs/user_agent.mjs'; // файковый юзерагент
import { load } from 'cheerio'; // парсинг 
import axios from 'axios'; // загрузка страниц
// import utils from 'util'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// function readFileSync_encoding(filename, encoding) {
// 	var content = fs.readFileSync(filename);
// 	var iconv = new Iconv(encoding, 'UTF-8');
// 	var buffer = iconv.convert(content);
// 	return buffer.toString('utf8');
// }


// const wsServer = new WebSocketServer({
// 	port: config.ws.port,
// })


// показ видео через разбитие на маленькие кусочки
router.get('/', async (req, res) => {
	try {
		let range = req.headers.range;
		// console.log(`range: ${range}`);
		if (!range) {
			res.status(400).send("Requires Range header");
		}

		// let name = req.query.name.replaceAll(' ', '\\ ')
		// let name = location.assign(encodeURIComponent(req.query.name))
		let name = req.query.name
		// console.log(`this name: ${name}`)
		let videoPath = path.resolve(config.folders.videos, name);
		// console.log(`this name: ${videoPath}`)
		let videoSize = fs.statSync(videoPath).size;
		let CHUNK_SIZE = 10 ** 6;
		let start = Number(range.replace(/\D/g, ""));
		// console.log(`start: ${range.replace(/\D/g, "")}`)
		let end = Math.min(start + CHUNK_SIZE, videoSize - 1);
		let contentLength = end - start + 1;
		let headers = {
			"Content-Range": `bytes ${start}-${end}/${videoSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "video/mp4",
		};

		res.writeHead(206, headers);
		// console.log(headers);
		const videoStream = fs.createReadStream(videoPath, { start, end });

		videoStream.pipe(res);
	} catch (e) {
		console.log(e)
	}
})


router.post('/f_file', (req, res) => {
	try {
		console.log(`req body p: ${req.body.p}`)


		fs.readFile(req.body.p, { encoding: 'utf-8' }, function (err, data) {
			if (!err) {
				console.log('received data: ' + data);
				// res.writeHead(200, {'Content-Type': 'application/json'});
				// res.write(data);
				// res.end();
				res.json({ p: data })
			} else {
				console.log(err);
			}
		});
	} catch (e) {
		console.log(e);
	}
})

router.post('/code', (req, res) => {
	try {
		let dir = config.folders.code
		let route = config.routes.images

		let files = [];

		const rd = (dir) => {
			let f1 = fs.readdirSync(dir);

			for (let item of f1) {
				console.log(fs.lstatSync(path.resolve(dir, item)).isDirectory())
				if (fs.lstatSync(path.resolve(dir, item)).isDirectory() &&
					item.toLowerCase() != 'node_modules' &&
					item.toLowerCase() != '.git') {
					rd(path.resolve(dir, item), files)
				} else {
					let file = path.resolve(dir, item)
					// let file=item
					console.log(file)
					files.push(file)
				}

			}
		}

		rd(dir)

		// rd(dir)
		// console.log(`f1: ${f1}`)



		// fs.readdir(dir, (err, items) => {
		// 	if (err) console.log(err);
		// 	let files = Array()
		// 	for (let item of items) {
		// 		// (async () => {
		// 		// 	let r1 = await fs.promises.stat(`${dir}/${item}`)
		// 		// 	res1.push(r1.ctime)
		// 		// })().catch(console.error)
		// 		// var fileStats = fs.statSync(`${dir}/${item}`)
		// 		// res1.push()
		// 		console.log(path.resolve(dir, item))
		// 		if (fs.lstatSync(path.resolve(dir, item))) {

		// 		} else {
		// 			files.push(item)
		// 		}
		// 		// if (['.jpg', '.png', 'jpeg'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
		// 		// 	result.push({
		// 		// 		name: item,
		// 		// 		ctime: fileStats.ctime
		// 		// 	})
		// 		// }
		// 	}


		// 	// console.log(1213123213,123, res1)
		// 	// result.sort(function (a, b) {
		// 	// 	return a.ctime - b.ctime
		// 	// })
		res.json({ items: files })
		// })
	} catch (e) {
		console.log(e)
	}
})

router.post('/lang', (req, res) => {
	try {
		let lang = req.body.lang
		console.log('я тут я тут сука')
		console.log(path.resolve('Share', 'txt', '1.txt'))
		let txt
		// let filename=(lang=='jp')? '1.txt' : '2.txt'
		if (lang == 'jp') {
			txt = fs.readFileSync(path.resolve('Share', 'txt', '1.txt'), {
				encoding: 'utf-8'
			})
			console.log(txt)
			txt = txt
				.split('\n')
				.filter(n => !(n.trim() == ''))
		} else {
			txt = fs.readFileSync(path.resolve('Share', 'txt', '2.txt'), {
				encoding: 'utf-8'
			})
			console.log(txt)

			txt = txt
				.split('\n')
				.filter(n => !(n.trim() == ''))
				.map(item => item.split(' - '))
		}
		console.log(txt)


		res.send(JSON.stringify({ 'res': txt }))
	} catch (e) {
		console.log(e)
	}
})

// router.post('/ch1', async (req, res) => {


// 	if (req.body.partion=='book') {
// 		console.log('нормальное видео')
// 		config.folders.files='Share/books'
// 	} else if (req.body.partion=='file') {
// 		console.log('о неет тут порно')
// 		config.folders.files='Share/files'
// 	}

// })

// тут загрузка видео через ytb-dl и тут ещё redis тестирую
router.get('/s', async (req, res) => {

	let url = req.query.url

	console.log(url)
	/*



	*/



	// await client.disconnect();

	// if (url=="") res.json({'wait': false})
	// const subprocess = youtubedl.exec(url, {
	//   dumpSingleJson: true,

	// })
	// let point1 = __dirname, point2 = path.resolve(config.folders.videos)
	// chdir(point2)
	// subprocess.stdout.pipe(fs.createWriteStream('/videos/stdout.mp4'))
	// subprocess.stderr.pipe(fs.createWriteStream('/videos/stderr.txt'))

	// setTimeout(subprocess.cancel, 30000)

	try {
		const video = await youtubedl(url, {
			//noWarnings: true,
			// preferFreeFormats: true,
			cacheDir: config.folders.videos,
			progress: true,
			paths: config.folders.videos
			// cwd: path.resolve('videos')
		}).then((output) => {
			// console.log(output)
			console.log('тут ws: ', req.wsServer)


			req.wsServer.on('connection', ws => {
				ws.on('message', m => {
					console.log('Загрузка завершена')
					console.log(m.toString())
					console.log(typeof m)
					// let message = new Blob(['привет я с сервера'], {
					// 	type: 'text/plain'
					// })

					let message = 'Привет загрузка завершена'

					// setInterval(() => {
					wsServer.clients.forEach(client => client.send(message))

					// }, 1000)


				})

				ws.on("error", e => ws.send(e));

				ws.send('Загрузка твоего видео завершена');

			})

			res.json({ 'wait': false })

			// chdir(point1)
		});
	}
	catch (err) {
		// console.log(err)
		console.log('Пустое url')
		res.json({ 'wait': false })
	}



	// const promise = youtubedl(url, { dumpSingleJson: true })
	// const result = await logger(promise, `Obtaining ${url}`)

	// console.log(result)

})


// тут запросы для различных типов файлов
router.post('/', async (req, res) => {
	try {
		console.log('nsdlfnsdflsf23449fs')
		console.log(req.body.type)
		if (req.body.type == 'file') {
			console.log('nsdlfnsdflsf23449fs')
			let dir = config.folders.files
			let route = config.routes.files



			fs.readdir(dir, (err, items) => {
                try {
                    if (err) console.log(err);
                    console.log(items)
                    res.json({ "items": items, "route": route })
                } catch (e) {
                    console.log(e)
                    res.json({ "items": [], "route": route})
                }
			})
		}
		else if (req.body.type == 'image') {

			let dir = config.folders.images
			let route = config.routes.images

			fs.readdir(dir, (err, items) => {
				if (err) console.log(err);
				let result = Array()
                try {
                    for (let item of items) {
                        // (async () => {
                        // 	let r1 = await fs.promises.stat(`${dir}/${item}`)
                        // 	res1.push(r1.ctime)
                        // })().catch(console.error)
                        var fileStats = fs.statSync(`${dir}/${item}`)
                        // res1.push()
                        // console.log(item)3
                        if (['.jpg', '.png', 'jpeg'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
                            result.push({
                                name: item,
                                ctime: fileStats.ctime
                            })
                        }
                    }
                    // console.log(1213123213,123, res1)
                    result.sort(function (a, b) {
                        return a.ctime - b.ctime
                    })
                    res.json({ items: result, route: route })
                } catch (e) {
                    console.log(e)
                    res.json({ items: [], route: route })
                }
			})
		}
		else if (req.body.type == 'video') {
            let dir = config.folders.videos
            let route = config.routes.videos

            fs.readdir(dir, (err, items) => {
                try {
                    if (err) console.log(err);
                    let result = Array()
                    items.forEach(item => {
                        if (['.webm', '.avi', '.mp4'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
                            result.push(item)
                        }
                    })
                    res.json({ "items": result, "route": route })
                } catch (e) {
                    console.log(e)
                    res.json({ "items": [], "route": route })
                }
            })


		}
		else if (req.body.type == 'music') {
			let dir = config.folders.musics
			let route = config.routes.musics

			fs.readdir(dir, (err, items) => {
				if (err) console.log(err);
				let result = Array()
                try {
                    items.forEach(item => {
                        if (['.WAV', '.MP3', '.FLAC', '.AAC', '.AIFF', '.OGG', '.MQA', '.MKV'].indexOf(path.parse(item).ext.toUpperCase()) > -1) {
                            result.push(item)
                        }
                    })
                    res.json({ "items": result, "route": route })
                } catch (e) {
                    console.log(e)
                    res.json({ "items": [], "route": route })

                }
			})
		}
		else if (req.body.type == 'book') {
			let dir = config.folders.books
			let route = config.routes.libraries

			fs.readdir(dir, (err, items) => {
				if (err) console.log(err);
                try {
                    let result = Array()
                    items.forEach(item => {
                        if (['.pdf', '.pptx', '.odt', '.docx', '.doc', '.ppt'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
                            result.push(item)
                        }
                    })
                    console.log(result)
                    res.json({ "items": result, "route": route })
                } catch (e) {
                    console.log(e);
                    res.json({ "items": [], "route": route })

                }
			})
		}
	} catch (e) {
		console.log('Ошибка в маркеровке директорий')
		console.log(e)
	}

})


router.post('/message', async (req, res) => {

	// const redisConfig = {
	// 	host: 'localhost',
	// 	port: 6379,
	// 	pass: ''
	// }

	// another example
	// redis[s]://[[username][:password]@][host][:port][/db-number]:

	// createClient({
	// 	url: 'redis://alice:foobared@awesome.redis.server:6380'
	// });

	const redisConfig = {
		url: 'redis://0.0.0.0:6379',
		password: '123'
	}
	try {
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

		// await client.rPush('names', 'sasha')

		const result = await client.lRange('conversation', 0, -1)
		for (let i = 0; i < result.length; i++) {
			result[i] = JSON.parse(result[i])
			console.log(result[i])
		}
		// console.log(result)

		// await client.sAdd('names1', arr1)
		// await client.sAdd('names1', 'privet')

		await client.disconnect()
		res.json(result.reverse())

	} catch (e) {
		console.log(e)
		// if (e instanceof ECONNREFUSED) {
		if (e['code'] == 'ECONNREFUSED') {
			res.json([{ 'name': 'Server', 'message': 'Сообщения после перезагрузки страницы будут унечтожены!', 'time': new Date() }])
		} else {
			throw e;
		}
	}
	// res.json(result)



})

// парсер работы не завершено 000000
router.get('/work', async (req, res) => {
	try {
		const url = 'https://kwork.ru/projects?c=39&prices-filters%5B%5D=4'
		const response = await axios.get(url, user_agent.request_config)

		// console.log(response.data)
		const $ = load(response.data)
		console.log($('body').text())
		//*[@id="app"]/div/div[2]/div[2]/div[3]/div/div[1]
		// >div.project-list.position-relative
		// let html = $.html($('div#app'))
		// let html = $.html($('//*[@id="app"]'))
		// let html = $('div[class="card want-card js-want-container"]').html()
		let html = $('div[class="wants-content"]')
		// let html = $('div[class="project-list position-relative"]')
		// let html = $('#googlehtmlcounter')
		// let items = $('.card')
		// console.log(html.length3)
		// console.log(html.html())
		// console.log(html._root['0'].children)
		console.log(html._root.children().children().priveObject)
		// console.log(html.prevObject.children().children())
		// html._root['0'].children().get().map(el => console.log($(el).text()))
		// console.log(html)
		// items.each((i, div) => {
		// 	console.log(div)
		// 	console.log($(div).html());
		// });

		// console.log($('#app > div > div.centerwrap.page-projects.pt0.page-projects--new > div.wants-filter-content.wants-filter-content--switcher > div.wants-content > div > div:nth-child(1) > div.card.want-card.js-want-container.js-viewed.js-card-2038156'))
		// console.log($('div.card'))
		// $('div.card').each(function(i,e){
		// 	// let item=$(e).text().trim()
		// 	console.log($(e).text())
		// 	// if(item!='') {
		// 	//   columns.push(item)
		// 	// }
		// })
	} catch (e) {
		console.log(e)
	}



})


export default router
