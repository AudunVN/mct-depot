"use strict";

const TelemetryDefinition = require("./TelemetryDefinition");
const NATelemetryDefinition = require("./NATelemetryDefinition");
const JsonTelemetryDefinition = require("./JsonTelemetryDefinition");

class TelemetryParser
{
    constructor(defs)
    {
        this.definitions = [];

        defs.forEach((def) => {
            let definition = new TelemetryDefinition(def.id);

            if (def.type === "NA") {
                definition = new NATelemetryDefinition(def.id, def.structPath);
            }

            if (def.type === "JSON") {
                definition = new JsonTelemetryDefinition(def.id);
            }

            this.definitions.push(definition);
        });
    }

    getType(string) {
        let result = null;
        
        this.definitions.forEach(function (def) {
            if (def.canUnpack(string)) {
                result = def.id;
            }
        });

        return result;
    }

    getDefinition(id) {
        let result = null;

        this.definitions.forEach(function (def) {
            if (def.id === id) {
                result = def;
            }
        });

        return result;
    }
}

module.exports = TelemetryParser;
