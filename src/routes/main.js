
const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    console.log(req.app.get('db'))
    req.app.get('db').all('SELECT * FROM sites;', (err, rows) => {
        res.render('pages/index', {sites: rows});
    }) 

});

module.exports = router;