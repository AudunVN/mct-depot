"use strict";

const DbHasher = require('./DbHasher');

class DbWriter
{
    constructor(db)
    {
        this.db = db;
        this.hasher = new DbHasher();
    }

    write(telemetryPoint) {
        const statement = this.db.prepare("\
            INSERT INTO telemetry(type, timestamp, data, metadata, original, originalHash, writeTimestamp) \
            VALUES (?, ?, ?, ?, ?, ?, ?) \
        ");

        if (typeof telemetryPoint.type !== "string") {
            console.log("Telemetry type needs to be a string");
            return false;
        }

        if (typeof telemetryPoint.timestamp !== "number") {
            console.log("Telemetry timestamp needs to be a number");
            return false;
        }

        if (typeof telemetryPoint.original !== "string") {
            console.log("Telemetry original needs to be a string");
            return false;
        }

        let originalHash = this.hasher.hash(telemetryPoint.original);

        const result = statement.run(
            telemetryPoint.type,
            telemetryPoint.timestamp,
            JSON.stringify(telemetryPoint.data),
            JSON.stringify(telemetryPoint.metadata),
            telemetryPoint.original,
            originalHash,
            Date.now()
        );

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbWriter;
