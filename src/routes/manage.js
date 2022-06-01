const express = require('express');
const router = express.Router();

const multer = require('multer')
const upload =  multer();
 

router.get('/', function(req, res) {
    db.all('SELECT * FROM sites;', (err, rows) => {
        res.render('pages/manage', {sites: rows});
    });
});

router.get('/api/site/:id', function(req, res) {
    console.log('test')

    const errors = [];
    if(!req.params.id) return res.status(400).send('Did not recieve id.')
    console.log('test2')
    db.all(`SELECT * FROM sites WHERE id = ?`, [req.params.id], (err, rows) => {
        if(err) return res.status(500).send(err);
        if(rows.length === 0) return res.status(400).send({
            error: 'Did not find any site with id ' + req.params.id
        })

        console.log('test3')
        res.status(200).send(rows[0]);
    })
});

router.post('/api/', upload.none() ,function(req, res) {
    const form  = req.body;

    const sql = `INSERT INTO sites (url, name, description, logo_url) 
                 VALUES ('${form.site_url}', '${form.site_name}', '${form.site_description}', '${form.site_logo_url}')`
    db.serialize(() => {
        db.exec(sql, (err)  => {
            return console.log(err);
        });
    })
    res.sendStatus(200);
});

router.put('/manage/edit/:id', upload.none() ,function(req, res) {
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
router.delete('/manage/remove/:id', upload.none() ,function(req, res) {
    const siteId = req.params.id;
    
    const sql = `DELETE FROM sites
                 WHERE id = ${siteId}`;
                 
    db.serialize(() => {
        db.exec(sql);
    })
    res.sendStatus(200);
});

module.exports = router