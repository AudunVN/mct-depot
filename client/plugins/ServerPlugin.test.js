"use strict";

const Config = require('../../shared/Config');
const ServerPlugin = require('./ServerPlugin');

const config = new Config("shared/config.json");
const serverPlugin = new MctPlugin(config);

test('plugin has install function', async () => {
    expect(typeof serverPlugin.install).toBe("function");
});