"use strict";

const Config = require('./config');

const StaticServer = require('./static-server');
const DbManager = require('./db/DbManager');
const TelemetryParser = require('../defs/TelemetryParser');
const TelemetryFetcher = require('./Telemetry/TelemetryFetcher');
const TelemetryServer = require('./Telemetry/TelemetryServer');

const expressWs = require('express-ws');
const server = require('express')();

expressWs(server);

let config = new Config();

let db = new DbManager(config);

let parser = new TelemetryParser(config.defs);

let telemetryServers = [];

let port = config.port || 8471;

config.defs.forEach(function (def) {
    let telemetryFetcher = new TelemetryFetcher(def, config, db, parser);

    let telemetryServer = new TelemetryServer(def, config, db, parser);

    if (def.provides.realtime) {
        server.use('/' + def.id + '/realtime', telemetryServer.realtimeServer);
        console.log(def.id.toUpperCase() + ' realtime available at ws://localhost:' + port + '/' + def.id + '/realtime');
    }

    if (def.provides.history) {
        server.use('/' + def.id + '/history', telemetryServer.historyServer);
        console.log(def.id.toUpperCase() + ' history available at http://localhost:' + port + '/' + def.id + '/history');
    }

    telemetryServers.push(telemetryServer);
});

let staticServer = new StaticServer();

server.use('/', staticServer);

server.listen(port, function () {
    console.log('OpenMCT available at http://localhost:' + port);
});
