const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(path.resolve('/data/database/juniper.db'), sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.log(err);

    console.log('Connected to database');
});




module.exports = db;