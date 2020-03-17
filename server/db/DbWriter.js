"use strict";

class DbWriter
{
    constructor(db)
    {
        this.db = db;
    }

    write(type, data, metadata, timestamp) {
        let query = `
            INSERT INTO telemetry(type, data, metadata, timestamp)
            VALUES ($type, $data, $metadata, $timestamp)
        `;

        let parameters = {
            $type: type,
            $data: data,
            $metadata: metadata,
            $timestamp: timestamp || null
        }

        // insert row of telemetry data
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
