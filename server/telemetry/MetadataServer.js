"use strict";

const express = require('express');

class MetadataServer
{
    constructor(def, metadata)
    {
        this.router = express.Router();
        this.router.use(express.json());

        this.def = def;
        this.metadata = metadata;

        this.start();
    }

    start()
    {
        let metadata = this.metadata;

        this.router.get('/', function (request, response) {
            response.status(200).send(metadata);
        });
    }

    stop()
    {
        this.router.get('/', function (request, response) {
            response.status(500).send({error: "Server closed"});
        });
    }
}

module.exports = MetadataServer;
