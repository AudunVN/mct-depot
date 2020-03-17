"use strict";

var express = require('express');

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

        return this.router;
    }

    start()
    {
        this.router.post('/', function (request, response) {
            let data = this.db.reader.read(this.def.type, request.body.startTime, request.body.endTime);

            // need to parse data and filter by points in request.body.points;

            response.status(200).json(data).end();
        });
    }

    stop()
    {
        this.router.post('/', function (req, res) {
            res.status(500).json({err: "Server closed"}).end();
        });
    }
}

module.exports = HistoryServer;
