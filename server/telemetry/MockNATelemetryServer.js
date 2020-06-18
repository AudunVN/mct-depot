"use strict";

const express = require('express');
const fs = require('fs');

class MockNATelemetryServer
{
    constructor(def)
    {
        this.router = express.Router();
        this.router.use(express.json());

        this.def = def;
        
        this.start();
    }

    getData() {
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

    start()
    {
        this.router.get('/', (request, response) => {
            if (typeof request.headers.authorization !== "undefined") {
                let data = this.getData();
                console.log(data);
                response.status(200).send(data);
            } else {
                response.status(403).send();
            }
        });
    }

    stop()
    {
        this.router.get('/', (request, response) => {
            response.status(500).send({error: "Server closed"});
        });
    }
}

module.exports = MockNATelemetryServer;
