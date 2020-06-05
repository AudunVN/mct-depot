"use strict";

const express = require('express');
const DbPoller = require('../db/DbPoller');

class RealtimeServer
{
    constructor(def, db, config)
    {
        this.router = express.Router();
        this.db = db;
        this.config = config;

        this.def = def;
    }

    start()
    {
        this.router.ws('/', function (ws) {
            let dbPoller = new DbPoller(this.def, this.db, this.config, sendUpdate);
            let subscribedValues = {};
            let messageHandlers = {
                subscribe: function (id) {
                    subscribedValues[id] = true;
                },
                unsubscribe: function (id) {
                    delete subscribedValues[id];
                }
            };

            function sendUpdate(telemetry) {
                Object.keys(telemetry).forEach(function (valueName) {
                    if (subscribedValues[valueName]) {
                        ws.send(JSON.stringify(telemetry[valueName]));
                    }
                });
            }

            ws.on('message', function (message) {
                // need to parse message, apply subscribe/unsubscribe handlers
                messageHandlers;
            });

            ws.on('close', function () {
                dbPoller.destroy();
                dbPoller = null;
            });
        });
    }

    stop()
    {
        this.router.ws('/', function (ws) {
            ws.on('message', function (message) {
                ws.send("Server closed");
            });
        });
    }
}

module.exports = RealtimeServer;
