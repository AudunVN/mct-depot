"use strict";

const fetch = require('node-fetch');
const TelemetryFetcher = require('./TelemetryFetcher.js');

class PostgRESTTelemetryFetcher extends TelemetryFetcher
{
    constructor(def, db, config, parser, callback)
    {
        super(def, db, config, parser, callback);

        this.lastPrimaryKey = 0;
    }

    async fetch() {
        let telemetry = [];

        try {
            let response = await fetch(this.def.url + "?" + this.def.primaryKeyField + "=gte." + this.lastPrimaryKey, {
                method: 'get',
                headers: { 'Authorization': 'Bearer ' + this.def.secrets.bearerToken},
                timeout: 4471 // ms
            });

            telemetry = await response.json();

            for (let i = 0; i < telemetry.length; i++) {
                let key = telemetry[i][this.def.primaryKeyField];
                if (typeof key !== "undefined" && key > this.lastPrimaryKey) {
                    this.lastPrimaryKey = key;
                }
            }

            console.log("Last " + this.def.type + " primary key: " + this.lastPrimaryKey);
        } catch(exception) {
            console.log("[!] Error while getting data: " + exception.stack.split("\n")[0]);
        }

        return telemetry;
    }
}

module.exports = PostgRESTTelemetryFetcher;
