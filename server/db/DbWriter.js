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

        if (typeof telemetryPoint.original !== "string") {
            console.log("Telemetry original needs to be a string");
            return false;
        }

        const result = statement.run(
            telemetryPoint.type,
            telemetryPoint.timestamp,
            JSON.stringify(telemetryPoint.data),
            JSON.stringify(telemetryPoint.metadata),
            telemetryPoint.original
        );

        return true;
    }

    destroy() {
        this.db = null;
    }
}

module.exports = DbWriter;
