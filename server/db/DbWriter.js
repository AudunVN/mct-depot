"use strict";

class DbWriter
{
    constructor(db)
    {
        this.db = db;
    }

    write(type, data, timestamp) {
        let query = `
            INSERT INTO telemetry(type, data, timestamp)
            VALUES ($type, $data, $timestamp)
        `;

        let parameters = {
            $type: type,
            $data: data,
            $timestamp: timestamp || null
        }

        // insert one row into the langs table
        this.db.run(query, parameters, function (err) {
            if (err) {
                console.error(err.message);
                return false;
            }

            console.log(`Inserted new telemetry with ID ${this.lastID}`);
        });

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbWriter;
