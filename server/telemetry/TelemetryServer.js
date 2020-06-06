"use strict";

const RealtimeServer = require('../telemetry/RealtimeServer');
const HistoryServer = require('../telemetry/HistoryServer');
const MetadataServer = require('../telemetry/MetadataServer');

class TelemetryServer
{
    constructor(def, config, db)
    {
        this.db = db;
        this.def = def;
        this.config = config;

        this.running = false;

        this.realtimeServer = new RealtimeServer(this.def, this.db, this.config);
        this.historyServer = new HistoryServer(this.def, this.db, this.config);
        this.metadataServer = new MetadataServer(this.def, this.db, this.config);

        this.start();
    }

    start()
    {
        this.running = true;

        this.realtimeServer.start();
        this.historyServer.start();
        this.metadataServer.start();
    }

    stop()
    {
        this.running = false;

        this.realtimeServer.stop();
        this.historyServer.stop();
        this.metadataServer.stop();
    }

    destroy()
    {
        this.stop();

        this.db = null;
        this.def = null;
        this.config = null;

        this.realtimeServer = null;
        this.historyServer = null;
        this.metadataServer = null;
    }
}

module.exports = TelemetryServer;
