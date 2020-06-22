"use strict";

const MctDepot = require('./MctDepot');
const Config = require('../shared/Config');
const supertest = require('supertest');

let config = new Config();
config.debug = true;

const serverInstance = new MctDepot(config);
const request = supertest(serverInstance.server);

test('static server responds to HTTP GET', async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(200);
});
