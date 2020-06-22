"use strict";

class HistoryClient {
    installer(openmct) {
        let provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'mctdepot.telemetry';
            },
            request: function (domainObject, options) {
                let source = domainObject.identifier.key.split(".");
                let url = source[0] + '/history/' + source[1] + '?startTime=' + options.start + '&endTime=' + options.end;
    
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