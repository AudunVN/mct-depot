"use strict";

const MctDepot = require('./MctDepot');
const Config = require('../shared/Config');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const depotInstance = new MctDepot(config);
const request = supertest(depotInstance.server);

test('static server responds to HTTP GET', async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
});

test('static server responds with OpenMCT index page', async () => {
    const response = await request.get("/");
    expect(response.text.indexOf("openmct")).not.toBe(-1);
});
