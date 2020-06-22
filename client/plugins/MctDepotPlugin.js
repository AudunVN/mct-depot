"use strict";

function getConfig() {
    return Promise.resolve(openmct.mctDepotPlugin.config);
}

let objectProvider = {
    get: function (identifier) {
        return getConfig().then(function (config) {
            if (identifier.key.indexOf(".rootfolder") != -1) {
                let def = config.defs.find(function (d) {
                    return d.type === identifier.key.split(".")[0];
                });

                return {
                    identifier: identifier,
                    name: def.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                let measurement = config.measurements.find(function (m) {
                    return m.key === identifier.key;
                });

                let type = "";

                if (typeof measurement === "undefined") {
                    console.log("Could not find measurement for " + identifier.key);
                }

                if (identifier.key.indexOf(".") != -1) {
                    type = identifier.key.split(".")[0];
                }

                let telemetryObject = {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'mctdepot.telemetry',
                    telemetry: {
                        values: measurement.telemetry.values
                    },
                    location: 'mctdepot.taxonomy:' + type + ".rootfolder"
                };

                return telemetryObject;
            }
        });
    }
};

let compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'mctdepot.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        console.log(domainObject);
        return getConfig().then(function (config) {
            return config.measurements.filter(function (m) {
                return m.key.split(".")[0] === domainObject.identifier.key.split(".")[0];
            }).map(function (m) {
                return {
                    namespace: 'mctdepot.taxonomy',
                    key: m.key
                };
            });
        });
    }
};

class MctDepotPlugin {
    constructor(config, metadata) {
        this.config = config;
        this.metadata = metadata;
    }

    installer(openmct) {
        let config = openmct.mctDepotPlugin.config;

        for (let i = 0; i < config.defs.length; i++) {
            let def = config.defs[i];

            openmct.objects.addRoot({
                namespace: 'mctdepot.taxonomy',
                key: def.type + '.rootfolder'
            });
        }

        openmct.objects.addProvider('mctdepot.taxonomy', objectProvider);

        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('mctdepot.telemetry', {
            name: 'Telemetry Point',
            description: 'MCT Depot telemetry point',
            cssClass: 'icon-telemetry'
        });

        console.log("MCT Depot plugin installed");
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MctDepotPlugin;
} else {
    window.MctDepotPlugin = MctDepotPlugin;
}
