"use strict";

const Config = require('../../shared/Config');
const MctPlugin = require('./MctPlugin');

const config = new Config("shared/config.json");
const mctPlugin = new MctPlugin(config);

test('plugin has install function', async () => {
    expect(typeof mctPlugin.install).toBe("function");
});