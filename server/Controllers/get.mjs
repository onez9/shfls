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
	// const checkLang = (text) => {
	// 	// U+4E00 and U+9FFF
	// 	for (let i=0;i<text.length;i++) {
			
	// 		// let codeHex = '0'+text.charCodeAt(i).toString(16).toUpperCase()
	// 		let codeHex = text.charCodeAt(i)
	// 		codeHex = text[i] + " " + codeHex + ";"
	// 		process.stdout.write(`${codeHex}`)
	// 	}
	// }

	try {
		// console.log(req.body) 
		let lang = req.body.lang
		let page = parseInt(req.body.page, 10)
		let limit = parseInt(req.body.limit, 10)
		let column_name = req.body.sort_mode.name
		let order = (req.body.sort_mode.order? 'asc' : 'desc')
		let date_order = (req.body.sort_mode.date_order? 'asc' : 'desc')
		let time_order = (req.body.sort_mode.time_order? 'asc' : 'desc')
		let m2 = req.body.sort_mode.m2

		let date_from = req.body.filter_mode.date_from
		if (date_from !== undefined) {
			date_from = date_from.split('-')
			date_from = date_from[2]+'.'+date_from[1]+'.'+date_from[0]
		}

		let time_from = req.body.filter_mode.time_from

		let date_to = req.body.filter_mode.date_to
		if (date_to !== undefined) {
			date_to = date_to.split('-')
			date_to = date_to[2]+'.'+date_to[1]+'.'+date_to[0]
		}

		let time_to = req.body.filter_mode.time_to

		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;


		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		let params;


		db.serialize(() => {
			if (date_from == undefined && date_to ==undefined) {
				sql = 'select count(*) as l from words where dictionary_id = ?;'
				params = [dict[lang]]
			} else if (date_from != undefined && date_to == undefined)  {
				sql = 'select count(*) as l from words where dictionary_id = ? and date=?;'
				params = [dict[lang], date_from]
			} else if (date_from != undefined && date_to != undefined) {
				sql = 'select count(*) as l from words where dictionary_id = ? and date between ? and ?;'
				params = [dict[lang], date_from, date_to]
			}

			let stmt = db.prepare(sql, err => console.log(err))
			stmt.get(params, (err, row) => {
				try {
					if (err) console.log('stmt.get: ', err)
					count = row.l;
					console.log(`count: ${count}`);
				} catch (e) {
					console.info(e)
				}

			})
			stmt.finalize((err) => console.error('stmt.finalize: ', err))


			let fromIndex = page * limit     
			let toIndex = page * limit + limit 

			// console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`)
			if (toIndex > count) toIndex = count

			if (!m2) {
				if (date_from == undefined && date_to==undefined) {
					console.log('выполняется дефолтный сценарий')
					sql = `select * from words where dictionary_id=? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					params = [dict[lang], fromIndex, limit]

				} else if (date_from != undefined && date_to == undefined) {
					sql = `select * from words where dictionary_id=? and date=? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					// console.info('выполнилось с одной датой')
					console.log('выполняется 2 сценарий')
					params = [dict[lang], date_from, fromIndex, limit];
				
				} else if (date_from != undefined && date_to != undefined)  {
					console.info(req.body)
					sql = `select * from words where dictionary_id=? and date between ? and ? order by ${column_name} ${order} limit ?, ?;`;
					// sql = 'select * from words;';
					// console.info('выполнилось с двумя датами')
					console.log('Выполняется 3 сценарий, 57964560;')
					params = [dict[lang], date_from, date_to, fromIndex, limit]
					// params = []
					console.log(params)
					console.log(sql)

				
				}

			} else {
				if (date_from == undefined && date_to==undefined) {
					console.log('выполняется дефолтный сценарий*')
					sql = `select * from words where dictionary_id=? order by date ${date_order}, time ${time_order} limit ?, ?;`
					params = [dict[lang], fromIndex, limit]
				} else if (date_from != undefined && date_to == undefined) {
					sql = `select * from words where dictionary_id=? and date=? order by date ${date_order}, time ${time_order} limit ?, ?;`;
					// console.info('выполнилось с одной датой')
					console.log('выполняется 2 сценарий*')
					params = [dict[lang], date_from, fromIndex, limit];
				
				} else if (date_from != undefined && date_to != undefined) {
					sql = `select * from words where dictionary_id=? and date between ? and ? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					// console.info('выполнилось с двумя датами')
					console.log('выполняется 3 сценарий*')
					params = [dict[lang], date_from, date_to, fromIndex, limit]
				
				}



			} 








			// console.log(params)

			// console.info('sql: ', sql)
			// console.info('params: ', params)

			let stmt1 = db.prepare(sql, err => {
				console.error('db.prepare: ', err)
			})
			stmt1.all(params, (err, rows) => {
				// console.info('количество: ', count, 'код страны: ', dict[lang], params, sql)
				console.info('sql: ', sql)
				console.info('params: ', params)
				// console.log(err)
				try {
					if (err) {
						console.log('stmt1.all: ', err)
						// throw err;
					}
					
					// console.log(rows)
					res.json({
						body123: rows,
						count123: count,
					})
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /get/lang (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});
			stmt1.finalize((err) => {
				console.error('stmt1.finalize: ', err)
			})


		})

		db.close(err => {
			console.error('db.close: ', err)
		});



	} catch (e) {
		console.log(e)
	}
})
router.post('/glw', (req, res) => {
	try {
		let lang = req.body.lang
		console.log(req.body)
		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;
		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		db.serialize(() => {
			sql = 'select id, one||" "||two||" "||three as word from words where dictionary_id=?';

			db.all(sql, [dict[lang]], (err, rows) => {
				try {
					if (err) throw err;
					res.json(rows.map(item => [item['id'], item['word']]))
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /get/glw (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();

	} catch (e) {
		console.error(e)
	}
})
router.post('/add_rule', (req, res) => {
	console.log('шафощуц щукоцщкцо уукцщоцущкш')
	try {
		console.log('Привет Здаров!')
		console.info(req.body)
		let name = req.body.name
		let description = req.body.description
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		let dict = new Map();

		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		let language_id = dict[lang]

        if (true) {
			const db = new sqlite.Database('db.sqlite3')
            let sql = "insert into grammar ('language_id', 'one', 'three', 'date', 'time') VALUES (?, ?, ?, ?, ?);"
            let params = [language_id, name, description, date, time]
            db.serialize(() => {
				console.log('Идёт запись данных:')
                const stmt = db.prepare(sql);
                stmt.run(params);
                stmt.finalize();
            
            });
			db.close()
			res.json({answer: 'success'})
		} else {
			res.json({answer: 'failed проводится тестирование'})
		}

	} catch (e) {
		console.error('Произошла предвиденная ошибка (её описание ниже): ')
		console.log(e)
	}
})
router.post('/add_phrase', (req, res) => {


	console.log('Добавка новой фразы')
	try {
		console.log('Привет Здаров! Здравствуйте:!!!')
		console.info(req.body)
		let input = req.body.input
		let output = req.body.output
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		let dict = new Map();

		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		let language_id = dict[lang]

        if (true) {
			const db = new sqlite.Database('db.sqlite3')
            let sql = "insert into phraseological_unit ('language_id', 'one', 'three', 'date', 'time') VALUES (?, ?, ?, ?, ?);"
            let params = [language_id, input, output, date, time]
            db.serialize(() => {
				console.log('Идёт запись данных в фразеологизмы:')
                const stmt = db.prepare(sql);
                stmt.run(params);
                stmt.finalize();
            
            });
			db.close()
			res.json({answer: 'success'})
		} else {
			res.json({answer: 'failed'})
		}

	} catch (e) {
		console.error('Произошла предвиденная ошибка (её описание ниже): ')
		console.log(e)
	}
})
router.post('/phrase', (req, res) => {
	try {
		let lang = req.body.lang
		console.log('это язык: ', req.body.lang)

		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;

		sql = 'select one, three, time, date from phraseological_unit where language_id=?';
		db.all(sql, [dict[lang]], (err, rows) => {
			try {
				if (err) {
					throw err;
				}
				
				console.log(rows)
				res.json(rows)

			} catch (e) {
				console.info('Сработал catch (при запросе к /get/phrase (запрос словарей)) ошибка ниже')
				console.log(e);

			}
		});


			

		
		db.close();

	} catch (e) {
		console.log(e)
	}
})
router.post('/set_group', (req, res) => {
	console.log('Создание группы')
	try {
		console.log('Привет Здаров! я тут /set_group')
		console.info(req.body)
		let name = req.body.name
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		let dict = new Map();

		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		let language_id = dict[lang]

        if (true) {
			const db = new sqlite.Database('db.sqlite3')
            let sql = "insert into groups ('language_id', 'name', 'date', 'time') VALUES (?, ?, ?, ?);"
            let params = [language_id, name, date, time]
            db.serialize(() => {
				console.log('Идёт запись данных (Создание группы):')
                const stmt = db.prepare(sql);
                stmt.run(params);
                stmt.finalize();
            
            });
			db.close()
			res.json({answer: 'success'})
		} else {
			res.json({answer: 'failed проводится тестирование'})
		}

	} catch (e) {
		console.error('Произошла предвиденная ошибка (её описание ниже): ')
		console.log(e)
	}
})
router.post('/get_groups', (req, res) => {
	//console.log('Создание группы')
	try {
		//console.log('Привет Здаров! я тут /get_group')
		//console.info(req.body)
		// let name = req.body.name
		let lang = req.body.lang
		// let time = req.body.time
		// let date = req.body.date
		let dict = new Map();

		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		let language_id = dict[lang]
		//console.info('lang:', language_id)
        if (true) {


			const db = new sqlite.Database('db.sqlite3')
			let sql = 'select id, name from groups where language_id=?';
			db.all(sql, [language_id], (err, rows) => {
				try {
					if (err) {
						throw err;
					}
					
					console.log(rows)
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /get/phrase (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});
	



			db.close()
			//res.json({answer: 'success'})
		} else {
			res.json({answer: 'failed проводится тестирование'})
		}

	} catch (e) {
		console.error('Произошла предвиденная ошибка (её описание ниже): ')
		console.log(e)
	}
})
router.post('/add_to_group', (req, res) => {
	console.log('Создание группы')
	try {
		console.log('Привет Здаров! я тут /add_to_group')
		// console.info(req.body)

		let group_id = Number(req.body.group_id)
		let items = req.body.items
		// let dict = new Map();

		console.info('items', items)
		console.info('group_id', group_id)
		

        if (true) {
			const db = new sqlite.Database('db.sqlite3')
			//let sql = 'select id from words where language_id=?';
			/*
			db.all(sql, [dict[lang]], (err, rows) => {
				try {
					if (err) {
						throw err;
					}
					
					console.log(rows)
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /get/phrase (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});
			*/

            let sql = "insert into gw ('word_id', 'group_id') VALUES (?, ?);"


            db.serialize(() => {
				try {
					let params;
					const stmt = db.prepare(sql);
					for (const word_id of items) {
						params = [word_id, group_id]

						stmt.run(params);

						// console.info(word_id)
					}

					console.log('Идёт запись данных (Создание группы):')
					stmt.finalize();

				} catch (e) {
					console.log(e)

				}
            
            });


			db.close()
			res.json({answer: 'success'})


		} else {
			res.json({answer: 'failed проводится тестирование'})
		}

	} catch (e) {
		console.error('Произошла предвиденная ошибка (её описание ниже): ')
		console.log(e)
	}
})
router.post('/rule', (req, res) => {
	try {
		let lang = req.body.lang
		console.log('это язык: ', req.body.lang)

		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;

		sql = 'select one, three, time, date from grammar where language_id=?';
		db.all(sql, [dict[lang]], (err, rows) => {
			try {
				if (err) {
					throw err;
				}
				
				console.log(rows)
				res.json(rows)

			} catch (e) {
				console.info('Сработал catch (при запросе к /get/phrase (запрос словарей)) ошибка ниже')
				console.log(e);

			}
		});


			

		
		db.close();

	} catch (e) {
		console.log(e)
	}
})
router.post('/from_group', (req, res) => {
	try {
		const group_id = req.body.group_id


		console.info('Текущий номер группы точнее айди% ', group_id)
		const db = new sqlite.Database('db.sqlite3')
		let sql;

		sql = 'select * from words right join gw on words.id=gw.word_id left join groups on groups.id=gw.group_id where groups.id=?;';
		db.all(sql, [group_id], (err, rows) => {
			try {
				if (err) {
					throw err;
				}
				
				console.log(rows)
				res.json(rows)

			} catch (e) {
				console.info('Сработал catch (при запросе к /get/from_group) ошибка ниже')
				console.log(e);

			} finally {
				console.info('Я тут тут тут')
			}
		});


			

		
		db.close();


	} catch (e) {
		console.log('/from_group')
		console.error(e)

	} finally {
		console.info('I\'m running eneway')
	}
})
router.get('/s', (req, res) => { // тут загрузка видео через ytb-dl и тут ещё redis тестирую
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
router.post('/create_account', (req, res) => {
	// res.redirect(301, '/g/chat')
	// res.send('<p>Ты умничка</p>')
	// res.redirect('http://192.168.1.103/g/login')


	
	try {
		console.info(req.body)
		let login = req.body.login
		let email = req.body.email
		let phone = req.body.phone
		let age = Number(req.body.age)
		let password = req.body.password

        if (true) {
			const db = new sqlite.Database('db.sqlite3')

        
            db.serialize(() => {
				try {
					let params;
					let sql = "insert into users ('login', 'email', 'phone', 'age', 'password') VALUES (?, ?, ?, ?, ?);"
					let stmt = db.prepare(sql);
					params = [login, email, phone, age, password]
					
					stmt.run(params, (err) => {
						// console.log('this is callback')
						if (err) {
							console.log(err.errno)
							console.log(err.code)
						}
						// res.status(404)
					});
					stmt.finalize()
					
					sql = `SELECT * FROM users WHERE email = ?`
					stmt = db.prepare(sql)


					console.info('email: ', req.body.email)
					stmt.get([req.body.email], (err, rows) => {
						console.info(rows)
						if (err) return res.status(500).send({
							error: err,
							name: 'vertul'
						})
						
						let token = jwt.sign({ id: rows.id }, config.wlan0.secret, { expiresIn: 86400 });
						req.session.token = token


					})

					res.json({answer: 'success'})
					stmt.finalize()
					//res.redirect('/g/login')
					db.close()

					console.log('Идёт запись данных (Создание аккаунта):')

	
				} catch (e) {
					console.error(e);
					res.json({answer: 'error'})

				} finally {
					console.log('finally worked')
				}
            
            });

			

			


		}



	} catch (e) {
		console.error(e)
	}
	


})
router.post('/login', (req, res) => {
	console.log('Запуск авторизации')
	let db = new sqlite.Database('db.sqlite3', (err) => {
	  console.log(err)
	})
  
  
	db.get(`SELECT * FROM users WHERE login = ? or email = ? or phone = ?`, [req.body.login, req.body.login, req.body.login], (err, user) => {
		console.log('вот это у нас юзер: ', user)
		if (err) return res.status(500).send('Ошибка на сервере.');
		
		if (!user) return res.status(404).send('Пользователь не найден.');
	
		console.log(req.body.password)
		console.log(user.password)
  
		//   let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		let passwordIsValid = (req.body.password == user.password)
	  	// если провал шлем это
	  	if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
	  
		  // иначе отправляем токен
		let token = jwt.sign({ id: user.id }, config.wlan0.secret, { expiresIn: 86400 });
		req.session.token = token
		req.session.user_id = user.id
		req.session.email = user.email
		console.log('token: ', token)
		console.log('то что получили из БД: ', user)
		req.session.save()
		// res.status(200).send({ auth: true, token: token, user: user });
		res.send({ auth: true, token: token, user: user });
		// res.redirect('http://localhost:5173/')
	})
})
router.post('/log1', (req,res) => {
	console.log('Вы нажали на кнопку выхода!')
	// if (!req.body) res.sendStatus(500);
	// req.session.destroy();
	res.json({ok: true})
	//res.redirect('/login');
});
router.post('/search_by_id', (req, res) => {
	try {
		let lang = req.body.lang
		let arr = req.body.arr

		console.log(req.body)
		
		let dict = new Map();
		dict['en']=1;
		dict['jp']=2;
		dict['ru']=3;
		dict['kr']=4;
		dict['cn']=5;
		dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		db.serialize(() => {

			let placeHolders = new Array(arr.length).fill('?').join(',');
			sql = `select * from words where dictionary_id=? and id in (${placeHolders})`;

			db.all(sql, [dict[lang], ...arr], (err, rows) => {
				try {
					if (err) throw err;
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /get/glw (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();










	} catch (e) {
		console.log(e)
	}
})
router.post('/write_cash', (req, res) => {
	try {
		console.log('req.session.user_id: ', req.session.user_id)
		console.info('body: ', req.body)
		const db = new sqlite.Database('db.sqlite3')

		let sql = 'insert into record_local_storage (user_id, cash) values (?, ?);'

		let stmt = db.prepare(sql)

		stmt.run([6, req.body])
		stmt.finalize()


		// db.close()
	} catch (e) {
		console.error(e)
	}
})
router.delete('/del_value', (req, res) => {
	try {
		console.info(req.body)
		const db = new sqlite.Database('db.sqlite3')
		const bd = req.body.value
		const id = bd.id
		const one = bd.one
		const two = bd.two
		const three = bd.three
		const dictionary_id = bd.dictionary_id
		console.log(id, one, two, three, dictionary_id)

		db.serialize(() => {
			let sql = 'delete from words where id=? or dictionary_id=? and one=? and two=? and three=?;'
			let stmt = db.prepare(sql)
			let params = [id, dictionary_id, one, two, three]
			stmt.run(params, (err) => {
				if (err) console.error(err)
				else {
					res.json({answer: 'success'})
				}
			})

			stmt.finalize()
		})

		db.close()

	} catch (e) {
		console.error(e)
	}
})
router.post('/date', (req, res) => {
	try{
		console.log(req.body)
		let lang = req.body.lang
		let date = req.body.date.split('-')
		date = date[2]+'.'+date[1]+'.'+date[0]

		
		let dict = {
			en: 1,
			jp: 2,
			ru: 3,
			kr: 4,
			cn: 5,
			de: 6
		}

		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		db.serialize(() => {

			// let placeHolders = new Array(arr.length).fill('?').join(',');
			sql = `select * from words where dictionary_id=? and date=?;`;

			db.all(sql, [dict[lang], date], (err, rows) => {
				try {
					if (err) throw err;
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /g/date (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();

	}catch(e){
		console.error(e)
	}
})
router.post('/period', (req, res) => {
	try{
		console.log(req.body)
		let lang = req.body.lang

		let date_from = req.body.date_from
		if (date_from !== undefined) {
			date_from = date_from.split('-')
			date_from = date_from[2]+'.'+date_from[1]+'.'+date_from[0]
		}

		let time_from = req.body.time_from

		let date_to = req.body.date_to
		if (date_to !== undefined) {
			date_to = date_to.split('-')
			date_to = date_to[2]+'.'+date_to[1]+'.'+date_to[0]
		}

		let time_to = req.body.time_to

		// date = time[2]+'.'+time[1]+'.'+time[0]
		// console.info(req)
		
		let dict = {
			en: 1,
			jp: 2,
			ru: 3,
			kr: 4,
			cn: 5,
			de: 6
		}

		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		let params;

		db.serialize(() => {

			// let placeHolders = new Array(arr.length).fill('?').join(',');
			if (date_to == undefined) {
				sql = `select * from words where dictionary_id=? and date=?;`;
				console.info('выполнилось с одной датой')
				params = [dict[lang], date_from];
			} else {
				sql = `select * from words where dictionary_id=? and date between ? and ?;`;
				console.info('выполнилось с двумя датами')
				params = [dict[lang], date_from, date_to]
			}

			console.log(params)
			db.all(sql, params, (err, rows) => {
				try {
					if (err) throw err;
					// console.log(rows)
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /g/date (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();

	}catch(e){
		console.error(e)
	}
})



export default router
