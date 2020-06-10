"use strict";

const fs = require('fs');
const TelemetryDefinition = require('./TelemetryDefinition.js');
const ezstruct = require("ezstruct");

class NATelemetryDefinition extends TelemetryDefinition
{
    constructor(def)
    {
        super(def);

        this.def = def;

        try {
            let structNameRegex = /}[^;]*;\s*$/g;
            let defaultValueRegex = / *= *[^;]*/g;

            let structString = fs.readFileSync(def.structPath, "utf8");

            structString = structString.replace(structNameRegex, "} telemetry;");
            structString = structString.replace(defaultValueRegex, "");

            this.context = ezstruct(structString);

            this.byteLength = Buffer.byteLength(this.context.telemetry.toBinary({}));
        } catch(e) {
            console.log("Error while creating ezstruct context: ", e.stack);
        }
    }

    getMctMetadata() {
        /* gets metadata objects for OpenMCT */
        let metadata = [];

        for (const field of Object.values(this.context.telemetry.fields)) {
            let point = {
                "key": this.def.type + "." + field.name,
                "name": field.name,
                "telemetry": {
                    "values": []
                }
            };

            let value = {
                "key": "value",
                "name": "Value",
                /*"units": "kilograms",
                "format": "float",
                "min": 0,
                "max": 100,*/
                "hints": {
                    "range": 1
                }
            };
            point.telemetry.values.push(value);

            let timeValue = {
                "key": "utc",
                "source": "timestamp",
                "name": "Timestamp",
                "format": "utc",
                "hints": {
                    "domain": 1
                }
            };
            point.telemetry.values.push(timeValue);
            
            metadata.push(point);
        }

        return metadata;
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

        let dataKey = Object.keys(telemetry).find(k=>typeof telemetry[k]==="string" && telemetry[k].slice(0,2) === "\\x");

        let packedDataString = telemetry[dataKey];

        telemetryPoint.data = this.unpack(packedDataString);

        delete telemetry[dataKey];

        telemetryPoint.metadata = telemetry;

        let timestampKey = Object.keys(telemetryPoint.data).find(k => k.indexOf("timestamp") != -1 && typeof telemetryPoint.data[k] === "number" && 0 < telemetryPoint.data[k] < Date.now()/1000);

        telemetryPoint.timestamp = telemetryPoint.data[timestampKey];

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
