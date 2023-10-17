import express from 'express'; // web-сервер
import path, { resolve } from 'path'; // Разрешение путей
import fs, { existsSync } from 'fs' // доступ к файлам
const router = express.Router();
import { v4 } from 'uuid'
import Iconv from 'iconv'
import youtubedl from 'youtube-dl-exec' // Загрузка видео
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import progress_estimator from 'progress-estimator'
const logger = progress_estimator()
import os from 'os';
//import { chdir } from 'process';
import config from '../configs/config.mjs'; // Настройки проекта
import { WebSocketServer } from 'ws' // websocket
//import { execa } from 'execa';
import redis from 'redis' // драйвер для подключения к NoSql
import user_agent from '../configs/user_agent.mjs'; // файковый юзерагент
import { load } from 'cheerio'; // парсинг 
import axios from 'axios'; // загрузка страниц
// import utils from 'util'
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



router.post('/', (req, res) => {
	try {

		console.log('Дополнительная информация с клиента: ', req.body.body)
		let command = '';
		console.log("body.name: ", JSON.parse(req.body.body).name)
		switch (JSON.parse(req.body.body).name) {
			case 'off':
				command = 'sudo poweroff';
				break;
			case 'reboot':
				command = 'sudo reboot';
				break;
			case 'redis':
				command = 'docker run -d -p 6379:6379 -v $PWD/data:/data --name redis redis:latest redis-server --appendonly yes --requirepass "123"'
				break;
			case 'mongo':
				command = 'docker run -d -p 6379:6379 -v $PWD/data:/data --name redis redis:latest redis-server --appendonly yes --requirepass "123"'
				break;
			case 'clr_all':
				command = ''
			default:
				break;
		}
		console.log(`Running following command: ${command}`)

        exec(command, (error, stdout, stderr) => {
            try {
				if (error) {
					console.log(`Произошла ошибка: ${error}`)
				} else {
					console.log(`Выполненеие запроса: ${stdout}`)
					res.json({'answer': stdout })
				}

			}
			catch {
				console.log('Ошибка при выполнении команды в колбэке')
			}


        })
        
        // }
		// fs.readFile(req.body.p, { encoding: 'utf-8' }, function (err, data) {
		// 	if (!err) {
		// 		console.log('received data: ' + data);
		// 		// res.writeHead(200, {'Content-Type': 'application/json'});
		// 		// res.write(data);
		// 		// res.end();
		// 		res.json({ p: data })
		// 	} else {
		// 		console.log(err);
		// 	}
		// });
	} catch (e) {
		console.log(e);
	}
})






export default router


