"use strict";

const fs = require('fs');
const TelemetryFetcher = require('./TelemetryFetcher.js');

class JsonFileTelemetryFetcher extends TelemetryFetcher
{
    constructor(def, db, config, parser, callback)
    {
        super(def, db, config, parser, callback);
    }

    fetch() {
        let fileString = "";
        let data = [];

        try {
            fileString = fs.readFileSync(this.def.filePath, "utf8");
            data = JSON.parse(fileString); 
        } catch(exception) {
            console.log("[!] Error while reading file: " + exception.stack.split("\n")[0]);
        } 

        return data;
    }
}

module.exports = JsonFileTelemetryFetcher;
