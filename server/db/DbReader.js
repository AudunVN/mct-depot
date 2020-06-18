"use strict";

const DbHasher = require('./DbHasher');

class DbReader
{
    constructor(db)
    {
        this.db = db;
        this.hasher = new DbHasher();
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

        let results = statement.all(type, startTime, endTime);

        results.forEach((result) => {
            result.data = JSON.parse(result.data);
            result.metadata = JSON.parse(result.metadata);
        });

        return results;
    }

    readByWriteTime(type, startTime, endTime) {
        const statement = this.db.prepare("\
            SELECT \
                type, \
                timestamp, \
                data, \
                metadata, \
                original, \
                writeTimestamp \
            FROM telemetry \
            WHERE \
                type = ? AND \
                writeTimestamp BETWEEN ? AND ? \
            ORDER BY writeTimestamp ASC \
        ");

        let results = statement.all(type, startTime, endTime);

        results.forEach((result) => {
            result.data = JSON.parse(result.data);
            result.metadata = JSON.parse(result.metadata);
            delete result.writeTimestamp;
        });

        return results;
    }

    isPointNew(type, dataString) {
        /* faster alternative to isPointUnique, checks hash */

        const statement = this.db.prepare("\
        SELECT \
            type, \
            originalHash \
        FROM telemetry \
        WHERE \
            type = ? AND \
            originalHash = ?\
        ");

        let pointHash = this.hasher.hash(dataString);
        let existingPoint = statement.get(type, pointHash);

        return (typeof existingPoint == "undefined");
    }

    isPointUnique(point) {
        /*
            doesPointExist is easier to write correct code for, but
            we usually want the inverted function when we call it;
            this alias for it is easier to read than !doesPointExist().
        */

       return !this.doesPointExist(point);
    }

    doesPointExist(point) {
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

            if (JSON.stringify(point.metadata) == storedPoint.metadata) {
                if (JSON.stringify(point.data) == storedPoint.data) {
                    if (point.original == storedPoint.original) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbReader;
