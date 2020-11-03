"use strict";

const performance = require('perf_hooks').performance;

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

        if (typeof callback === "function") {
            this.callback = callback;
        }

        this.lastRunTime = 0;

        this.start();
    }

    start() {
        this.running = true;
        this.lastRunTime = Date.now();

        this.run();
    }

    store(points) {
        let writeCount = 0;

        let isNewTimeSum = 0;

        let startTime = performance.now();
        if (this.parser.canParse(this.def.type)) {
            for (let i = 0; i < points.length; i++) {
                let point = JSON.stringify(points[i]);

                let isNewStartTime = performance.now();
                let isPointNew = this.db.reader.isPointNew(this.def.type, point);
                let isNewEndTime = performance.now();

                isNewTimeSum += isNewEndTime - isNewStartTime;

                if (isPointNew) {
                    let unpackedPoint = this.parser.parse(this.def.type, point);
                    this.db.writer.write(unpackedPoint);
                    writeCount++;
                }
            }
        } else {
            console.log("Cannot store point type " + this.def.type + ": No parser found");
        }
        let endTime = performance.now();

        let totalTime = endTime - startTime;

        console.log("Stored " + writeCount + " new points in database out of " + points.length + " loaded points in " + totalTime.toFixed(2) + " ms");
        console.log("Used " + isNewTimeSum.toFixed(2) + " ms on checking if new (" + (isNewTimeSum/points.length).toFixed(5) + " ms/check on average), " + 100*(isNewTimeSum/totalTime).toFixed(4) + "% of total time");
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
