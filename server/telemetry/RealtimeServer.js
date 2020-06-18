"use strict";

const express = require('express');
const DbPoller = require('../db/DbPoller');
const { v4: uuidv4 } = require('uuid');

class RealtimeServer
{
    constructor(def, db, config)
    {
        this.router = express.Router();

        this.db = db;
        this.config = config;
        this.def = def;
        this.clients = {};

        this.poller = new DbPoller(this.def, this.db, this.config, (telemetry) => {
            this.sendUpdate(telemetry);
        });

        this.start();
    }

    start()
    {
        this.router.ws('/:valueName', (ws, req) => {
            let key = req.params.valueName;
            if (typeof this.clients[key] == "undefined") {
                this.clients[key] = [];
            }

            ws.uid = uuidv4();
            this.clients[key].push(ws);

            this.poller.poll();

            ws.on('message', (message) => {
                /* for testing, echos input */
                ws.send(message);
            });

            ws.on('close', () => {
                this.clients[key] = this.clients[key].filter((client) => {
                    return client.uid != ws.uid;
                });
            });
        });
    }
    
    sendUpdate(telemetry) {
        let keys = Object.keys(telemetry.data);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (typeof this.clients[key] !== "undefined") {
                this.clients[key].forEach(function (client) {
                    let point = {
                        value: telemetry.data[key],
                        timestamp: telemetry.timestamp
                    };
    
                    client.send(JSON.stringify(point));
                });
            }
        }
    }

    stop()
    {
        this.ws = this.router.ws('/', function (ws) {
            ws.on('message', function (message) {
                ws.send("Server closed");
            });
        });

        dbPoller.destroy();
        dbPoller = null;
    }
}

module.exports = RealtimeServer;
