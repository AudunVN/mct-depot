"use strict";

class RealtimeClient {
    installer(openmct) {
        let provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'mctdepot.telemetry';
            },
            subscribe: function (domainObject, callback) {
                let source = domainObject.identifier.key.split(".");
                let url = location.origin.replace(/^http/, 'ws') + "/" + source[0] + '/realtime/' + source[1];

                let socket = new WebSocket(url);

                console.log("Subscribed to " + url);

                socket.onmessage = function (data) {
                    let point = JSON.parse(data.data);

                    console.log("Received " + point);

                    callback(point);
                };

                return function unsubscribe() {
                    console.log("Unsubscribed from " + url);
                    socket.close();
                };
            }
        };

        openmct.telemetry.addProvider(provider);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = RealtimeClient;
} else {
    window.RealtimeClient = RealtimeClient;
}
