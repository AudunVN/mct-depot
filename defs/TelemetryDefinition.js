"use strict";

class TelemetryDefinition
{
    constructor(type)
    {
        this.type = type;
    }

    pack(object) {
        return "Packing not implemented for type " + this.type;
    }

    canPack(object) {
        return false;
    }

    unpack(string) {
        return {errorMessage: "Unpacking not implemented for type " + this.type};
    }

    canUnpack(string) {
        return false;
    }
}

module.exports = TelemetryDefinition;
