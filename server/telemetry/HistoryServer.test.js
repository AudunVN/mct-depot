"use strict";

const HistoryServer = require('./HistoryServer');
const MctDepot = require('../MctDepot');
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

const parameters = {
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

const depotInstance = new MctDepot(config);
const historyServer = new HistoryServer(def, db, config);

const testUrl = '/' + def.type + '/history';

depotInstance.server.use(testUrl, historyServer.router);

const request = supertest(depotInstance.server);

test('history server responds to HTTP GET for fc data', async () => {
    const response = await request.get(testUrl + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
});

test('empty db returns empty result', async () => {
    const response = await request.get(testUrl + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
});

test('can get telemetry point from db', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.get(testUrl + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint]);
});

test('can get telemetry point value from db', async () => {
    const response = await request.get(testUrl + '/yes' + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].value).toEqual(telemetryPoint.data.yes);
});

test('can get multiple telemetry points from db', async () => {
    db.writer.write(telemetryPoint);

    const response = await request.get(testUrl + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([telemetryPoint,telemetryPoint]);
});

test('can get multiple telemetry point values from db', async () => {
    const response = await request.get(testUrl + '/yes' + '?startTime=' + parameters.startTime + "&endTime=" + parameters.endTime);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].value).toEqual(telemetryPoint.data.yes);
    expect(response.body[1].value).toEqual(telemetryPoint.data.yes);
});
