"use strict";

function getConfig() {
    return Promise.resolve(openmct.serverPlugin.config);
}

let objectProvider = {
    get: function (identifier) {
        return getConfig().then(function (config) {
            console.log(config);
            if (identifier.key === 'spacecraft') {
                return {
                    identifier: identifier,
                    name: dictionary.name,
                    type: 'folder',
                    location: 'ROOT'
                };
            } else {
                let measurement = config.measurements.filter(function (m) {
                    return m.key === identifier.key;
                })[0];

                return {
                    identifier: identifier,
                    name: measurement.name,
                    type: 'omctserver.telemetry',
                    telemetry: {
                        values: measurement.values
                    },
                    location: 'omctserver.taxonomy:spacecraft'
                };
            }
        });
    }
};

let compositionProvider = {
    appliesTo: function (domainObject) {
        return domainObject.identifier.namespace === 'omctserver.taxonomy' &&
               domainObject.type === 'folder';
    },
    load: function (domainObject) {
        return Promise.resolve(function (dictionary) {
            return dictionary.measurements.map(function (m) {
                return {
                    namespace: 'omctserver.taxonomy',
                    key: m.key
                };
            });
        });
    }
};

class DictionaryPlugin {
    constructor(config, metadata) {
        this.config = config;
        this.metadata = metadata;
    }

    installer(openmct) {
        let config = this.config || openmct.serverPlugin.config;
        let metadata = this.metadata || openmct.serverPlugin.metadata;

        openmct.objects.addRoot({
            namespace: 'omctserver.taxonomy',
            key: 'spacecraft'
        });

        openmct.objects.addProvider('omctserver.taxonomy', objectProvider);

        openmct.composition.addProvider(compositionProvider);

        openmct.types.addType('omctserver.telemetry', {
            name: 'Telemetry Point',
            description: 'Open MCT server telemetry point',
            cssClass: 'icon-telemetry'
        });

        console.log("Open MCT dictionary plugin installed");
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DictionaryPlugin;
} else {
    window.HistoryClient = DictionaryPlugin;
}
