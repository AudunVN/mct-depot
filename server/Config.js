"use strict";

class Config
{
    constructor(configFilePath)
    {
        this.loadDefaults();
    }

    loadDefaults() {
        this.debug = false;
        this.dbPath = "db.sqlite";
        this.port = 8471;

        this.defs = [];
    }

    load(configFilePath)
    {
        console.log("Config file loading not implemented");
    }
}

module.exports = Config;