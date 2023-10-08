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

router.post('/lang', (req, res) => {
    const db = new sqlite.Database('db.sqlite3')

    let dict = {}
    let sql = "SELECT name, code FROM languages"

    //db.serialize(() => {
    db.all(sql, [], (err, rows) => {
        try {
            if (err) {
                throw err;
            }
            
            console.log(rows)
            rows.forEach( row => {
                dict[row.code] = row.name
            })

            res.json(dict)

        } catch (e) {
            console.info('Сработал catch (при запросе к /upload/lang) ошибка ниже')
            console.log(e);

        }
    });
    //console.log('Это выведется в терминале: ', dict)
    // console.log('Тутт: ', arr)


    //});


    db.close();

})


router.post('/dict', (req, res) => {
    let recieved_data = (req.body)
    const db = new sqlite.Database('db.sqlite3')
    console.info('received data: ', recieved_data)

    let dictionary_id;
    switch (recieved_data['name_lang']) {
        case 'en':
            dictionary_id = 1;
            break;
        case 'jp':
            dictionary_id = 2;
            break;
    
        case 'ru':
            dictionary_id = 3;
            break;
    
        case 'kr':
            dictionary_id = 4;
            break;
    
        case 'cn':
            dictionary_id = 5;
            break;
    
        default:
            break;
    }

    try {


        if (true) {

            let sql = "insert into words ('dictionary_id', 'one', 'two', 'three', 'date') VALUES (?, ?, ?, ?, ?)"
            let params = [dictionary_id, recieved_data['one'], recieved_data['two'], recieved_data['three'], recieved_data['date']]
            db.serialize(() => {
                const stmt = db.prepare(sql);
                stmt.run(params);
                stmt.finalize();
            
            });
        }

        if (false) {
            let data = JSON.parse(fs.readFileSync(path.resolve('Share', 'txt', `${recieved_data['name_lang']}.json`), { encoding: 'utf-8' }))
            console.log(data)
            data[recieved_data['left']] = recieved_data['right']

            fs.writeFileSync(path.resolve('Share', 'txt', `${recieved_data['name_lang']}.json`), JSON.stringify(data), { encoding: 'utf-8' })
        }

        if (false) {
            const db = new sqlite.Database('db.sqlite3')
            db.serialize(() => {
                db.run("CREATE TABLE lorem (info TEXT)");
            
                const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
                for (let i = 0; i < 10; i++) {
                    stmt.run("Ipsum " + i);
                }
                stmt.finalize();
            
                db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
                    console.log(row.id + ": " + row.info);
                });
            });


            db.close();
        }
        
        db.close();

    } catch (error) {
        console.log(error)
        console.log('Нет файла для чтения')

    }


    // res.status(200).json({data: 9})
    res.json({dat2a: 92})
})

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

        let message = 'Файлы успешно загружен'
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
