"use strict";

const StaticServer = require('./StaticServer');
const ConfigServer = require('../server/telemetry/ConfigServer');
const DbManager = require('./db/DbManager');
const TelemetryParser = require('../defs/TelemetryParser');
const TelemetryFetcher = require('./telemetry/TelemetryFetcher');
const TelemetryServer = require('./telemetry/TelemetryServer');
const JsonFileTelemetryFetcher = require('./telemetry/JsonFileTelemetryFetcher');

var bodyParser = require('body-parser')
const expressWs = require('express-ws');

class Server
{
    constructor(config)
    {
        this.server = require('express')();

        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));

        expressWs(this.server);

        let db = new DbManager(config);

        let parser = new TelemetryParser(config.defs);

        let telemetryFetchers = [];

        let telemetryServers = [];

        let port = config.port || 8471;
        
        let configUrl = '/config';
        let configServer = new ConfigServer(config, parser.getAllMctMetadata());
        
        this.server.use(configUrl, configServer.router);
        console.log('server config available at http://localhost:' + port + configUrl);

        config.defs.forEach((def) => {
            let telemetryFetcher = new TelemetryFetcher(def, config, db, parser);

            if (def.fetcher == "JSON") {
                telemetryFetcher = new JsonFileTelemetryFetcher(def, db, config, parser);
            }

            telemetryFetchers.push(telemetryFetcher);

            let telemetryServer = new TelemetryServer(def, config, db, parser);

            if (def.provides.realtime && typeof telemetryServer.realtimeServer !== "undefined") {
                let realtimeUrl = '/' + def.type + '/realtime';

                this.server.use(realtimeUrl, telemetryServer.realtimeServer.router);
                console.log(def.type + ' realtime available at ws://localhost:' + port + realtimeUrl);
            }

            if (def.provides.history && typeof telemetryServer.historyServer !== "undefined") {
                let historyUrl = '/' + def.type + '/history';

                this.server.use(historyUrl, telemetryServer.historyServer.router);
                console.log(def.type + ' history available at http://localhost:' + port + historyUrl);
            }

            if (def.provides.metadata && typeof telemetryServer.metadataServer !== "undefined") {
                let metadataUrl = '/' + def.type + '/metadata';

                this.server.use(metadataUrl, telemetryServer.metadataServer.router);
                console.log(def.type + ' metadata available at http://localhost:' + port + metadataUrl);
            }

            telemetryServers.push(telemetryServer);
        });

        let staticServer = new StaticServer();

        this.server.use('/', staticServer);
    }
}

module.exports = Server;