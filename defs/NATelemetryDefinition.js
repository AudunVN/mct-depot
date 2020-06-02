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

    parse(telemetryString) {
        let telemetryPoint = {
            type: this.type,
            timestamp: 0,
            data: "",
            metadata: "",
            original: telemetryString
        }

        let telemetry = JSON.parse(telemetryString);

        let dataKey = Object.keys(telemetry).find(k=>typeof telemetry[k]==="string" && telemetry[k].slice(0,2)==="\\x");
        
        let packedDataString = telemetry[dataKey];

        telemetryPoint.data = this.unpack(packedDataString);

        delete telemetry[dataKey];

        telemetryPoint.metadata = telemetry;

        return telemetryPoint;
    }

    pack(data) {
        return "\\x" + this.context.telemetry.toBinary(data).toString("hex");
    }

    canPack(data) {
        return true;
    }

    getDataBuffer(packedDataString) {
        let rawHexString = packedDataString.replace('\\x', '');
        return Buffer.from(rawHexString, "hex");
    }

    unpack(packedDataString) {
        let buffer = this.getDataBuffer(packedDataString);

        return this.context.telemetry.fromBinary(buffer);
    }

    canUnpack(packedDataString) {
        let buffer = this.getDataBuffer(packedDataString);

        return (Buffer.byteLength(buffer) === this.byteLength);
    }
}

module.exports = NATelemetryDefinition;
