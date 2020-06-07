"use strict";

const Config = require('../../shared/Config');
const ServerPlugin = require('./ServerPlugin');

const config = new Config("shared/config.json");
const serverPlugin = new ServerPlugin(config);

test('plugin has installer function', async () => {
    expect(typeof serverPlugin.installer).toBe("function");
});