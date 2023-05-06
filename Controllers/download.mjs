import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
const urlencodedParser = express.urlencoded({extended: false})
import {v4} from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




router.get('/', urlencodedParser, (req, res) => {


    // console.log(__dirname)
    // console.log(req.query.name)
    let filename=req.query.name
    // let filename = req.body.name
    console.log(filename)
    const options = {
        root: path.resolve('files'),
        headers: {'Content-Type': 'image/jpeg'}
    }

    // res.sendFile(filename, options, function(err){
    //     if (err) console.log(err)
    //     else {
    //         console.log(filename)
    //     }
    // })
    // res.send(path.resolve('files', filename))
    res.download(path.resolve('files', filename))
})


export default router