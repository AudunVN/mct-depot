"use strict";

const TelemetryDefinition = require('./TelemetryDefinition.js');

class JsonTelemetryDefinition extends TelemetryDefinition
{
    constructor(type, structPath)
    {
        super(type);
    }

    parse(telemetryString) {
        let telemetryPoint = {
            type: this.type,
            timestamp: thistimestam,
            data: "",
            metadata: "",
            original: telemetryString
        }

        telemetryPoint.data = JSON.parse(telemetryString);
        
        telemetryPoint.timestamp = telemetryPoint.data.timestamp;

        delete telemetryPoint.data.timestamp;

        return telemetryPoint;
    }

    pack(object) {
        return JSON.stringify(object);
    }

    canPack(object) {
        return true;
    }

    unpack(string) {
        return JSON.parse(string);
    }

    canUnpack(string) {
        try {
            this.unpack(string);
        } catch(e) {
            return false;
        }

        return true;
    }
}

module.exports = JsonTelemetryDefinition;
