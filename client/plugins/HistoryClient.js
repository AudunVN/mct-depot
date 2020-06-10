"use strict";

function HistoryClient(config) {
    return function install (openmct) {
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'omctserver.telemetry';
            },
            request: function (domainObject, options) {
                var url = domainObject.identifier.key + '/history/?startTime=' + options.start + '&endTime=' + options.end;
    
                return fetch(url).then(function (response) {
                    return response.json();
                });
            }
        };
    
        openmct.telemetry.addProvider(provider);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = HistoryClient;
} else {
    window.HistoryClient = HistoryClient;
}