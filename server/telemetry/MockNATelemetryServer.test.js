"use strict";

const MockServer = require('./MockNATelemetryServer');
const Config = require('../../shared/Config');
const Server = require('../Server');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const serverInstance = new Server(config);

config = new Config("state/config.json");
config.debug = true;

const def = {
    parser: "NA",
    fetcher: "NA",
    type: "fc",
    filePath: "samples/fc_test_archive_v.json"
};

const mockServer = new MockServer(def);

const testUrl = '/naTest';

serverInstance.server.use(testUrl, mockServer.router);

const request = supertest(serverInstance.server);

test('request without authorization header fails', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(403);
});

test('request with authorization header succeeds', async () => {
    const response = await request.get(testUrl).set('Authorization', 'abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});
