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

        // expand array values
        let uncompressedData = this.context.telemetry.fields;

        for (let [key, value] of Object.entries(this.context.telemetry.fields)) {
            let lengthMatch = value.type.match(/([^[]*)\[(\d+)\]/);
            let arrayLength = 0;

            if (lengthMatch !== null && typeof lengthMatch[2] !== "undefined") {
                arrayLength = lengthMatch[2];
            }

            if (arrayLength !== 0) {
                for (let i = 0; i < arrayLength; i++) {
                    let fieldName = key + "_" + i + "_AutoExpanded";
                    uncompressedData[fieldName] = {
                        name: fieldName,
                        type: lengthMatch[1],
                        bytes: value.bytes/arrayLength
                    };
                }
                delete uncompressedData[key];
            }
        }

        for (const field of Object.values(uncompressedData)) {
            /*
                uncomment to log all fields in the format used for config.json

                console.log('{\n    "key": "' + field.name + '",\n    "name": "'+ field.name + '"\n},');
            */

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
                "hints": {
                    "range": 1
                }
            };

            let timeValue = {
                "key": "utc",
                "source": "timestamp",
                "name": "Timestamp",
                "format": "utc",
                "hints": {
                    "domain": 1
                }
            };

            let defField = null;

            try {
                defField = this.def.metadata.values.find(function (m) {
                    return m.key === field.name;
                });
            } catch(e) {
                /* no metadata stored for field */
            }

            let isArrayValue = false;

            if (defField === null && field.name.indexOf("_AutoExpanded") !== -1) {
                /* autoexpanded field, check if entry exists for parent array */

                let parentName = field.name.replace(/_\d+_AutoExpanded/, "");

                try {
                    defField = this.def.metadata.values.find(function (m) {
                        return m.key === parentName;
                    });
                } catch(e) {
                    /* no metadata stored for parent field */
                }

                if (defField !== null) {
                    isArrayValue = true;
                }
            }

            if (defField) {
                /* load value metadata from config */

                /*
                    defField sample:
                    {
                        "key": "bootCount",
                        "name": "Boot Count",
                        "units": "kilograms",
                        "format": "float",
                        "min": 0,
                        "max": 100,
                        "hints": {
                            "range": 1
                        }
                    }
                */

                if (typeof defField.name !== "undefined") {
                    point.name = defField.name;

                    if (isArrayValue) {
                        point.name += " " + field.name.match(/_(\d+)_AutoExpanded/)[1];
                    }
                }

                if (typeof defField.units !== "undefined") {
                    value.units = defField.units;
                }

                if (typeof defField.format !== "undefined") {
                    value.format = defField.format;
                }

                if (typeof defField.min !== "undefined") {
                    value.min = defField.min;
                }

                if (typeof defField.max !== "undefined") {
                    value.max = defField.max;
                }

                if (typeof defField.enumerations !== "undefined") {
                    value.enumerations = defField.enumerations;
                }
            }

            point.telemetry.values.push(value);
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

        let timestampKey = Object.keys(telemetryPoint.data).find(k => k.indexOf("timestamp") !== -1 && typeof telemetryPoint.data[k] === "number" && 0 < telemetryPoint.data[k] < Date.now()/1000);

        telemetryPoint.timestamp = telemetryPoint.data[timestampKey]*1000;

        return telemetryPoint;
    }

    pack(data) {
        // compress expanded array values
        let compressedData = data;

        /*for (let [key, value] of Object.entries(unpackedData)) {
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    uncompressedData[key + "Auto471Exp" + i] = value[i];
                }
                delete uncompressedData[key];
            }
        }*/

        let packedData = "\\x" + this.context.telemetry.toBinary(compressedData).toString("hex")
        return packedData;
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

        let unpackedData = this.context.telemetry.fromBinary(buffer);

        // expand array values
        let uncompressedData = unpackedData;

        for (let [key, value] of Object.entries(unpackedData)) {
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    uncompressedData[key + "_" + i + "_AutoExpanded"] = value[i];
                }
                delete uncompressedData[key];
            }
        }

        return uncompressedData;
    }

    canUnpack(packedDataString) {
        let buffer = this.getDataBuffer(packedDataString);

        return (Buffer.byteLength(buffer) === this.byteLength);
    }
}

module.exports = NATelemetryDefinition;
