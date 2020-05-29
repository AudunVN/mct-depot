"use strict";

const fs = require('fs');
const TelemetryFetcher = require('./TelemetryFetcher.js');

class JsonFileTelemetryFetcher extends TelemetryFetcher
{
    constructor(filePath)
    {
        let type = "json";
        
        super(type);

        this.filePath = filePath;
    }

    fetch() {
        let fileString = "";
        let data = [];

        try {
            fileString = fs.readFileSync(this.filePath, "utf8");
            data = JSON.parse(fileString); 
        } catch(exception) {
            console.log("Error while reading file: ", exception.stack);
        } 

        return data;
    }
}

module.exports = JsonFileTelemetryFetcher;
