require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Setup } = require('./setup')
const setup = new Setup({
    databaseDir: '/data/database',
    logsDir: '/data/logs',
    pathToSQL: path.join(__dirname, '/database/db.sql')
});

const bodyParser = require('body-parser');

setup.start();

const db = require('./database/db');
const express = require('express')
const sqlite3 = require('sqlite3')
const config = require('./config');
const multer = require('multer')
const upload =  multer();
 

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bodyParser.json())

app.get('/', function(req, res) {
    db.all('SELECT * FROM sites;', (err, rows) => {
        console.log(rows);
        res.render('pages/index', {sites: rows});
    }) 

});

app.get('/manage', function(req, res) {
    db.all('SELECT * FROM sites;', (err, rows) => {
        console.log(rows);
        res.render('pages/manage', {sites: rows});
    });
});

app.get('/settings', function(req, res) {
    res.render('pages/settings');
});

app.post('/manage/add', upload.none() ,function(req, res) {
    const form  = req.body;
    console.log(form)
    
    const sql = `INSERT INTO sites (url, name, description, logo_url) 
                 VALUES ('${form.site_url}', '${form.site_name}', '${form.site_description}', '${form.site_logo_url}')`
    db.serialize(() => {
        db.exec(sql, (err)  => {
            if(err) return re
        });
    })
    res.sendStatus(200);
});

app.post('/manage/edit', upload.none() ,function(req, res) {
    const form  = req.body;
    
    const sql = `UPDATE sites 
                 SET url = '${form.site_url}', 
                     name = ${form.name},
                     description = '${form.site_description}',
                     logo_url = '${form.site_logo_url}'
                 WHERE id = ${form.id}
                 `
    db.serialize(() => {
        db.exec(sql);
    })
    res.sendStatus(200);
});
app.post('/manage/remove/:id', upload.none() ,function(req, res) {
    const siteId = req.params.id;
    
    const sql = `DELETE FROM sites
                 WHERE id = ${siteId}`;
                 
    db.serialize(() => {
        db.exec(sql);
    })
    res.sendStatus(200);
});

app.listen(config.port);

console.log(`Server is listening on port ${config.port}`);
