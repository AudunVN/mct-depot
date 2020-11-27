"use strict";

const MockServer = require('./MockPostgRESTTelemetryServer');
const Config = require('../../shared/Config');
const MctDepot = require('../MctDepot');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const depotInstance = new MctDepot(config);

config = new Config("state/config.json");
config.debug = true;

const def = {
    parser: "NA",
    fetcher: "PostgREST",
    type: "fc",
    filePath: "samples/fc_test_archive_v.json"
};

const mockServer = new MockServer(def);

const testUrl = '/naTest';

depotInstance.server.use(testUrl, mockServer.router);

const request = supertest(depotInstance.server);

test('request without authorization header fails', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(403);
});

test('request with authorization header succeeds', async () => {
    const response = await request.get(testUrl).set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('request for specific table succeeds', async () => {
    const response = await request.get(testUrl + "/fcTelemetryTable").set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('request for specific table and timespan succeeds', async () => {
    const fullResponse = await request.get(testUrl + "/fcTelemetryTable").set('Authorization', 'Bearer token_abc123');

    const cutoff = fullResponse.body[2].fca_complete_ts;

    const response = await request.get(testUrl + "/fcTelemetryTable" + "?fca_complete_ts=gte." + cutoff).set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeLessThan(fullResponse.body.length);
});
