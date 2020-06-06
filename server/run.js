const Server = require('./Server');
const Config = require('../shared/Config');

const configInstance = new Config("state/config.json");
const serverInstance = new Server(configInstance);

serverInstance.server.listen(configInstance.port, function () {
    console.log('OpenMCT available at http://localhost:' + configInstance.port);
});
