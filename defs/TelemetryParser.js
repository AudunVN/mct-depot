"use strict";

var TelemetryDefinition = require("./TelemetryDefinition");
var NATelemetryDefinition = require("./NATelemetryDefinition");

class TelemetryParser
{
    constructor(defs)
    {
        this.definitions = [];

        defs.forEach(function (def) {
            let definition = new TelemetryDefinition(def.id);

            if (def.type === "NA") {
                definition = new NATelemetryDefinition(def.id, def.structPath);
            }

            this.definitions.push(definition);
        });
    }

    getType(string) {
        this.definitions.forEach(function (def) {
            if (def.canUnpack(string)) {
                return def.type;
            }
        });

        return null;
    }

    getDefinition(type) {
        this.definitions.forEach(function (def) {
            if (def.type === type) {
                return def;
            }
        });

        return null;
    }
}

module.exports = TelemetryParser;
