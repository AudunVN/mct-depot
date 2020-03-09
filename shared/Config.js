"use strict";

class Config
{
    constructor()
    {
        this.debug = true;

        this.dbPath = "state/db.sqlite3";
        this.configPath = "state/config.json";
        this.logPath = "state/logs";
        this.defsPath = "defs";

        this.serverPollRate = 10000 /* milliseconds */;
        this.dbPollRate = 100 /* milliseconds */;
    }
}

module.exports = Config;
