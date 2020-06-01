"use strict";

class DbWriter
{
    constructor(db)
    {
        this.db = db;
    }

    write(telemetryPoint) {
        const statement = this.db.prepare("\
            INSERT INTO telemetry(type, timestamp, data, metadata, original) \
            VALUES (?, ?, ?, ?, ?) \
        ");

        if (typeof telemetryPoint.type !== "string") {
            console.log("Telemetry type needs to be a string");
            return false;
        }

        if (typeof telemetryPoint.timestamp !== "number") {
            console.log("Telemetry timestamp needs to be a number");
            return false;
        }

        if (typeof telemetryPoint.data !== "string") {
            console.log("Telemetry data needs to be a string");
            return false;
        }

        if (typeof telemetryPoint.metadata !== "string") {
            console.log("Telemetry metadata needs to be a string");
            return false;
        }

        if (typeof telemetryPoint.original !== "string") {
            console.log("Telemetry original needs to be a string");
            return false;
        }

        const result = statement.run(telemetryPoint.type, telemetryPoint.timestamp, telemetryPoint.data, telemetryPoint.metadata, telemetryPoint.original);

        //console.log(`Inserted new telemetry with ID ${result.lastInsertRowid}`);

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbWriter;
