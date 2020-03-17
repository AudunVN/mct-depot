"use strict";

var express = require('express');
var DbPoller = require('../db/DbPoller');

class RealtimeServer
{
    constructor(def, db, config)
    {
        this.router = express.Router();
        this.db = db;
        this.config = config;

        this.def = def;

        this.start();

        return this.router;
    }

    start()
    {
        this.router.ws('/', function (ws) {
            var dbPoller = new DbPoller(this.def, this.db, this.config, sendUpdate);
            var subscribedValues = {};
            var messageHandlers = {
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
