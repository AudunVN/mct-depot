"use strict";

class DbPoller
{
    constructor(def, db, config, callback)
    {
        this.db = db;
        this.def = def;
        this.config = config;
        this.callback = callback;
        this.polling = false;

        this.lastPollTime = 0;

        this.start();
    }

    start() {
        this.polling = true;
        this.lastPollTime = Date.now();

        this.poll();
    }

    poll() {
        if (this.polling) {
            let currentTime = Date.now();

            let results = this.db.reader.readByWriteTime(this.def.type, this.lastPollTime, currentTime);

            this.lastPollTime = currentTime;

            for (let i = 0; i < results.length; i++) {
                this.callback(results[i]);
            }

            setTimeout(() => {
                this.poll();
            }, this.def.dbPollRate);
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

module.exports = DbPoller;
