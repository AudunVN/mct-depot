"use strict";

const TelemetryDefinition = require('./TelemetryDefinition.js');

class JsonTelemetryDefinition extends TelemetryDefinition
{
    constructor(type, structPath)
    {
        super(type);
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
