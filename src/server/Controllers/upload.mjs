import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
import {v4} from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from '../configs/config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// const urlencodedParser = express.urlencoded({ extended: false })

// import bodyParser from 'body-parser'








// настройка приложения
// router.use(express.json());
// router.use(urlencodedParser);


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded());
// // in latest body-parser use like below.
// router.use(bodyParser.urlencoded({ extended: true }));


router.post('/', (req, res) => {

    // `server/Pictures/${v4()}${path.parse(req.files.file.name).ext}`

    // console.log(Buffer.from(req.files.file, 'latin1').toString('utf8'))
    // console.log(file.name)

    // console.log('upload hello')
    // console.log('sdfsfsfsdfs111111111111111:', req.files.file)
    
    
    
    try {
        console.log('this is ', req.files.file)
        let list_files = req.files.file
        console.log(typeof list_files)
        if (Array.isArray(list_files)) {
            for (const file of list_files) {
                file.mv(`${config.folders.files}/${file.name}`)
            }
        } else {
            console.log(req.files.file)
            req.files.file.mv(`${config.folders.files}/${req.files.file.name}`)
            
        }

        let message = 'Файл успешно загружен'
        res.json({'message': message})
    }
    catch (e) {
        console.log(e)


        let error_message = 'Файл не найден'
        console.log(error_message)
        res.json({'message': error_message})
    }








})


export default router
