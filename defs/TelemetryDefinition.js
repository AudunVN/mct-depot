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

    isPackable(object) {
        return false;
    }

    unpack(string) {
        return {errorMessage: "Unpacking not implemented for type " + this.type};
    }

    isUnpackable(object) {
        return false;
    }
}

module.exports = TelemetryDefinition;
