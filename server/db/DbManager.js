"use strict";

const Config = require('../../shared/Config');

const DbReader = require('./DbReader');
const DbWriter = require('./DbWriter');

const sqlite3 = require('sqlite3').verbose();

const config = new Config();

class DbManager
{
    constructor()
    {
        if (config.debug) {
            this.db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Connected to the in-memory SQlite database.');
            });
        }

        this.db.run(
            'CREATE TABLE IF NOT EXISTS telemetry ( \
                id INTEGER PRIMARY KEY, \
                type TEXT, \
                timestamp INTEGER, \
                data TEXT \
            );'
        );

        this.reader = new DbReader();
        this.writer = new DbWriter();
    }

    drop() {
        this.db
    }
}

module.exports = DbManager;
