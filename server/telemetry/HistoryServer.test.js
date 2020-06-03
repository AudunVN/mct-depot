"use strict";

const HistoryServer = require('./HistoryServer');
const Server = require('../Server');
const Config = require('../../shared/Config');
const supertest = require('supertest');
const DbManager = require('../db/DbManager');

let config = new Config();
config.debug = true;

const def = {
    parser: "JSON",
    fetcher: "JSON",
    type: "test",
    structPath: "defs/structs/fc_v0.0.3_GeneralT_file.txt",
    filePath: ""
};

const body = {
    startTime: 0,
    endTime: 9999999999999999
};

let telemetryPoint = {
    type: "test",
    timestamp: Date.now(),
    data: {yes: true},
    metadata: {is_test: true},
    original: ""
};

let db = new DbManager(config);

const serverInstance = new Server(config);
const historyServer = new HistoryServer(def, db, config);

historyServer.start();

const testUrl = '/' + def.type + '/history';

serverInstance.server.use(testUrl, historyServer.router);

const request = supertest(serverInstance.server);

test('history server responds to HTTP POST for fc data', async () => {
    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
});

test('empty db returns empty result', async () => {
    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

test('can get telemetry point from db', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint]);
});

test('can get telemetry points from db', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint,telemetryPoint]);
});