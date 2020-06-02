"use strict";

const TelemetryDefinition = require("./TelemetryDefinition");
const NATelemetryDefinition = require("./NATelemetryDefinition");
const JsonTelemetryDefinition = require("./JsonTelemetryDefinition");

class TelemetryParser
{
    constructor(definitions)
    {
        this.definitions = [];

        definitions.forEach((def) => {
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

    canParse(type) {
        return (this.getDefinition(type) != null);
    }

    parse(type, dataString) {
        let definition = this.getDefinition(type);

        return definition.parse(dataString);
    }

    getType(string) {
        let result = null;
        
        this.definitions.forEach(function (def) {
            if (def.canUnpack(string)) {
                result = def.type;
            }
        });

        return result;
    }

    getDefinition(type) {
        let result = null;

        this.definitions.forEach(function (def) {
            if (def.type === type) {
                result = def;
            }
        });

        return result;
    }
}

module.exports = TelemetryParser;
