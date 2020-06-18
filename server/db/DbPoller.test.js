"use strict";

const DbPoller = require('./DbPoller');
const DbManager = require('../db/DbManager');
const Config = require('../../shared/Config');

let config = new Config();
config.debug = true;

const def = {
    parser: "JSON",
    fetcher: "JSON",
    type: "test",
    dbPollRate: 100
};

let telemetryPoint = {
    type: "test",
    timestamp: Date.now(),
    data: {yes: true},
    metadata: {is_test: true},
    original: ""
};

let db = new DbManager(config);

test('adding data to db calls callback with data', done => {
    function callback(data) {
        expect(data).toEqual(telemetryPoint);
        done();
    }

    let poller = new DbPoller(def, db, config, callback);

    db.writer.write(telemetryPoint);

    poller.poll();
});
