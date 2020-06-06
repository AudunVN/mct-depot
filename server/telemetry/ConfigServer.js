"use strict";

const express = require('express');

class ConfigServer
{
    constructor(config)
    {
        this.router = express.Router();
        this.router.use(express.json());

        this.config = config;
    }

    start()
    {
        let config = this.config;
        
        this.router.get('/', function (request, response) {
            response.status(200).send(config);
        });
    }

    stop()
    {
        this.router.get('/', function (request, response) {
            response.status(500).send({error: "Server closed"});
        });
    }
}

module.exports = ConfigServer;
