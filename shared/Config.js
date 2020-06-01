"use strict";

const fs = require('fs');

class Config
{
    constructor(configFilePath)
    {
        this.loadDefaults();

        if (typeof configFilePath !== "undefined") {
            this.configFilePath = configFilePath;
            this.load(configFilePath);
        }
    }

    loadDefaults() {
        this.debug = false;
        this.port = 8471;

        this.dbPath = "state/db.sqlite3";
        this.configPath = "state/config.json";
        this.logPath = "state/logs";

        this.serverPollRate = 10000 /* milliseconds */;
        this.dbPollRate = 100 /* milliseconds */;

        this.defs = [];
    }
    
    reset() {
        Object.keys(this).forEach((key) => {
            delete this[key];
        });
        
        let newConfig = new Config();
        
        Object.keys(newConfig).forEach((key) => {
            this[key] = newConfig[key];
        });
    }

    load(configFilePath)
    {
        let data = "";

        try {
            let fileString = fs.readFileSync(configFilePath, "utf8");
            data = JSON.parse(fileString); 
        } catch(exception) {
            console.log("Error while reading config file: ", exception.stack);
        }

        if (data != "") {
            /* overwrite keys from loaded config file */

            Object.keys(data).forEach((key) => {
                this[key] = data[key];
            });
        }
    }
}

module.exports = Config;