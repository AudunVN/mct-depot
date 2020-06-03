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
                timestamp, \
                data, \
                metadata, \
                original \
            FROM telemetry \
            WHERE \
                type = ? AND \
                timestamp BETWEEN ? AND ? \
            ORDER BY timestamp ASC \
        ");

        return statement.all(type, startTime, endTime);
    }

    isPointNew(point) {
        const statement = this.db.prepare("\
            SELECT \
                type, \
                timestamp, \
                data, \
                metadata, \
                original \
            FROM telemetry \
            WHERE \
                type = ? AND \
                timestamp BETWEEN ? AND ? \
            ORDER BY timestamp ASC \
        ");

        let existingPoints = statement.all(point.type, point.timestamp, point.timestamp);

        for (let i = 0; i < existingPoints.length; i++) {
            let storedPoint = existingPoints[i];

            if (point.metadata != storedPoint.metadata) {
                return true;
            }

            if (point.data != storedPoint.data) {
                return true;
            }

            if (point.original != storedPoint.original) {
                return true;
            }

            // all fields are identical
            return false;
        }

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbReader;
