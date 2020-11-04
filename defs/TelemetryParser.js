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
            let definition = new TelemetryDefinition(def);

            if (def.parser === "NA") {
                definition = new NATelemetryDefinition(def);
            }

            if (def.parser === "JSON") {
                definition = new JsonTelemetryDefinition(def);
            }

            this.definitions.push(definition);
        });
    }

    canParse(type) {
        return (this.getDefinition(type) !== null);
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

    getAllMctMetadata() {
        let results = [];

        this.definitions.forEach(function (def) {
            let metadata = {
                name: def.name,
                key: def.type,
                measurements: def.getMctMetadata()
            };

            results.push(metadata);
        });

        return results;
    }

    getAllMctMeasurements() {
        let results = [];

        this.definitions.forEach(function (def) {
            results = results.concat(def.getMctMetadata());
        });

        return results;
    }
}

module.exports = TelemetryParser;
