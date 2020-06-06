"use strict";

class MctPlugin {
    constructor(config) {
        this.config = config;
    }

    install(openmct) {
        let config = this.config;

         // add root object (accessible from left side panel)
        openmct.objects.addRoot({
            namespace: 'hypso',
            key: 'spacecraft'
        });

        config.defs.forEach((def) => {
            openmct.telemetry.addProvider(this.getProvider(def));
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
    module.exports = MctPlugin;
} else {
    window.MctPlugin = MctPlugin;
}