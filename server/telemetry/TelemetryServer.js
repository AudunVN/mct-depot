"use strict";

const RealtimeServer = require('../telemetry/RealtimeServer');
const HistoryServer = require('../telemetry/HistoryServer');

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
    }

    start()
    {
        this.running = true;

        this.realtimeServer.start();
        this.historyServer.start();
    }

    stop()
    {
        this.running = false;

        this.realtimeServer.stop();
        this.historyServer.stop();
    }

    destroy()
    {
        this.stop();

        this.db = null;
        this.def = null;
        this.config = null;

        this.realtimeServer = null;
        this.historyServer = null;
    }
}

module.exports = TelemetryServer;
