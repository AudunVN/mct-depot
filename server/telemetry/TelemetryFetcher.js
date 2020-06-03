"use strict";

class TelemetryFetcher
{
    constructor(def, db, config, parser, callback)
    {
        this.db = db;
        this.def = def;
        this.config = config;
        this.parser = parser;
        this.running = false;
        this.callback = this.store;

        if (typeof callback == "function") {
            this.callback = callback;
        }

        this.lastRunTime = 0;
    }

    start() {
        this.running = true;
        this.lastRunTime = Date.now();

        this.run();
    }

    store(points) {
        if (this.parser.canParse(this.def.type)) {
            for (let i = 0; i < points.length; i++) {
                let point = JSON.stringify(points[i]);

                let unpackedPoint = this.parser.parse(this.def.type, point);

                if (this.db.reader.isPointNew(unpackedPoint)) {
                    this.db.writer.write(unpackedPoint);
                }
            }
        } else {
            console.log("Cannot store point type " + this.def.type + ": No parser found");
        }
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
