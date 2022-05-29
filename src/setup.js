const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

class Setup {
    constructor({databaseDir, logsDir, pathToSQL}) {
        this.databaseDir = databaseDir;
        this.logsDir = logsDir;
        this.pathToSQL = pathToSQL;
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

    database() {

        const databaseFileLocation = `${this.databaseDir}/juniper.db`;

        if(!fs.existsSync(databaseFileLocation)) {
            const db = new sqlite3.Database(path.resolve(databaseFileLocation), function (err) {
                if(err) return console.log('Something went wrong while creating database... \n ' + err)
                console.log('Created database in ' + databaseFileLocation);
            });
            
            const sql = fs.readFileSync(this.pathToSQL);

            console.log(sql.toString());

            db.exec(sql.toString());
        }


    }

    checkAlreadyRun() {
    }

    start() {
        this.directories();
        this.database();
    }
}

module.exports = { Setup };