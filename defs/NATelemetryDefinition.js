"use strict";

const fs = require('fs');
const TelemetryDefinition = require('./TelemetryDefinition.js');
const ezstruct = require("ezstruct");

class NATelemetryDefinition extends TelemetryDefinition
{
    constructor(type, structPath)
    {
        super(type);

        try {
            let structNameRegex = /}[^;]*;\s*$/g;

            let structString = fs.readFileSync(structPath, "utf8");

            structString = structString.replace(structNameRegex, "} telemetry;");

            this.context = ezstruct(structString);
        } catch(e) {
            console.log("Error while creating ezstruct context: ", e.stack);
        }
    }

    pack(object) {
        return this.context.telemetry.toBinary(object);
    }

    isPackable(object) {
        return true;
    }

    unpack(string) {
        return this.context.telemetry.fromBinary(string);
    }

    isUnpackable(object) {
        return true;
    }
}

module.exports = NATelemetryDefinition;
