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

import sqlite from 'sqlite3';
const db_path = "./db.sqlite3"





// const urlencodedParser = express.urlencoded({ extended: false })

// import bodyParser from 'body-parser'








// настройка приложения
// router.use(express.json());
// router.use(urlencodedParser);


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded());
// // in latest body-parser use like below.
// router.use(bodyParser.urlencoded({ extended: true }));





export default router
