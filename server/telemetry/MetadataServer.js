"use strict";

const express = require('express');

class MetadataServer
{
    constructor(def)
    {
        this.router = express.Router();
        this.router.use(express.json());
        
        this.def = def;
    }

    start()
    {
        let def = this.def;

        this.router.post('/', function (request, response) {
            let metadata = db.reader.read(def.type, request.body.startTime);
            response.status(200).send(metadata);
        });
    }

    stop()
    {
        this.router.post('/', function (request, response) {
            response.status(500).json({error: "Server closed"}).send();
        });
    }
}

module.exports = MetadataServer;
