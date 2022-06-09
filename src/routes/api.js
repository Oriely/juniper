const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/logos')
    },
    filename: function (req, file, cb) {
        const { id } = req.body;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname);
    },
  
  })
  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb('Please upload only images.', false)
        }
    }

}).single('site_logo')
router.get('/sites', function(req, res) {
    req.app.get('db').all('SELECT * FROM sites;', (err, rows) => {
        if(err) return res.status(500).send('Something went wrong.');
        res.status(200).send(rows);
    })
}) 
router.get('/sites/:id', function(req, res) {
    const errors = [];

    if(!req.params.id) return res.status(400).send('Did not recieve id.');

    req.app.get('db').all(`SELECT * FROM sites WHERE id = ?`, [req.params.id], (err, rows) => {
        if(err) return res.status(500).send(err);
        if(rows.length === 0) return res.status(400).send({
            error: 'Did not find any site with id ' + req.params.id
        })
        res.status(200).send(rows[0]);
    })
});

router.post('/sites/new'  ,function(req, res) {
    const form  = req.body;
    const logo = req.file;
    console.log(logo)
    if(logo) {
        console.log('Got image upload request.')
        upload(req, res, function(err) {

            if (err instanceof multer.MulterError) {
                console.log(err)
                res.status(500).send({
                    error: err.message
                })
            } else if(err) {
                console.log(err)
                res.status(500).send({
                    error: err
                })
            } 
            console.log('Successfully uploaded image.')
        });
    }
    const sql = `INSERT INTO sites (url, name, description, logo) 
                 VALUES ('${form.site_url}', '${form.site_name}', '${form.site_description}', 'test')`
    req.app.get('db').serialize(() => {
        req.app.get('db').exec(sql, (err)  => {
            return console.log(err);
        });
    })
    res.sendStatus(200);
});

router.put('/sites/:id' ,function(req, res) {
    const form  = req.body;
    const siteId = req.params.id;

    console.log(`[EDIT] Got edit request`)
    console.log(form);

    
    const sql = `UPDATE sites 
                 SET url = ?, 
                     name = ?,
                     description = ?
                 WHERE id = ?
                 `
    req.app.get('db').run(sql, [form.site_url, form.name, form.site_description, siteId], (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Something went wrong')

        };
        res.status(200).send('success');
    });

});
router.delete('/sites/:id' ,function(req, res) {
    const siteId = req.params.id;
    
    const sql = `DELETE FROM sites
                 WHERE id = ${siteId}`;
                 
    req.app.get('db').serialize(() => {
        req.app.get('db').exec(sql);
    })
    res.sendStatus(200);
});

module.exports = router;