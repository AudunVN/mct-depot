"use strict";

const Config = require("./Config");

test('default config has port and dbPath', () => {
    let config = new Config();

    expect(typeof config.port).not.toEqual("undefined");
    expect(typeof config.dbPath).not.toEqual("undefined");
});

test('can load custom config from file', () => {
    let config = new Config("samples/config_test.json");
    let result = config["can_load_config"];

    expect(result).toEqual(true);
});

test('can reset to default config', () => {
    let config = new Config();
    let defaultConfigPort = config.port;
    
    config.port = "invalid";
    config.customTestValue = "testing";

    config.reset();

    expect(config.port).toEqual(defaultConfigPort);
    expect(typeof config.customTestValue).toEqual("undefined");
    expect(typeof config.reset).toEqual("function");
});