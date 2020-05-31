"use strict";

class TelemetryDefinition
{
    constructor(id)
    {
        this.id = id;
    }

    getMetadataProvider() {
        return "Metadata provider not found for " + this.id;
    }

    getDataProvider() {
        return "Data provider not found for " + this.id;
    }

    pack(object) {
        return "Packing not implemented for type " + this.id;
    }

    canPack(object) {
        return false;
    }

    unpack(string) {
        return {errorMessage: "Unpacking not implemented for type " + this.id};
    }

    canUnpack(string) {
        return false;
    }
}

module.exports = TelemetryDefinition;
