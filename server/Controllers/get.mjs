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


/*
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
*/



export default router
