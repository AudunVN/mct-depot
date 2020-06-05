"use strict";

class TelemetryDefinition
{
    constructor(type)
    {
        this.type = type;
    }

    getMetadata() {
        return "Metadata not found for " + this.type;
    }

    parse(dataString) {
        return "Parsing not implemented for type " + this.type;
    }

    pack(object) {
        return "Packing not implemented for type " + this.type;
    }

    canPack(object) {
        return false;
    }

    unpack(string) {
        return "Unpacking not implemented for type " + this.type;
    }

    canUnpack(string) {
        return false;
    }
}

module.exports = TelemetryDefinition;
