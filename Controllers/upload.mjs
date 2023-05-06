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




router.post('/', urlencodedParser, async (req, res) => {

    // `server/Pictures/${v4()}${path.parse(req.files.file.name).ext}`
    try {
        console.log(req.files.file)
        req.files.file.mv(`files/${req.files.file.name}`)
        let message = 'Файл успешно загружен'
        res.json({'message': message})
    }
    catch {
        let error_message = 'Файл не найден'
        console.log(error_message)
        res.json({'message': error_message})
    }
})


export default router