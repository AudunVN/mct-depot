const MctDepot = require('./MctDepot');
const Config = require('../shared/Config');
const fs = require('fs');

const configPath = "state/config.json";

let configInstance = new Config("state/demo-config.json");

try {
    if (fs.existsSync(configPath)) {
        configInstance = new Config(configPath);
    } else {
        console.log("[!] Config file does not exist at " + configPath + ", loading demo config");
    }
} catch(exception) {
    console.log("[!] Error while loading config file from " + configPath + ": " + exception.stack.split("\n")[0]);
}

const depotInstance = new MctDepot(configInstance);

depotInstance.server.listen(configInstance.port, function () {
    console.log('Open MCT available at http://localhost:' + configInstance.port);
});
