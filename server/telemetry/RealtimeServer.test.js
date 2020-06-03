"use strict";

const RealtimeServer = require('./RealtimeServer');
const Server = require('../Server');
const Config = require('../../shared/Config');
const supertest = require('supertest');
const DbManager = require('../db/DbManager');

let config = new Config();
config.debug = true;

const def = {
    parser: "JSON",
    fetcher: "JSON",
    type: "test"
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
const realtimeServer = new RealtimeServer(def, db, config);

realtimeServer.start();

const testUrl = '/' + def.type + '/realtime';

serverInstance.server.use(testUrl, realtimeServer.router);

const request = supertest(serverInstance.server);

test('realtime server responds to subscribe request', async () => {
    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
});

test('realtime server sends new data', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint]);
});

test('realtime server responds to unsubscribe request', async () => {
    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

test('can get multiple telemetry points from db', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.post(testUrl).send(body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint,telemetryPoint]);
});
