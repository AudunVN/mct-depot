"use strict";

var Config = require('./config');

var StaticServer = require('./static-server');
var DbManager = require('./db/DbManager');

var expressWs = require('express-ws');
var server = require('express')();

expressWs(server);

var config = new Config();

var db = new DbManager();

var provider = new TelemetryProvider(config);

var parser = new TelemetryParser(config);

var telemetryServers = [];

var port = config.port || 8080;

config.defs.forEach(function (def) {
    // new TelemetryServer("eps/fc/pc", config, db, parser)
    var telemetryServer = new TelemetryServer(def, config, db, parser);

    server.use('/' + def.id + '/realtime', telemetryServer.realtimeServer);
    console.log(def.id.toUpperCase() + ' realtime available at ws://localhost:' + port + '/' + def.id + '/realtime');

    server.use('/' + def.id + '/history', telemetryServer.historyServer);
    console.log(def.id.toUpperCase() + ' history available at http://localhost:' + port + '/' + def.id + '/history');

    telemetryServers.push(telemetryServer);
});

var staticServer = new StaticServer();

server.use('/', staticServer);

server.listen(port, function () {
    console.log('OpenMCT available at http://localhost:' + port);
});
