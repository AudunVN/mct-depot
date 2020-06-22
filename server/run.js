const MctDepot = require('./MctDepot');
const Config = require('../shared/Config');

const configInstance = new Config("state/config.json");
const depotInstance = new MctDepot(configInstance);

depotInstance.server.listen(configInstance.port, function () {
    console.log('Open MCT available at http://localhost:' + configInstance.port);
});
