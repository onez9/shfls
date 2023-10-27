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
import jwt from 'jsonwebtoken'
import { unescape } from 'querystring';



router.delete('/d/file', (req, res) => {
    try {
        // console.log(__dirname)
        // console.log(req.query.name)
        let filename = req.query.name
        // let filename = req.body.name
        // console.log(filename)
        // const options = {
        //     root: path.resolve(config.folders.files),
        //     headers: {'Content-Type': 'image/jpeg'}
        // }
        console.log(`filename: ${filename}`)
        let del_path = path.resolve(config.folders.files, filename)

        console.log('Патч удаленного файла: ', del_path)
        fs.unlink(del_path, err => {
            if (err) {
                console.log(err)
                res.json({result: 'fail'})
            } else { 
                console.log('файл удалён')
                res.json({result: 'success'})
            }
        })
        // res.sendFile(filename, options, function(err){
        //     if (err) console.log(err)
        //     else {
        //         console.log(filename)
        //     }
        // })
        // res.send(path.resolve('files', filename))
        // res.download(path.resolve(config.folders.files, filename))
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

// тут запросы для различных типов файлов
router.post('/g', async (req, res) => {
	
	// console.log('Music: ', req.headers)
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
                    //console.log(items)
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
									name: item,
									info: fs.statSync(path.resolve(dir, item))
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

					//console.info(`Новые видосы: `)
					//console.info(`left: ${Object.keys(left).length}`)
					//console.info(`right: ${Object.keys(right).length}`)
					for (let i=0; i<res_except.length; i++) {
						// res_except[i] = left[res_except[i]];
						// console.log()
						res_except[i] = {
							name: res_except[i]+left[res_except[i]]
						}
						//console.info(res_except[i])
					}
					// console.warn(right);
					// console.error(left)

					let fromIndex = page * limit     // начальный индекс 
					let toIndex = page * limit + limit // конечный индекс 
					//console.log(page*limit + limit)
					if (toIndex > result.length) {
						toIndex = result.length
					}
					
					let productsPage = (req.body.flag)? result : result.slice(fromIndex, toIndex)
					//console.log(page, limit)
					//console.log(`fromindex: ${fromIndex}`)
					//console.log(`toIndex: ${toIndex}`)
					// return c.JSON(http.StatusOK, productsPage)
					//console.log(productsPage)


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
			// console.log('Music: ', req.headers)
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

// показ видео через разбитие на маленькие кусочки
router.get('/g', (req, res) => {
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



router.post('/u/files', (req, res) => {
    try {
        console.log('this is ', req.files.file)
        let list_files = req.files.file
        console.log(typeof list_files)
        if (Array.isArray(list_files)) {
            for (const file of list_files) {
                file.mv(`${config.folders.files}/${file.name}`)
            }
        } else {
            console.log(req.files.file)
            req.files.file.mv(`${config.folders.files}/${req.files.file.name}`)
            
        }

        let message = 'Файлы успешно загружен'
        res.json({'message': message})
    }
    catch (e) {
        console.log(e)


        let error_message = 'Файл не найден'
        console.log(error_message)
        res.json({'message': error_message})
    }








})


router.get('/download/video', (req, res) => { // тут загрузка видео через ytb-dl и тут ещё redis тестирую
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



export default router;