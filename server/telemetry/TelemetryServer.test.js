"use strict";

const TelemetryServer = require('./TelemetryServer');
const DbManager = require('../db/DbManager');
const Config = require('../../shared/Config');

let config = new Config();
config.debug = true;
config.port = 8473;

const def = {
    parser: "NA",
    fetcher: "JSON",
    type: "fc",
    structPath: "defs/structs/fc_v0.0.3_GeneralT_file.txt",
    filePath: ""
};

let db = new DbManager(config);

test('can create telemetry server', async () => {
    let server = new TelemetryServer(def, config, db);

    expect(server.running).toBe(false);
});

test('can start telemetry server', async () => {
    let server = new TelemetryServer(def, config, db);
    server.start();

    expect(server.running).toBe(true);
});

test('can stop telemetry server', async () => {
    let server = new TelemetryServer(def, config, db);
    server.stop();

    expect(server.running).toBe(false);
});

test('can destroy telemetry server', async () => {
    let server = new TelemetryServer(def, config, db);
    server.destroy();

    expect(server.def).toEqual(null);
});