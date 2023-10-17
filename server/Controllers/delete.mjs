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




router.delete('/group', (req, res) => {
    try {
        console.log('/group', req.body)
        const id = req.body.id
        const name = req.body.name


        const db = new sqlite.Database('db.sqlite3')
        let sql = 'delete from groups where id=? or name=?'
        let params = [id, name]
        db.serialize(() => {
            console.log('Удаление данных (Удаляем группу):')
            const stmt = db.prepare(sql);
            stmt.run(params);
            stmt.finalize();
            res.json({result: 'success'})
        });

        db.close()



    } catch (e) {
        console.log('Error on deleting group words!')
        res.json({result: 'failed'})
        console.log(e)
    } finally {
        console.log('999')
    }






})


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
        console.log(`filename: ${filename}`)
        let del_path = path.resolve(config.folders.files, filename)

        console.log('Патч удаленного файла: ', del_path)
        fs.unlink(del_path, err => {
            if (err) {
                console.log(err)
                res.json({result: 'fail'})
            } else { 
                console.log('файл удалён')
                res.json({result: 'success'})
            }
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
