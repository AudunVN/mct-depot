"use strict";

const fs = require('fs');
const bodyParser = require('body-parser')

class MockPostgRESTTelemetryServer
{
    constructor(def)
    {
        this.server = require('express')();

        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));

        this.def = def;

        this.start();
    }

    getData() {
        let fileString = "";
        let data = [];

        try {
            fileString = fs.readFileSync(this.def.filePath, "utf8");
            data = JSON.parse(fileString);
        } catch(exception) {
            console.log("[!] Error while reading file: " + exception.stack.split("\n")[0]);
        }

        return data;
    }

    start()
    {
        this.server.get('/', (request, response) => {
            if (typeof request.headers.authorization !== "undefined" && request.headers.authorization.indexOf("Bearer") !== -1) {
                let data = [{"id": 1, "message": "hi, this very real PostgREST server exists and you can access it!"}];
                response.status(200).send(data);
            } else {
                response.status(403).send();
            }
        });

        this.server.get('/:table', (request, response) => {
            if (typeof request.headers.authorization !== "undefined" && request.headers.authorization.indexOf("Bearer") !== -1) {
                let data = this.getData();

                let isFilteredQuery = false;

                for (var query in request.query) {
                    if (Object.prototype.hasOwnProperty.call(request.query, query) && request.query[query].indexOf("gte.") !== -1) {
                        isFilteredQuery = true;
                    }
                }

                if (isFilteredQuery) {
                    /* make returned data a bit shorter to pretend we've "filtered" it */
                    data.shift();
                }

                response.status(200).send(data);
            } else {
                response.status(403).send();
            }
        });
    }

    stop()
    {
        this.server.get('/', (request, response) => {
            response.status(500).send({error: "Server closed"});
        });
    }
}

module.exports = MockPostgRESTTelemetryServer;
