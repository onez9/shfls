import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
import { v4 } from 'uuid'
import Iconv from 'iconv'
import youtubedl from 'youtube-dl-exec'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from 'progress-estimator'
import { chdir } from 'process';
import config from '../config.mjs';
import { WebSocketServer } from 'ws'
import {execa} from 'execa';


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



router.get('/', async (req, res) => {
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
})




router.get('/s', async (req, res) => {
	let url = req.query.url
	
	console.log(url)
	// const subprocess = youtubedl.exec(url, {
	//   dumpSingleJson: true,

	// })
	// let point1 = __dirname, point2 = path.resolve(config.folders.videos)
	// chdir(point2)
	// subprocess.stdout.pipe(fs.createWriteStream('/videos/stdout.mp4'))
	// subprocess.stderr.pipe(fs.createWriteStream('/videos/stderr.txt'))

	// setTimeout(subprocess.cancel, 30000)
	const video = await youtubedl(url, {
		//noWarnings: true,
		// preferFreeFormats: true,
		cacheDir: path.resolve('videos'),
		progress: true,
		paths: path.resolve('videos')
		// cwd: path.resolve('videos')
	}).then((output) => {
		// console.log(output)
		console.log('тут ws: ', req.wsServer)

		
		req.wsServer.on('connection', ws => {
			ws.on('message', m => {
				console.log('Загрузка завершена успешно поздравляю')
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
		res.json({'wait': false})

		// chdir(point1)
	});



	// const promise = youtubedl(url, { dumpSingleJson: true })
	// const result = await logger(promise, `Obtaining ${url}`)

	// console.log(result)

})


router.post('/', async (req, res) => {

	console.log(req.body.type)
	if (req.body.type == 'file') {
		fs.readdir(config.folders.files, (err, items) => {
			if (err) console.log(err);
			console.log(items)
			res.json({"items": items, "route": config.routes.files})
		})
	}
	else if (req.body.type == 'image') {
		fs.readdir(config.folders.images, (err, items) => {
			if (err) console.log(err);
			let result = Array()
			items.forEach(item => {
				if (['.jpg', '.png', 'jpeg'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
					result.push(item)
				}
			})
			res.json({"items": result, "route": config.routes.images})
		})
	}
	else if (req.body.type == 'video') {
		fs.readdir(config.folders.videos, (err, items) => {
			if (err) console.log(err);
			let result = Array()
			items.forEach(item => {
				if (['.webm', '.avi', '.mp4'].indexOf(path.parse(item).ext.toLowerCase()) > -1) {
					result.push(item)
				}
			})
			res.json({"items": result, "route": config.routes.videos})
		})
	}
	else if (req.body.type == 'music') {
		fs.readdir(config.folders.musics, (err, items) => {
			if (err) console.log(err);
			let result = Array()
			items.forEach(item => {
				if (['.WAV', '.MP3', '.FLAC', '.AAC', '.AIFF', '.OGG', '.MQA', '.MKV'].indexOf(path.parse(item).ext.toUpperCase()) > -1) {
					result.push(item)
				}
			})
			res.json({"items": result, "route": config.routes.musics})
		})
	}

})




export default router