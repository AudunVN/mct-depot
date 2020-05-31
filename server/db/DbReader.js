"use strict";

class DbReader
{
    constructor(db)
    {
        this.db = db;
    }

    read(type, startTime, endTime) {
        const statement = this.db.prepare("\
            SELECT \
                type, \
                data, \
                metadata, \
                timestamp \
            FROM telemetry \
            WHERE \
                type = ? AND \
                timestamp BETWEEN ? AND ? \
            ORDER BY timestamp ASC \
        ");

        return statement.all(type, startTime, endTime);
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbReader;
