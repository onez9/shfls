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
// import { ConsoleLogEntry } from 'selenium-webdriver/bidi/logEntries';


router.post('/set_image', (req,res)=>{
	console.log('Welcome to /u/set_image')
	console.log(req.files.file)
	console.log(req.body.login)
	console.log(req.body.email)
	// console.info(req.body)
	let path_to_save=`${config.folders.files}/${req.files.file.name}`
	let route_to_image=`${config.routes.files}/${req.files.file.name}`
	let login=req.body.login
	let email=req.body.email
	req.files.file.mv(path_to_save)

	try{
		const db=new sqlite.Database('db.sqlite3')

		db.serialize(()=>{
			try{
				let sql = "update users set pictures=? where login=?;"
				let stmt = db.prepare(sql);
				let params = [route_to_image, login]
				stmt.run(params, (err)=>{
					console.log(err)
				})
				stmt.finalize()
			}catch(e){
				console.error(e)
			}
		})
		res.json(route_to_image)
	}catch(e1){
		console.error(e1)
	}
})

router.post('/get_image_name', (req, res)=> {
	console.log('Welcome to /u/get_image')
	let login=req.body.login
	let email=req.body.email
	const db=new sqlite.Database('db.sqlite3')
	try{
		db.serialize(()=>{
			try{
				let sql="select pictures as name from users where login=?"
				let stmt=db.prepare(sql, (err)=>{
					console.log(err)
				})
				let params=[login]
				stmt.get(params, (err, row)=>{
					if(err)console.log(err)
					res.json(row)
				})
				stmt.finalize()

			}catch(e){
				console.error(e)
			}
		})
		db.close()
	}catch(e){
		console.error(e)
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
  
	let sql = `SELECT * FROM users WHERE login = ? or email = ? or phone = ?`;
	let params = [req.body.login, req.body.login, req.body.login]
	db.get(sql, params, (err, user) => {
		if (err) return res.status(500).send('Ошибка на сервере.');
		
		if (!user) return res.status(404).send('Пользователь не найден.');
	
		console.log(req.body.password)
		console.log(user.password)
  
		//   let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		let passwordIsValid = (req.body.password == user.password)
	  	// если провал шлем это
	  	if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
	  
		  // иначе отправляем токен
		let token = jwt.sign({ id: user.id }, config.wlan0.secret, { expiresIn: '7d' });
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


export default router;
