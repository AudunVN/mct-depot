"use strict";

class TelemetryFetcher
{
    constructor(def, db, config, callback)
    {
        this.db = db;
        this.def = def;
        this.config = config;
        this.callback = callback;
        this.polling = false;

        this.lastPollTime = 0;
    }

    start() {
        this.polling = true;
        this.lastPollTime = Date.now();

        this.poll();
    }

    poll() {
        if (this.polling) {
            let currentTime = Date.now();

            let results = this.db.read(this.def.type, this.lastPollTime, currentTime);

            this.lastPollTime = currentTime;

            if (results.length > 0) {
                this.callback(results);
            }

            setTimeout(this.poll, this.config.dbPollRate);
        }
    }

    stop() {
        this.polling = false;
    }

    destroy() {
        this.stop();

        this.db = null;
        this.def = null;
        this.config = null;
        this.callback = null;
    }
}

module.exports = TelemetryFetcher;
