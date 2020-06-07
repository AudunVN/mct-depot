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
    }

    stop()
    {
        this.router.get('/', function (request, response) {
            response.status(500).json({error: "Server closed"}).send();
        });
    }
}

module.exports = HistoryServer;
