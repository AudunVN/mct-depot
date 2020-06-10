"use strict";

class TelemetryDefinition
{
    constructor(def)
    {
        this.def = def;
        this.type = def.type;
        this.name = def.name;
    }

    getMctMetadata() {
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
