"use strict";

const ConfigServer = require('./ConfigServer');
const Config = require('../../shared/Config');
const MctDepot = require('../MctDepot');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const depotInstance = new MctDepot(config);

config = new Config("state/config.json");
config.debug = true;

const configServer = new ConfigServer(config);

const testUrl = '/testconfig';

depotInstance.server.use(testUrl, configServer.router);

const request = supertest(depotInstance.server);

test('config server responds to HTTP GET for config', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(200);
});

test('config server returns expected config', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.parse(JSON.stringify(config)));
});
