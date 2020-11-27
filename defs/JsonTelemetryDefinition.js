"use strict";

const TelemetryDefinition = require('./TelemetryDefinition.js');

class JsonTelemetryDefinition extends TelemetryDefinition
{
    constructor(def)
    {
        super(def);
    }

    parse(telemetryString) {
        let telemetryPoint = {
            type: this.type,
            timestamp: this.timestamp,
            data: "",
            metadata: "",
            original: telemetryString
        }

        telemetryPoint.data = this.unpack(telemetryString);

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
