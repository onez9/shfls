import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
import {v4} from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from '../config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




router.post('/', async (req, res) => {

    // `server/Pictures/${v4()}${path.parse(req.files.file.name).ext}`
    try {
        console.log(req.files.file)
        req.files.file.mv(`${config.folders.files}/${req.files.file.name}`)
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