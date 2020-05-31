"use strict";

const DbReader = require('./DbReader');
const DbWriter = require('./DbWriter');

const Database = require('better-sqlite3');

class DbManager
{
    constructor(config)
    {
        if (config.debug) {
            this.db = new Database(":memory:");
        } else {
            this.db = new Database(config.dbPath);
        }

        this.db.exec(
            "CREATE TABLE IF NOT EXISTS telemetry ( \
                id INTEGER PRIMARY KEY, \
                type TEXT, \
                data TEXT, \
                metadata TEXT, \
                timestamp INTEGER \
            );"
        );

        this.reader = new DbReader(this.db);
        this.writer = new DbWriter(this.db);
    }

    clearRows() {
        this.db.exec("DELETE FROM telemetry;");
        console.log("Removed all rows from telemetry database");

        return true;
    }

    destroy() {
        this.db.close();

        this.reader.destroy();
        this.reader = null;

        this.writer.destroy();
        this.writer = null;
    }
}

module.exports = DbManager;
