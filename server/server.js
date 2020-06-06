"use strict";

const StaticServer = require('./StaticServer');
const DbManager = require('./db/DbManager');
const TelemetryParser = require('../defs/TelemetryParser');
const TelemetryFetcher = require('./Telemetry/TelemetryFetcher');
const TelemetryServer = require('./Telemetry/TelemetryServer');

var bodyParser = require('body-parser')
const expressWs = require('express-ws');

class Server
{
    constructor(config)
    {
        this.server = require('express')();

        this.server.use(bodyParser.json())
        this.server.use(bodyParser.urlencoded({ extended: false }))

        expressWs(this.server);

        let db = new DbManager(config);

        let parser = new TelemetryParser(config.defs);

        let telemetryFetchers = [];

        let telemetryServers = [];

        let port = config.port || 8471;

        config.defs.forEach(function (def) {
            let telemetryFetcher = new TelemetryFetcher(def, config, db, parser);

            telemetryFetchers.push(telemetryFetcher);

            let telemetryServer = new TelemetryServer(def, config, db, parser);

            if (def.provides.realtime && typeof telemetryServer.realtimeServer !== "undefined") {
                this.server.use('/' + def.type + '/realtime', telemetryServer.realtimeServer);
                console.log(def.id.toUpperCase() + ' realtime available at ws://localhost:' + port + '/' + def.id + '/realtime');
            }

            if (def.provides.history && typeof telemetryServer.historyServer !== "undefined") {
                this.server.use('/' + def.type + '/history', telemetryServer.historyServer);
                console.log(def.id.toUpperCase() + ' history available at http://localhost:' + port + '/' + def.id + '/history');
            }

            telemetryServers.push(telemetryServer);
        });

        let staticServer = new StaticServer();

        this.server.use('/', staticServer);
    }
}

module.exports = Server;