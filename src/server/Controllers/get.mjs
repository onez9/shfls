import express from 'express'; // web-сервер
import path, { resolve } from 'path'; // Разрешение путей
import fs, { existsSync, writeFileSync } from 'fs' // доступ к файлам
const router = express.Router();
import { v4 } from 'uuid'
import Iconv from 'iconv'
import youtubedl from 'youtube-dl-exec' // Загрузка видео
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import progress_estimator from 'progress-estimator'
const logger = progress_estimator()

//import { chdir } from 'process';
import config from '../configs/config.mjs'; // Настройки проекта
import { WebSocketServer } from 'ws' // websocket
//import { execa } from 'execa';
import redis from 'redis' // драйвер для подключения к NoSql
import user_agent from '../configs/user_agent.mjs'; // файковый юзерагент
import { load } from 'cheerio'; // парсинг 
import axios from 'axios'; // загрузка страниц
import { ObjectLoader } from 'three';
// import utils from 'util'
import sqlite from 'sqlite3';
const db_path = "./db.sqlite3"

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
		// for(let i=0;i<100;i++){
		// 	console.info(req.query.partname)
		// }
		let range = req.headers.range;
		// console.log(`range: ${range}`);
		if (!range) {
			res.status(400).send("Requires Range header");
		}

		// let name = req.query.name.replaceAll(' ', '\\ ')
		// let name = location.assign(encodeURIComponent(req.query.name))
		let name = req.query.name
		// console.log(`this name: ${name}`)
		let dir = config.folders.videos
		// dir = 'Share/video2'
		// if (!existsSync(dir)) {
		// 	dir = 'Share/video2'
		// }

		let videoPath = path.resolve(dir, name);
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
router.post('/all_files', (req, res) => {
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


		res.json({ items: files })


	} catch(e) {
		console.log(e)
	}
})


router.post('/code', (req, res) => {
	try {
		let dir = config.folders.code
		let route = config.routes.images
		let page = req.body.page
		let limit = req.body.limit
		let files = [];
		// let all = req.body.all | false

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

		let fromIndex = page * limit     // начальный индекс товара
		let toIndex = page*limit + limit // конечный индекс товара
		if (toIndex > files.length) {
			toIndex = files.length
		}
		let productsPage = files.slice(fromIndex, toIndex)

		console.log(page, limit)
		// return c.JSON(http.StatusOK, productsPage)



		res.json({ "items": productsPage, "count_files": files.length })


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
		// res.json({ items: files })
		// })
	} catch (e) {
		console.log(e)
	}
})

router.post('/upd', (req, res) => {
	try {
		const db = new sqlite.Database('db.sqlite3')
		const data = req.body // хранит обновляемый объект
		console.log('Тут что надо обновить в бд: ', req.body)
		let sql = "update words set one=?, two=?, three=?, date=?, time=? where one=? and two=? and three=? and date=? and time=? and dictionary_id=?"
		
		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;
		
		
		
		db.serialize(() => {
			const stmt = db.prepare(sql);
			//for (let item of data) {
			let params = [
				data['one'], 
				data['two'], 
				data['three'], 
				data['date'], 
				data['time'],
				data['one_bak'], 
				data['two_bak'], 
				data['three_bak'], 
				data['date_bak'],
				data['time_bak'],
				dict[data['lang']]
			]
			stmt.run(params);
			//}
			stmt.finalize();
		
		});


		db.close()
		res.json({answer: 200, description: 'Данные обновлены'})


	} catch (e) {
		console.error('Чё-то пошло не так! при обновлении выборочных данных. Описание ошибки ниже')
		console.error(e)
	}
})
router.post('/del', (req, res) => {
	try {
		const db = new sqlite.Database('db.sqlite3')
		const data = req.body
		console.log('Тут что надо удалить из бд: ', req.body)
		let sql = "delete from words where one=? and two=? and three=? and date=? and time=?"
		db.serialize(() => {
			const stmt = db.prepare(sql);
			for (let item of data) {
				let params = [item['one'], item['two'], item['three'], item['date'], item['time']]
				stmt.run(params);
			}
			stmt.finalize();
		
		});


		db.close()
		res.json({answer: 200})
	} catch (e) {
		console.error('Чё-то пошло не так!')
		res.json({answer: 404})
	}
})

router.post('/lang', (req, res) => {
	const checkLang = (text) => {
		// U+4E00 and U+9FFF
		for (let i=0;i<text.length;i++) {
			
			// let codeHex = '0'+text.charCodeAt(i).toString(16).toUpperCase()
			let codeHex = text.charCodeAt(i)
			codeHex = text[i] + " " + codeHex + ";"
			process.stdout.write(`${codeHex}`)
		}
	}

	try {
		let lang = req.body.lang
		console.log('это язык: ', req.body.lang)

		// console.log(path.resolve('Share', 'txt', '1.txt'))
		let txt
		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;


		sql = 'select one, two, three, date, time from words where dictionary_id=?';
		db.all(sql, [dict[lang]], (err, rows) => {
			try {
				if (err) {
					throw err;
				}
				
				console.log(rows)
				res.json(rows)

			} catch (e) {
				console.info('Сработал catch (при запросе к /get/lang (запрос словарей)) ошибка ниже')
				console.log(e);

			}
		});


			

		
		db.close();

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
router.get('/s', (req, res) => {
	let url = req.query.url
	console.log(url)
	let fine = false;


	try {
		//const url = 'https://www.youtube.com/watch?v=6xKWiCMKKJg'
		 
		// method #3
		/*
		const subprocess = youtubedl.exec(url, {
			// dumpSingleJson: true
			cacheDir: config.folders.videos,
			//progress: false,
			paths: config.folders.videos,
			writeAutoSub: true,
			writeSub: true,
			convertSubs: "srt",
			//output: process.cwd() + "/resources/subtitle",
			format: "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
		})
		  
		console.log(`Running subprocess as ${subprocess.pid}`)
		*/
		// console.log()
		
		//subprocess.stdout.pipe(fs.createWriteStream('stdout.txt'))
		// subprocess.stderr.pipe(fs.createWriteStream('stderr.txt'))
		
		// setTimeout(subprocess.cancel, 300)


		/*

		subprocess.stdout?.on("data", data => {
			try {
				const buffer = Buffer.from(data, "utf-8");
				//console.log(buffer)
				
				let output = buffer
					.toString()
					.trim()
					.split(" ")
					.filter(n => n);

				//console.log(output)

				let mess = {
					progress: parseFloat(output[1]),
					size: output[4],
					speed: output[6],
					estimated: output[8]
				};

				if (output[0] === "[download]" && parseFloat(output[1])) {
					req.wsServer.on('connection', ws => {
						
						ws.on('message', m => {
							try {
								//console.log('Загрузка завершена')
								console.log(m.toString())
								//console.log(typeof m)
								// let message = new Blob(['привет я с сервера'], {
								// 	type: 'text/plain'
								// })
	
		
	
								// setInterval(() => {
								wsServer.clients.forEach(client => client.send(mess))
								// }, 1000)
	
							} catch (err) {
								console.info('error: ошибка в колбаке вебсокета')
							}
	
						})
	
						ws.on("error", e => ws.send(e));
	
						ws.send(JSON.stringify(mess).toString());
	
					})









				}
			} catch (err) {
				console.log("parse error", err);
			}
		});


		*/

		// subprocess.addListener('message', (event) => {
		// 	console.log(event)
		// })

		// subprocess.addListener('spawn', (event) => {
		// 	console.log(event)
		// })


		// subprocess.on('message', (message) => {
		// 	console.log(message)
		// })


		/*
		req.wsServer.on('connection', ws => {
			ws.on('message', m => {
				try {
					console.log('Загрузка завершена')
					console.log(m.toString())
					console.log(typeof m)


				} catch (err) {
					console.info('error: ошибка в колбаке вебсокета')
				}

			})
			setInterval(() => {
				req.wsServer.clients.forEach(client => client.send("я тут 2"))
			}, 1000)
		})
		*/

		// method #2

		

		try {

			//console.log('check directory: ', fs.access(config.folders.videos))
			let path = config.folders.videos

			if (existsSync(path)) {
				console.log('Всё хорошо. продолжаю загрузку!')
			} else {
				console.log('Директория не найдена! Изменяю директорию!')
				path = 'Share/video2'

			}

			const promise = youtubedl(url, { 
				cacheDir: path,
				progress: true,
				paths: path
			}).then(info => {
				console.log('This output about it')
				console.log(info)
			}).catch(err => {
				console.log('Fucked error!')
				console.log(err)
			})


			const result = logger(promise, `Obtaining ${url}`, {
				estimate: 100000 // приблизительное время завершения
			}).then(info => {
				console.log('this is result logger: ', info)
				//console.log('this is webSocket: ', req.wsServer)
				res.json({ 'done': url })
				// req.wsServer.on('connection', ws => {
					// setInterval(() => {
						// req.wsServer.clients.forEach(client => client.send("я тут 2"))
					// }, 1000)
					// setInterval(() => {
						// ws.send({'done': url})
					// }, 1000)
					
				// })
			}).catch(err=> {
				console.log(err)
			}).finally(()=>{
				console.log('I\'m running anyway!')
			})
			
			console.log(result)




		} catch (err) {
			console.log(err, 'ошибка в методе 2')
		}

		



		// method #1
		/*
		const video = await youtubedl(url, {
			//noWarnings: true,
			// preferFreeFormats: true,

			cacheDir: config.folders.videos[req.query.partname],
			progress: true,
			paths: config.folders.videos[req.query.partname]
			// cwd: path.resolve('videos')
		}).then((output) => {
			console.log(output)
			console.log('тут ws: ', req.wsServer)

			try {
				req.wsServer.on('connection', ws => {
					ws.on('message', m => {
						try {
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

						} catch (err) {
							console.info('error: ошибка в колбаке вебсокета')
						}

					})

					ws.on("error", e => ws.send(e));

					ws.send('Загрузка твоего видео завершена');

				})
			} catch (err) {
				console.info('error: src/server/Controllers/get.mjs')
			}

			res.json({ 'done': url })

			// chdir(point1)
		});

		*/
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

			function convert(item) {
				return {
					name: item,
					info: fs.statSync(path.resolve(dir, item))
				}
			}

			fs.readdir(dir, (err, items) => {

                try {
                    if (err) console.log(err);
					for (let i=0;i<items.length;i++) items[i]=convert(items[i])
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
                        var fileStats = fs.statSync(`${dir}/${item}`)

                        if (['.jpg', '.png', 'jpeg'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
                            result.push({
                                name: item,
                                ctime: fileStats.ctime
                            })
                        }
                    }

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
			let page = parseInt(req.body.page, 10)
			let limit = parseInt(req.body.limit, 10)

			console.log('route: ', route)
			console.log('dir: ', dir)
			
			if (fs.existsSync(dir)) {
				console.log('Директория существует!')
				
			} else {
				console.log('Директория не найдена')
				dir = 'Share/video2'
			}
			/*
			fs.access(config.folders.videos, (error) => {
				if (error) {
					console.log('Директория не найдена')
					dir = 'Share/video2'
				} else {
					console.log('Всё хорошо!')
				}
			})
			*/

			//console.log(dir)

            fs.readdir(dir, (err, items) => {
                try {
                    if (err) { 
						console.log(err);
						
					}

                    let result = Array()
					let left = {};
					let right = {};
                    items.forEach(item => {
						try {
							const ext = path.parse(item).ext.toLowerCase()
							
							if (['.webm', '.avi', '.mp4', '.mkv'].indexOf(ext) > -1) {
								result.push({
									name: item
								})
								let name = item.split(/.webm|.avi|.mp4|.mkv/)[0]
								// console.warn(name + ext)
								left[name] = ext
							}

							if (ext == '.gif') {
								let name = item.split(/.gif/)[0]
								// console.warn('i\m home', name + ext)
								right[name] = ext
							}

						} catch (e) {
							console.log('Вот из-за этой ошибки крашится!')
							console.log(e)

						}

                    })


					let res_except = Object.keys(left).filter(function (x) {
						return Object.keys(right).indexOf(x) < 0;
					})

					console.info(`Новые видосы: `)
					console.info(`left: ${Object.keys(left).length}`)
					console.info(`right: ${Object.keys(right).length}`)
					for (let i=0; i<res_except.length; i++) {
						// res_except[i] = left[res_except[i]];
						// console.log()
						res_except[i] = {
							name: res_except[i]+left[res_except[i]]
						}
						console.info(res_except[i])
					}
					// console.warn(right);
					// console.error(left)

					let fromIndex = page * limit     // начальный индекс товара
					let toIndex = page*limit + limit // конечный индекс товара
					console.log(page*limit + limit)
					if (toIndex > result.length) {
						toIndex = result.length
					}
					
					let productsPage = (req.body.flag)? result : result.slice(fromIndex, toIndex)
					console.log(page, limit)
					console.log(`fromindex: ${fromIndex}`)
					console.log(`toIndex: ${toIndex}`)
					// return c.JSON(http.StatusOK, productsPage)
					console.log(productsPage)


                    res.json({ "items": productsPage, "route": route, "count_videos": result.length, "recent": res_except })
                
				} catch (e) {
                    console.log('Ошибка тут ошибка: ', e)
                    res.json({ "items": [], "route": route, "count_videos": 0 })

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
