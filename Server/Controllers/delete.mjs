import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
import { v4 } from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from '../../Configs/config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




router.delete('/', (req, res) => {
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
        console.log(filename)
        let del_path = path.resolve(config.folders.files, filename)

        console.log('dle;,', del_path)
        fs.unlink(del_path, err => {
            if (err) console.log(err)
            else console.log('nice')
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


export default router;