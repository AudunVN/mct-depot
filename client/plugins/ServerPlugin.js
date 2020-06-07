"use strict";

class ServerPlugin {
    constructor(config, metadata) {
        this.config = config;
        this.metadata = metadata;
    }

    installer(openmct) {
        let config = openmct.serverPlugin.config;
        let metadata = openmct.serverPlugin.metadata;

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

            openmct.types.addType('omctserver.' + md.identifier.key, {
                name: def.name,
                description: 'Telemetry point',
                cssClass: 'icon-telemetry'
            });

            console.log(openmct.types);

            console.log(md.telemetry.values.map(function (m) {
                return {
                    namespace: 'omctserver',
                    key: m.key
                };
            }));
    
            let compositionProvider = {
                appliesTo: function (domainObject) {
                    return domainObject.identifier.namespace === 'omctserver' &&
                           domainObject.type === 'folder';
                },
                load: function (domainObject) {
                    return Promise.resolve(
                        md.telemetry.values.map(function (m) {
                            return {
                                namespace: 'omctserver.' + md.identifier.key,
                                key: m.key
                            };
                        })
                    );
                }
            };
            
            openmct.composition.addProvider(compositionProvider);
            
            openmct.objects.addProvider('omctserver.' + md.identifier.key, {
                get: function (identifier) {
                    if (identifier.namespace === 'omctserver.' + md.identifier.key) {
                        return Promise.resolve({
                            identifier: identifier,
                            name: identifier.key,
                            type: 'omctserver.' + md.identifier.key
                        });
                    }
                }
            });

            openmct.telemetry.addProvider(openmct.serverPlugin.getProvider(def));
        });

        console.log("OpenMCT client plugin installed");
    }

    getProvider(def) {
        let provider = {
            supportsSubscribe(domainObject, callback, options) {
                console.log("Supports subscribe: " + domainObject);
                return false;
            },
            /* 
                optional. Must be implemented to provide realtime telemetry. Should return true if
                the provider supports subscriptions for the given domain object (and request options). 
            */

            subscribe(domainObject, callback, options) {
                console.log("Subscribe: " + domainObject);
            },
            /* 
                required if supportsSubscribe is implemented. Establish a subscription for realtime data for 
                the given domain object. Should invoke callback with a single telemetry datum every time data 
                is received. Must return an unsubscribe function. Multiple views can subscribe to the same telemetry
                object, so it should always return a new unsubscribe function.
            */

            supportsRequest(domainObject, options) { 
                console.log("Supports request: " + domainObject);
                return false;
            },
            /*
                optional. Must be implemented to provide historical telemetry. Should return true if
                the provider supports historical requests for the given domain object.
            */

            request(domainObject, options) {
                console.log("Request: " + domainObject);
            },
            /*
                required if supportsRequest is implemented. Must return a promise for an array of
                telemetry datums that fulfills the request. The options argument will include a
                start, end, and domain attribute representing the query bounds.
            */

            supportsMetadata(domainObject) { 
                console.log("Supports metadata: " + domainObject);
                let identifier = domainObject.identifier;
                console.log(identifier.namespace + " - " + identifier.key);

                let metadata = openmct.serverPlugin.metadata;
                console.log(metadata);

                let defMd = metadata.find(m => {
                    return m.identifier.namespace === identifier.namespace;
                });

                console.log(defMd);

                return (typeof defMd !== "undefined");
            },
            /*
                optional. Implement and return true for objects that you want to provide dynamic metadata for.
            */

            getMetadata(domainObject) {
                console.log("Get metadata: " + domainObject);
                let identifier = domainObject.identifier;
                console.log(identifier.namespace + " - " + identifier.key);

                let metadata = openmct.serverPlugin.metadata;
                console.log(metadata);

                let defMd = metadata.find(m => {
                    return m.identifier.namespace === identifier.namespace;
                });

                console.log(defMd.telemetry);

                return defMd.telemetry;
            },
            /*
                required if supportsMetadata is implemented. Must return a valid telemetry
                metadata definition that includes at least one valueMetadata definition.
            */

            supportsLimits(domainObject) {
                console.log("Supports limits: " + domainObject);
                return false;
            },
            /*
                optional. Implement and return true for domain objects that you want to provide a limit evaluator for.
            */

            getLimitEvaluator(domainObject) {
                console.log("Get limits: " + domainObject);
            }
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