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




router.get('/', (req, res) => {

    try {
        // console.log(__dirname)
        // console.log(req.query.name)
        let filename = req.query.name
        // let filename = req.body.name
        console.log(filename)
        const options = {
            root: path.resolve(config.folders.files),
            headers: { 'Content-Type': 'image/jpeg' }
        }


        // res.sendFile(filename, options, function(err){
        //     if (err) console.log(err)
        //     else {
        //         console.log(filename)
        //     }
        // })
        // res.send(path.resolve('files', filename))
        // res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.download(path.resolve(config.folders.files, filename))
    } catch (e) {
        console.log(e);
    }
})


export default router