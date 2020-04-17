"use strict";

const fs = require('fs');
const TelemetryFetcher = require('./TelemetryFetcher.js');

class FileTelemetryFetcher extends TelemetryFetcher
{
    constructor(type, filePath)
    {
        super(type);

        this.filePath = filePath;
    }

    fetch() {
        let fileString = "";

        try {
            fileString = fs.readFileSync(this.filePath, "utf8");
        } catch(e) {
            console.log("Error while reading file: ", e.stack);
        }

        return JSON.parse(fileString);
    }
}

module.exports = FileTelemetryFetcher;
