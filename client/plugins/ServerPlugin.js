"use strict";

class ServerPlugin {
    constructor(config, metadata) {
        this.config = config;
        this.metadata = metadata;
    }

    installer(openmct) {
        let config = this.config || openmct.serverPlugin.config;
        let metadata = this.metadata || openmct.serverPlugin.metadata;

        console.log("Open MCT server plugin installed");
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ServerPlugin;
} else {
    window.ServerPlugin = ServerPlugin;
}