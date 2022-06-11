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
        if(file.mimetype === 'image/png')  cb(null, `${uniqueSuffix}.png`); 
        if(file.mimetype === 'image/jpg')  cb(null, `${uniqueSuffix}.jpg`); 
        if(file.mimetype === 'image/jpeg')  cb(null, `${uniqueSuffix}.jpeg`); 
    },
  
  })
  
const multerUpload = multer({ 
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

function validateSite(req, res, next) {
    
    console.log('Validate site middleware');

    const form = req.body;
    const errors = []; 

    if(!form.site_name) errors.push({
        type: 'error',
        message: 'Missing site name.'
    })
    if(!form.site_description) errors.push({
        type: 'error',
        message: 'Missing site description.'
    })
    if(!form.site_url) errors.push({
        type: 'error',
        message: 'Missing site url.'
    })

    if(errors.length > 0) {
        console.log(errors)
        return res.status(400).send(errors)
    }
    next();
}

function upload(req, res, next) {
    multerUpload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).send({
                error: err.message
            })
        } else if(err) {
            console.log(err)
            return res.status(500).send({
                error: err
            })
        }
        
        next()
    });
}

router.post('/sites/new', upload, validateSite ,function(req, res, next) {
    const form = req.body;

    const logoFileName = req.file ? req.file.filename : null;

    console.log(            form.site_url, 
        form.site_name, 
        form.site_description, 
        logoFileName || 'Test')

    const sql =  `INSERT INTO sites (url, name, description, logo) 
                  VALUES (?, ?, ?, ?)`

    req.app.get('db').run(sql, [form.site_url, form.site_name, form.site_description, logoFileName], (err)  => {
        if(err) return res.status(500).send('Something went wrong while getting data from database');
 
        res.status(200).send('Successfully added new site.');
    });
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
                 WHERE id = ?`;

    req.app.get('db').run(sql, [siteId], (err) => {
        if(err) return res.status('500').send('Something went wrong.')
        console.log('[DELETE] Deleting site with id ', siteId)
        res.sendStatus(200);
    });
});

module.exports = router;