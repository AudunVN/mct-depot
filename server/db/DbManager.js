"use strict";

const DbReader = require('./DbReader');
const DbWriter = require('./DbWriter');

const sqlite3 = require('sqlite3').verbose();

class DbManager
{
    constructor(config)
    {
        if (config.debug) {
            this.db = new sqlite3.Database(":memory:", (err) => {
                if (err) {
                    console.error(err.message);
                }

                console.log("Connected to in-memory telemetry database");
            });
        } else {
            this.db = new sqlite3.Database(config.dbPath, (err) => {
                if (err) {
                    console.error(err.message);
                }

                console.log("Connected to database at " + config.dbPath);
            });
        }

        this.db.run(
            "CREATE TABLE IF NOT EXISTS telemetry ( \
                id INTEGER PRIMARY KEY, \
                type TEXT, \
                timestamp INTEGER, \
                data TEXT \
            );"
        );

        this.reader = new DbReader(this.db);
        this.writer = new DbWriter(this.db);
    }

    clearRows() {
        this.db.run("DELETE FROM telemetry;");
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
