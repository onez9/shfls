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

    // let db = new sqlite3.Database(db_path, (err) => {
	// 	if (err) {
	// 		console.log(err)
	// 	}
	// 	console.log('connect update ok')
	// });
	// console.log('test /upd/ cource', req.body)
	// console.log(123123123, req.body.name, req.body.theme, req.body.description, req.body.runtime, req.body.id)
	// let stmt = db.prepare('update cources set name=?, theme=?, description=?, runtime=? where id=?')
	// stmt.run([req.body.name, req.body.theme, req.body.description, req.body.runtime, req.body.id], (err, row)=>{
	// 	console.log(row)
	// 	stmt.finalize()
	// })
    console.log(__dirname)
    
    fs.readdir('files', (err, items) => {
        if (err) console.log(err);
        console.log('24 2348729 234234')
        console.log(items)
        res.json(items)
    })


})


export default router