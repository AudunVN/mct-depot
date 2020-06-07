"use strict";

function DictionaryPlugin(config) {
    return function install (openmct) {
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'omctserver.telemetry';
            },
            request: function (domainObject, options) {
                var url = domainObject.identifier.key + '/history/?startTime=' + options.start + '&endTime=' + options.end;
    
                return http.get(url)
                .then(function (response) {
                    return response.data;
                });
            }
        };
    
        openmct.telemetry.addProvider(provider);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = DictionaryPlugin;
} else {
    window.HistoryClient = DictionaryPlugin;
}