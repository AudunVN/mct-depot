"use strict";

const ConfigServer = require('./ConfigServer');
const Config = require('../../shared/Config');
const Server = require('../Server');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const serverInstance = new Server(config);

config = new Config("state/config.json");
config.debug = true;

const configServer = new ConfigServer(config);

configServer.start();

const testUrl = '/testconfig';

serverInstance.server.use(testUrl, configServer.router);

const request = supertest(serverInstance.server);

test('config server responds to HTTP GET for config', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(200);
});

test('config server returns expected config', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.parse(JSON.stringify(config)));
});
