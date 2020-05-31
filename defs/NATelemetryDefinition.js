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
        object["packed_data"] = "\\x" + this.context.telemetry.toBinary(object["unpacked_data"]).toString("hex");

        return JSON.stringify(object);
    }

    canPack(object) {
        return true;
    }

    getDataBuffer(telemetry) {
        let dataKey = Object.keys(telemetry).find(k=>typeof telemetry[k]==="string" && telemetry[k].slice(0,2)==="\\x");
        
        let packedDataString = telemetry[dataKey];
        let rawHexString = packedDataString.replace('\\x', '');
        return Buffer.from(rawHexString, "hex");
    }

    unpack(string) {
        let telemetry = JSON.parse(string);
        
        let buffer = this.getDataBuffer(telemetry);

        telemetry["unpacked_data"] = this.context.telemetry.fromBinary(buffer);

        return telemetry;
    }

    canUnpack(string) {
        try {
            let telemetry = JSON.parse(string);
            
            let buffer = this.getDataBuffer(telemetry);

            return (Buffer.byteLength(buffer) === this.byteLength);
        } catch(e) {

        }

        return false;
    }
}

module.exports = NATelemetryDefinition;
