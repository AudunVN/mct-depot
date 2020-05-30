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
            let defaultValueRegex = / *= *[^;]*/g;

            let structString = fs.readFileSync(structPath, "utf8");
            
            structString = structString.replace(structNameRegex, "} telemetry;");
            structString = structString.replace(defaultValueRegex, "");

            this.context = ezstruct(structString);

            this.byteLength = Buffer.byteLength(this.context.telemetry.toBinary({}));
        } catch(e) {
            console.log("Error while creating ezstruct context: ", e.stack);
        }
    }

    pack(object) {
        return this.context.telemetry.toBinary(object);
    }

    canPack(object) {
        return true;
    }

    unpack(string) {
        var rawHexString = string.replace('\\x', '');
        var buffer = Buffer.from(rawHexString, "hex");

        return this.context.telemetry.fromBinary(buffer);
    }

    canUnpack(string) {
        var rawHexString = string.replace('\\x', '');
        var buffer = Buffer.from(rawHexString, "hex");

        return (Buffer.byteLength(buffer) === this.byteLength);
    }
}

module.exports = NATelemetryDefinition;
