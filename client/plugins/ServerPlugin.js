"use strict";

class ServerPlugin {
    constructor(config, metadata, openmct) {
        this.config = config;
        this.metadata = metadata;
        openmct.serverplugin = this;
    }

    installer(openmct) {
        let config = openmct.serverplugin.config;
        let metadata = openmct.serverplugin.metadata;

        /*config.roots.forEach((root) => {

        });*/

        openmct.objects.addRoot({
            namespace: 'omctserver',
            key: 'omctserver-root'
        });

        openmct.objects.addProvider('omctserver', {
            get: function (identifier) {
                if (identifier.key === "omctserver-root") {
                    return Promise.resolve({
                        identifier: identifier,
                        name: 'OpenMCT Server',
                        type: 'folder'
                    });
                }
            }
        });

        config.defs.forEach((def) => {
            let md = metadata.find(m => {
                return m.identifier.key === def.type;
            });

            console.log(md);

            openmct.types.addType('omctserver.' + def.type, {
                name: def.name,
                description: 'Telemetry point',
                cssClass: 'icon-telemetry'
            });

            console.log(config.defs.map(function (m) {
                return {
                    namespace: 'omctserver',
                    key: m.type
                };
            }));
    
            let compositionProvider = {
                appliesTo: function (domainObject) {
                    return domainObject.identifier.namespace === 'omctserver' &&
                           domainObject.type === 'folder';
                },
                load: function (domainObject) {
                    return {
                        then() {
                            return md.telemetry.values.map(function (m) {
                                return {
                                    namespace: 'omctserver',
                                    key: m.key
                                };
                            });
                        }
                    }
                }
            };
            
            openmct.composition.addProvider(compositionProvider);

            openmct.telemetry.addProvider("omctserver", openmct.serverplugin.getProvider(def));
        });

        console.log("OpenMCT client plugin installed");
    }

    getProvider(def) {
        let provider = {
            supportsSubscribe(domainObject, callback, options) { return false; },
            /* 
                optional. Must be implemented to provide realtime telemetry. Should return true if
                the provider supports subscriptions for the given domain object (and request options). 
            */

            subscribe(domainObject, callback, options) {},
            /* 
                required if supportsSubscribe is implemented. Establish a subscription for realtime data for 
                the given domain object. Should invoke callback with a single telemetry datum every time data 
                is received. Must return an unsubscribe function. Multiple views can subscribe to the same telemetry
                object, so it should always return a new unsubscribe function.
            */

            supportsRequest(domainObject, options) { return false; },
            /*
                optional. Must be implemented to provide historical telemetry. Should return true if
                the provider supports historical requests for the given domain object.
            */

            request(domainObject, options) {},
            /*
                required if supportsRequest is implemented. Must return a promise for an array of
                telemetry datums that fulfills the request. The options argument will include a
                start, end, and domain attribute representing the query bounds.
            */

            supportsMetadata(domainObject) { return false; },
            /*
                optional. Implement and return true for objects that you want to provide dynamic metadata for.
            */

            getMetadata(domainObject) {},
            /*
                required if supportsMetadata is implemented. Must return a valid telemetry
                metadata definition that includes at least one valueMetadata definition.
            */

            supportsLimits(domainObject) { return false; },
            /*
                optional. Implement and return true for domain objects that you want to provide a limit evaluator for.
            */

            getLimitEvaluator(domainObject) {}
            /*
                required if supportsLimits is implemented. Must return a valid LimitEvaluator for a given domain object.
            */
        }
        
        return provider;
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ServerPlugin;
} else {
    window.ServerPlugin = ServerPlugin;
}