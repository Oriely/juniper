const express = require('express');
const router = express.Router();

const multer = require('multer')
const upload =  multer();
 

router.get('/', function(req, res) {
    req.app.get('db').all('SELECT * FROM sites;', (err, rows) => {
        res.render('pages/manage', {sites: rows});
    });
});

module.exports = router