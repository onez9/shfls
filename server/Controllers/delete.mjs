import express from 'express';
import path from 'path';
import fs from 'fs'
const router = express.Router();
//import { v4 } from 'uuid'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from '../configs/config.mjs';

import sqlite from 'sqlite3';


// это для запуска проекта из любой директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);








export default router;
