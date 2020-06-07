"use strict";

const express = require('express');

class HistoryServer
{
    constructor(def, db, config)
    {
        this.router = express.Router();
        this.router.use(express.json());
        
        this.def = def;
        this.db = db;
        this.config = config;
        
        this.start();
    }

    start()
    {
        let db = this.db;
        let def = this.def;

        this.router.get('/', function (request, response) {
            let data = db.reader.read(def.type, request.query.startTime, request.query.endTime);
            response.status(200).send(data);
        });

        this.router.get('/:valueName', function (request, response) {
            let points = db.reader.read(def.type, request.query.startTime, request.query.endTime);

            let values = [];
            
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                
                let value = {
                    value: point.data[request.params.valueName],
                    timestamp: point.timestamp
                };

                values.push(value);
            }

            response.status(200).send(values);
        });
    }

    stop()
    {
        this.router.get('/', function (request, response) {
            response.status(500).json({error: "Server closed"}).send();
        });
    }
}

module.exports = HistoryServer;
