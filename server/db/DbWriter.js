"use strict";

class DbWriter
{
    constructor(db)
    {
        this.db = db;
    }

    write(type, data, metadata, timestamp) {
        const statement = this.db.prepare("\
            INSERT INTO telemetry(type, data, metadata, timestamp) \
            VALUES (?, ?, ?, ?) \
        ");

        const result = statement.run(type, data, metadata, timestamp);

        //console.log(`Inserted new telemetry with ID ${result.lastInsertRowid}`);

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbWriter;
