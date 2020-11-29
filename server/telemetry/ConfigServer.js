"use strict";

const express = require('express');

class ConfigServer
{
    constructor(config, metadata, measurements)
    {
        this.router = express.Router();
        this.router.use(express.json());

        this.config = config;
        this.config.metadata = metadata;
        this.config.measurements = measurements;

        this.start();
    }

    getCleanConfig(object) {
        let input = object ? object : this.config;

        let clone = JSON.parse(JSON.stringify(input));

        for (let key in clone) {
            if (Object.prototype.hasOwnProperty.call(clone, key)) {
                let lowerKey = key.toLowerCase();

                if (lowerKey.indexOf("password") !== -1 || lowerKey.indexOf("secret") !== -1) {
                    delete clone[key];
                }
                else if (typeof clone[key] === "object")
                {
                    clone[key] = this.getCleanConfig(clone[key]);
                }
            }
        }

        return clone;
    }

    start()
    {
        let config = this.getCleanConfig();

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
