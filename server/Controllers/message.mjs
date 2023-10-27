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



router.post('/g', async (req, res) => {

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
			res.json([{ 'name': 'Server', 'message': 'Сообщения не сохраняются в этом режиме!', 'time': new Date() }])
		} else {
			throw e;
		}
	}
	// res.json(result)



})


export default router;

