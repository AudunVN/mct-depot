"use strict";

var RealtimeServer = require('../telemetry/RealtimeServer');
var HistoryServer = require('../telemetry/HistoryServer');

class TelemetryServer
{
    constructor(def, config, db)
    {
        this.db = db;
        this.def = def;
        this.config = config;

        this.realtimeServer = new RealtimeServer(this.def, this.db, this.config);
        this.historyServer = new HistoryServer(this.def, this.db, this.config);
    }

    start()
    {

    }

    stop()
    {

    }

    destroy()
    {
        this.db = null;
        this.def = null;
        this.config = null;

        this.realtimeServer = null;
        this.historyServer = null;
    }
}

module.exports = TelemetryServer;
