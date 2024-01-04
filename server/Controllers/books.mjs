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


router.post('/g/words', (req, res) => {
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
		// if (date_from !== undefined) {
		// 	date_from = date_from.split('-')
		// 	date_from = date_from[2]+'.'+date_from[1]+'.'+date_from[0]
		// }

		let time_from = req.body.filter_mode.time_from

		let date_to = req.body.filter_mode.date_to
		// if (date_to !== undefined) {
		// 	date_to = date_to.split('-')
		// 	date_to = date_to[2]+'.'+date_to[1]+'.'+date_to[0]
		// }

		let time_to = req.body.filter_mode.time_to

		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;


		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		let params;


		db.serialize(() => {
			if (date_from == undefined && date_to ==undefined) {
				sql = 'select count(*) as l from words where language_id = ?;'
				params = [lang]
			} else if (date_from != undefined && date_to == undefined)  {
				sql = 'select count(*) as l from words where language_id = ? and date=?;'
				params = [lang, date_from]
			} else if (date_from != undefined && date_to != undefined) {
				sql = 'select count(*) as l from words where language_id = ? and date between ? and ?;'
				params = [lang, date_from, date_to]
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
					sql = `select * from words where language_id=? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					params = [lang, fromIndex, limit]

				} else if (date_from != undefined && date_to == undefined) {
					sql = `select * from words where language_id=? and date=? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					// console.info('выполнилось с одной датой')
					console.log('выполняется 2 сценарий')
					params = [lang, date_from, fromIndex, limit];
				
				} else if (date_from != undefined && date_to != undefined)  {
					console.info(req.body)
					sql = `select * from words where language_id=? and date between ? and ? order by ${column_name} ${order} limit ?, ?;`;
					// sql = 'select * from words;';
					// console.info('выполнилось с двумя датами')
					console.log('Выполняется 3 сценарий, 57964560;')
					params = [lang, date_from, date_to, fromIndex, limit]
					// params = []
					console.log(params)
					console.log(sql)

				
				}

			} else {
				if (date_from == undefined && date_to==undefined) {
					console.log('выполняется дефолтный сценарий*')
					sql = `select * from words where language_id=? order by date ${date_order}, time ${time_order} limit ?, ?;`
					params = [lang, fromIndex, limit]
				} else if (date_from != undefined && date_to == undefined) {
					sql = `select * from words where language_id=? and date=? order by date ${date_order}, time ${time_order} limit ?, ?;`;
					// console.info('выполнилось с одной датой')
					console.log('выполняется 2 сценарий*')
					params = [lang, date_from, fromIndex, limit];
				
				} else if (date_from != undefined && date_to != undefined) {
					sql = `select * from words where language_id=? and date between ? and ? order by ${column_name} ${order}, lower(${column_name}) limit ?, ?;`;
					// console.info('выполнилось с двумя датами')
					console.log('выполняется 3 сценарий*')
					params = [lang, date_from, date_to, fromIndex, limit]
				
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
router.post('/g/name-book', (req, res) => {
    const db = new sqlite.Database('db.sqlite3')

    // let dict = {}
    let sql = "SELECT * FROM languages"
	console.log('/g/name-book')
    //db.serialize(() => {
    db.all(sql, [], (err, rows) => {
        try {
            if (err) {
                throw err;
            }
            
            console.log(rows)
            // rows.forEach( row => {
            //     dict[row.code] = row.name
            // })

            res.json(rows)

        } catch (e) {
            console.info('Сработал catch (при запросе к /books/g/name-book) ошибка ниже')
            console.log(e);

        }
    });
    //console.log('Это выведется в терминале: ', dict)
    // console.log('Тутт: ', arr)


    //});


    db.close();

})
router.post('/c/word', (req, res) => {
    let recieved_data = (req.body)
    const db = new sqlite.Database('db.sqlite3')
    console.info('received data: ', recieved_data)

    // let dictionary_id;
    // switch (recieved_data['name_lang']) {
    //     case 'en':
    //         dictionary_id = 1;
    //         break;
    //     case 'jp':
    //         dictionary_id = 2;
    //         break;
    
    //     case 'ru':
    //         dictionary_id = 3;
    //         break;
    
    //     case 'kr':
    //         dictionary_id = 4;
    //         break;
    
    //     case 'cn':
    //         dictionary_id = 5;
    //         break;
    //     case 'de':
    //         dictionary_id = 6;
    //         break;
    //     default:
    //         break;
    // }

    try {


        if (true) {

            let sql = "insert into words ('language_id', 'one', 'two', 'three', 'date', 'time') VALUES (?, ?, ?, ?, ?, ?)"
            let params = [recieved_data['name_lang'], recieved_data['one'], recieved_data['two'], recieved_data['three'], recieved_data['date'], recieved_data['time']]
            db.serialize(() => {
                const stmt = db.prepare(sql);
                stmt.run(params);
                stmt.finalize();
            
            });
        }

        if (false) {
            let data = JSON.parse(fs.readFileSync(path.resolve('Share', 'txt', `${recieved_data['name_lang']}.json`), { encoding: 'utf-8' }))
            console.log(data)
            data[recieved_data['left']] = recieved_data['right']

            fs.writeFileSync(path.resolve('Share', 'txt', `${recieved_data['name_lang']}.json`), JSON.stringify(data), { encoding: 'utf-8' })
        }

        if (false) {
            const db = new sqlite.Database('db.sqlite3')
            db.serialize(() => {
                db.run("CREATE TABLE lorem (info TEXT)");
            
                const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
                for (let i = 0; i < 10; i++) {
                    stmt.run("Ipsum " + i);
                }
                stmt.finalize();
            
                db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
                    console.log(row.id + ": " + row.info);
                });
            });


            db.close();
        }
        
        db.close();

    } catch (error) {
        console.log(error)
        console.log('Нет файла для чтения')

    }


    // res.status(200).json({data: 9})
    res.json({dat2a: 92})
})
router.post('/g/all_words', (req, res) => {
	try {
		let lang = req.body.lang
		console.log(req.body)
		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;
		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		db.serialize(() => {
			sql = 'select id, one||" "||two||" "||three as word from words where language_id=?';

			db.all(sql, [lang], (err, rows) => {
				try {
					if (err) throw err;
					res.json(rows.map(item => [item['id'], item['word']]))
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /books/g/all_words (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();

	} catch (e) {
		console.error(e)
	}
})
router.post('/u/word', (req, res) => {
	try {
		const db = new sqlite.Database('db.sqlite3')
		const data = req.body // хранит обновляемый объект
		console.log('Тут что надо обновить в бд: ', req.body)
		let sql = "update words set one=?, two=?, three=?, date=?, time=? where one=? and two=? and three=? and date=? and time=? and language_id=?"
		
		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;
		
		
		
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
				data['lang']
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
router.post('/s/word', (req, res) => {
	try {
		let lang = req.body.lang
		let arr = req.body.arr

		console.log(req.body)
		
		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;
		let count;
		db.serialize(() => {

			let placeHolders = new Array(arr.length).fill('?').join(',');
			sql = `select * from words where language_id=? and id in (${placeHolders})`;

			db.all(sql, [lang, ...arr], (err, rows) => {
				try {
					if (err) throw err;
					res.json(rows)
	
				} catch (e) {
					console.info('Сработал catch (при запросе к /boo/s/word (запрос словарей)) ошибка ниже')
					console.log(e);
	
				}
			});


		})

		db.close();


	} catch (e) {
		console.log(e)
	}
})
router.delete('/d/word', (req, res) => {
	try {
		console.log('Выполняю /d/word')
		console.info(req.body)
		const db = new sqlite.Database('db.sqlite3')
		const bd = req.body.value
		const id = bd.id
		const one = bd.one
		const two = bd.two
		const three = bd.three
		const language_id = bd.language_id || bd.lang
		console.log(id, one, two, three, language_id)

		db.serialize(() => {
			let sql = 'delete from words where id=? or language_id=? and one=? and two=? and three=?;'
			let stmt = db.prepare(sql)
			let params = [id, language_id, one, two, three]
			stmt.run(params, (err) => {
				if (err) {
					console.error(err)
				
				} else {
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
router.post('/c/rule', (req, res) => {
	console.log('шафощуц щукоцщкцо уукцщоцущкш')
	try {
		console.log('Привет Здаров!')
		console.info(req.body)
		let name = req.body.name
		let description = req.body.description
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		// let dict = new Map();

		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		let language_id = lang

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
router.post('/c/phrase', (req, res) => {


	console.log('Добавка новой фразы')
	try {
		console.log('Привет Здаров! Здравствуйте:!!!')
		console.info(req.body)
		let input = req.body.input
		let output = req.body.output
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		// let dict = new Map();

		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		let language_id = lang

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
router.post('/g/phrase', (req, res) => {
	try {
		let lang = req.body.lang
		console.log('это язык: ', req.body.lang)

		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;

		sql = 'select one, three, time, date from phraseological_unit where language_id=?';
		db.all(sql, [lang], (err, rows) => {
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
router.post('/c/group', (req, res) => {
	console.log('Создание группы')
	try {
		console.log('Привет Здаров! я тут /set_group')
		console.info(req.body)
		let name = req.body.name
		let lang = req.body.lang
		let time = req.body.time
		let date = req.body.date
		// let dict = new Map();

		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		let language_id = lang

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
router.post('/g/group', (req, res) => {
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
router.post('/a/w/group', (req, res) => {
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
router.post('/g/rule', (req, res) => {
	try {
		let lang = req.body.lang
		console.log('это язык: ', req.body.lang)

		// let dict = new Map();
		// dict['en']=1;
		// dict['jp']=2;
		// dict['ru']=3;
		// dict['kr']=4;
		// dict['cn']=5;
		// dict['de']=6;

		const db = new sqlite.Database('db.sqlite3')
		let sql;

		sql = 'select one, three, time, date from grammar where language_id=?';
		db.all(sql, [lang], (err, rows) => {
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
router.post('/g/w/group', (req, res) => {
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
router.delete('/d/group', (req, res) => {
    try {
        console.log('/group', req.body)
        const id = req.body.id
        const name = req.body.name
        const time = req.body.time
        const date = req.body.date
        const code = req.body.lang


        const db = new sqlite.Database('db.sqlite3')
        let sql = 'delete from groups where id=? or name=? and time=? and date=? and language_id in (select id from languages l where code=?)'
        let params = [id, name, time, date, code]


        db.serialize(() => {
            console.log('Удаление данных (Удаляем группу):')
            const stmt = db.prepare(sql);
            stmt.run(params);
            stmt.finalize();
            res.json({result: 'success'})
        });

        db.close()



    } catch (e) {
        console.log('Error on deleting group words!')
        res.json({result: 'failed'})
        console.log(e)
    } finally {
        console.log('999')
    }






})
router.post('/g/collection', (req, res) => {
	try {
		const db = new sqlite.Database('db.sqlite3')
		console.info(req.body)
		db.serialize(()=>{
			try {
				let sql = `select date, count(date) as count from words
				where language_id = ? group by date;`

				db.all(sql, [req.body.lang], (err, rows) => {
					try {
						console.log(rows)
						res.json(rows)
					} catch (e) {
						console.log(err)
						console.log(e)
					}
				})
			} catch (e) {
				console.error('serialize:', e)
			}
		})
	} catch (e) {
		console.error('/g/collection:', e)

	}
})
router.post('/c/dictionary', (req, res) => {
	try {

		const db = new sqlite.Database('db.sqlite3')
		console.info(req.body)
		db.serialize(() => {
			try {
				let sql = `insert into languages (name) values (?);`

				db.run(sql, [req.body.name], (err) => {
					try {
						if (err) {
							console.log(err)
							res.json({answer: 'err'})
						}
						else res.json({answer: 'ok'})

					} catch (e) {
						console.log(err)
						console.log(e)
					}
				})
			} catch (e) {
				console.error('serialize:', e)
			}
		})
	} catch (e) {
		console.error('/g/collection:', e)

	}
})

router.post('/r/words', (req, res) => {
	try {
		const db = new sqlite.Database('db.sqlite3')
		let sql = `
			select * from (
				select one||" "||two||" "||three as res, language_id as lid from words where language_id=1 order by random() limit 1
				)
			UNION 
			select * from (
				select one||" "||two||" "||three as res, language_id as lid from words where language_id=2 order by random() limit 1
			)
			UNION 
			select * from (
				select one||" "||two||" "||three as res, language_id as lid from words where language_id=3 order by random() limit 1
			)
			UNION 
			select * from (
				select one||" "||two||" "||three as res, language_id as lid from words where language_id=4 order by random() limit 1
			)
			UNION 
			select * from (
				select one||" "||two||" "||three as res, language_id as lid from words where language_id=5 order by random() limit 1
			);
		`;
		let stmt = db.prepare(sql, err => console.log(err))
		let res_a = new Map();
		stmt.all([], (err, row) => {
			try {
				if (err) console.log('stmt.get: ', err)
				row.forEach(item => {
					res_a[item['lid']] = item['res']
				})
				console.log(res_a);
				res.json(res_a)
			} catch (e) {
				console.info(e)
			}

		})
		stmt.finalize((err) => console.error('stmt.finalize(/r/words): ', err))


	} catch (e) {
		console.log(e)

	}
})
export default router
