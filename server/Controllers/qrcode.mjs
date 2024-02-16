import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
import { v4 } from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import qrcode from 'qrcode'
import config from '../configs/config.mjs';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




router.get('/', async (req, res) => {

    // `server/Pictures/${v4()}${path.parse(req.files.file.name).ext}`
    try {
        let data = {
            url: `http://${config.wlan0.host4}:${config.wlan0.port}`
        }

        let stringdata = JSON.stringify(data)

        // term
        qrcode.toString(JSON.parse(stringdata).url, { type: 'terminal' }, function (err, qr) {
            if (err) return console.log('error occured!')
            else console.log(qr)
        })

        // canvas
        // qrcode.toCanvas(canvas, JSON.parse(stringdata), function (error) {
        //     if (error) console.error(error)
        //     console.log('success!');
        // })
        const options = {
            root: path.resolve(config.folders.files),
            headers: { 'Content-Type': 'image/jpeg' }
        }

        qrcode.toFile(
            path.resolve(config.folders.files, 'qrcode.png'),
            // [{ data: Buffer.from([253,254,255]), mode: 'byte' }],
            [{ data: JSON.parse(stringdata).url, mode: 'byte' }],
            { width: 512 },
            (err) => {
                if (err) throw err
                console.log('Картинка создана')
                res.sendFile('qrcode.png', options, (err) => {
                    if (err) console.log(err)
                    else console.log('Ура рабоет')
                })
                //res.send(path.resolve('files', 'qrcode.png'))
            }
        )
    } catch (e) {
        console.log(e);
        console.log('Ошибка в модуле с qr-code')
    }

})


export default router
