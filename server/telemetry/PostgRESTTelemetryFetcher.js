"use strict";

const fetch = require('node-fetch');
const TelemetryFetcher = require('./TelemetryFetcher.js');

class PostgRESTTelemetryFetcher extends TelemetryFetcher
{
    constructor(def, db, config, parser, callback)
    {
        super(def, db, config, parser, callback);

        let lastTimestamp = "";
    }

    async fetch() {
        let telemetry = [];

        try {
            let response = await fetch(this.def.url, {
                method: 'get',
                headers: { 'Authorization': 'Bearer' + this.def.bearerToken},
                timeout: 4471 // ms
            });

            telemetry = await response.json();
        } catch(exception) {
            console.log("[!] Error while getting data: " + exception.stack.split("\n")[0]);
        }

        return telemetry;
    }
}

module.exports = PostgRESTTelemetryFetcher;
