require('dotenv').config();


const express = require('express');
const { createServer } = require('http');
const validator = require('express-validator');
const sqlite3 = require('sqlite3'); 
const config = require('./config');
const socketio = require('socket.io');
const fs = require('fs');
const fs_promises = fs.promises;
const path = require('path');
const bodyParser = require('body-parser');

class Juniper {

    constructor({databaseDir, logsDir, pathToSQL, config, express}) {
        this.databaseDir = databaseDir;
        this.logsDir = logsDir;
        this.pathToSQL = pathToSQL;
        this.app = express;
        this.config = config
        this.db = null;
    }
    async createDataDirectory() {
        if(!fs.existsSync('/data')) {
            console.log('Creating base data directory.')
            try {
                await fs_promises.mkdir('/data');
                
            } catch(err) {
                console.log(err)
            }

        } else {
            console.log('Found base data directory. Skipping...')
        }
    }

    async createDatabaseDirectory() {
        if(!fs.existsSync('/data/database')) {

            console.log('Creating database directory.')

            try {
                await fs_promises.mkdir('/data/database');
                console.log(`Successfully created logs folder at: /data/logs`)
            } catch(error) {
                console.log(`Something went wrong while creating database directory: \n ${error}`);
            }

        } else {
            console.log('Found database directory. Skipping...')
        }
    }

    async createLogsDirectory() {
        if(!fs.existsSync('/data/logs')) {
            console.log('Creating logs directory.')
            try {
                await fs_promises.mkdir('/data/logs');
                console.log(`Successfully created logs folder at: /data/logs`)
            }  catch(error) {
                console.log(`Something went wrong while creating logs directory: \n ${error}`)
            } 

        } else {
            console.log('Found logs directory. Skipping...')
        }
    }

    async database() {
        return new Promise((resolve, reject) => {
            const databaseFileLocation = `${this.databaseDir}/juniper.db`;

            const sql = fs.readFileSync(this.pathToSQL);

            if(!fs.existsSync(databaseFileLocation)) {
                const db = new sqlite3.Database(path.resolve(databaseFileLocation), function (err) {
                    if(err) reject(`Something went wrong while creating database.\n`, err)
                    console.log('Created database in ' + databaseFileLocation);

                    db.exec(sql.toString(), (err) => {
                        if(err) reject('Something went wrong while creating tables.\n', err)


                    });
                    
                    resolve(this)
                });

            } else {
    
                const db = new sqlite3.Database(path.resolve('/data/database/juniper.db'), sqlite3.OPEN_READWRITE, function (err, database) {
                    if(err) reject(`Something getting database.\n`, err); 
                    console.log(`Found existing database at ${databaseFileLocation}`);
                    console.log('Connected to database');
                    resolve(this);
                });

            }
        })
    }

    async init() {

        console.log(`
                                                  
              **/(##############((/*              
          //(######,          ./######(/          
       //(##*#      /          .    /####(/       
     ((#### **      // *       /       .###((     
    (##(#    #/     /#  //     /(   .     ###((   
  ((### (.   *#*    /(*  ((    /#   (      (##((  
  (###   (/,  ((*   /((   ((,  /#. /#   ,   ,###( 
 ####     .%/, /#/  /(/   .((, /# /(* .(     ###(#
 ####       /#/, #/ /#     ,((./#*/# *#.      ####
 ####         /#/*/((/*.    *((((/#*/#        ####
 ####        ,,.#(((((((((*((((((((((/       .####
 ####.      / ((((((((((( #((((((((((((#     #### 
  ####     / #(((((((((( #(((((((((((((##   (###% 
   %###.   *.((((((((((((((((((((((((((#%, ####%  
    %####   /((((((&&%(( (((((((%((((((%%(###%%   
      %####,  /#(((((#%%((((((%&&&(((%%%####%     
        %######           *%#(((#%%%%####%%       
           &%########,.     ./########&&          
               &&%%#############%&&              
        `)

        // require all routes
        const mainRoute = require('./routes/main')
        const manageRoute = require('./routes/manage')
        const settingsRoute = require('./routes/settings');
        const apiRoute = require('./routes/api');
        const statusRoute = require('./routes/status');


        
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.use('/uploads',express.static(path.join(__dirname, 'uploads')))
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json())
        this.app.use(bodyParser.json())

        // Setting routes
        this.app.use('/', mainRoute);
        this.app.use('/manage', manageRoute);
        this.app.use('/settings', settingsRoute);
        this.app.use('/api', apiRoute);
        this.app.use('/status', statusRoute);

        var signals = {
          'SIGHUP': 1,
          'SIGINT': 2,
          'SIGTERM': 15
        };
        


        try {
            
            await this.createDataDirectory();
            await this.createDatabaseDirectory();
            await this.createLogsDirectory();

            this.db = await this.database();

            const server = createServer(this.app);

            const io = socketio(server);

            const statusSocket = require('./socket/serverStatus.js')(io);

                
            this.app.set('db', this.db);
            // Do any necessary shutdown logic for our application here
            const shutdown = (signal, value) => {
                console.log("Shutting down...");
                server.close(() => {
                    console.log(`Server stopped by ${signal} with value ${value}`);
                    process.exit(128 + value);
                });
            };
            
            // Create a listener for each of the signals that we want to handle
            Object.keys(signals).forEach((signal) => {
                process.on(signal, () => {
                    console.log(`Process received a ${signal} signal`);
                    shutdown(signal, signals[signal]);
                });
            });

            server.listen(config.port)

            console.log(`Server(${process.pid}) is listening on port ${config.port}`);

        } catch(err) {
            console.log(err)
        }

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