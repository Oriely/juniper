require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express')
const sqlite3 = require('sqlite3')
const config = require('./config');


class Juniper {
    constructor({databaseDir, logsDir, pathToSQL, config, express}) {
        this.databaseDir = databaseDir;
        this.logsDir = logsDir;
        this.pathToSQL = pathToSQL;
        this.app = express;
        this.config = config
        this.db = null;
    }
    directories() {
        if(!fs.existsSync('/data/database')) {
            console.log('Did not find database folder. Creating...');
            fs.mkdirSync('/data/database', { recursive: true});
        } 
        if(!fs.existsSync('/data/logs')) {
            console.log('Did not find logs folder. Creating...');
            fs.mkdirSync('/data/logs', { recursive: true });
        } 
    }

    async database() {

        const databaseFileLocation = `${this.databaseDir}/juniper.db`;

        if(!fs.existsSync(databaseFileLocation)) {
            const db = new sqlite3.Database(path.resolve(databaseFileLocation), function (err) {
                if(err) throw new Error('err')
                console.log('Created database in ' + databaseFileLocation);
            });
            
            const sql = fs.readFileSync(this.pathToSQL);

            console.log(sql.toString());

            db.exec(sql.toString());

            this.db = db;
        } else {

            const db = new sqlite3.Database(path.resolve('/data/database/juniper.db'), sqlite3.OPEN_READWRITE, (err) => {
                if(err) return console.log(err);
                console.log(`Found existing database at ${databaseFileLocation}`);
                console.log('Connected to database');
            });
            
            this.db = db;
        }
    }

    init() {

        this.directories();
        this.database();

        this.app.set('db', this.db);
        
        const mainRoute = require('./routes/main')
        const manageRoute = require('./routes/manage')
        const settingsRoute = require('./routes/settings');

        
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json())
        this.app.use(bodyParser.json())
        this.app.use('/', mainRoute);
        this.app.use('/manage', manageRoute);
        this.app.use('/settings', settingsRoute);

        this.app.listen(config.port);
        console.log(`Server is listening on port ${config.port}`);
    }
}

(async() => {
        

    const juniper = new Juniper({
        databaseDir: '/data/database',
        logsDir: '/data/logs',
        pathToSQL: path.join(__dirname, '/database/db.sql'),
        config: config,
        express: express()
    });


    juniper.init();
    


})();