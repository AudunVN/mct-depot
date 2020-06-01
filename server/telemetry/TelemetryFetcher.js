"use strict";

class TelemetryFetcher
{
    constructor(def, db, config, callback)
    {
        this.db = db;
        this.def = def;
        this.config = config;
        this.callback = callback;
        this.running = false;

        this.lastRunTime = 0;
    }

    start() {
        this.running = true;
        this.lastRunTime = Date.now();

        this.run();
    }

    store() {
        let results = manager.reader.read(type, timestamp, timestamp);
        this.db.writer.write();
    }

    fetch() {
        return {errorMessage: "Fetching not implemented for type " + this.def.type};
    }

    run() {
        if (this.running) {
            let currentTime = Date.now();

            let results = this.fetch();

            this.lastRunTime = currentTime;

            if (results.length > 0) {
                this.callback(results);
            }

            setTimeout(this.run, this.def.fetchRate);
        }
    }

    stop() {
        this.running = false;
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
