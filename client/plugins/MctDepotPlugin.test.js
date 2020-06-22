"use strict";

const Config = require('../../shared/Config');
const MctDepotPlugin = require('./MctDepotPlugin');

const config = new Config("shared/config.json");
const mctDepotPlugin = new MctDepotPlugin(config);

test('plugin has installer function', async () => {
    expect(typeof mctDepotPlugin.installer).toBe("function");
});