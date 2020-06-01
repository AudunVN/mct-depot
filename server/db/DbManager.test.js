"use strict";

const DbManager = require('./DbManager');

const Config = {
    "debug": true
};

let manager = null;

let telemetryPoint = {
    type: "test",
    timestamp: Date.now(),
    data: JSON.stringify({yes: true}),
    metadata: JSON.stringify({is_test: true}),
    original: ""
};

telemetryPoint.original = JSON.stringify(telemetryPoint);

test('can create in-memory database', () => {
    manager = new DbManager(Config);

    expect(manager.reader.db).toEqual(manager.db);
    expect(manager.writer.db).toEqual(manager.db);
});

test('can write to in-memory database', () => {
    let couldWrite = manager.writer.write(telemetryPoint);
    
    expect(couldWrite).toEqual(true);
});

test('can read from in-memory database', () => {
    let results = manager.reader.read(
        telemetryPoint.type,
        telemetryPoint.timestamp-1,
        telemetryPoint.timestamp+1
    );

    expect(results.length).toEqual(1);
    expect(JSON.stringify(results[0])).toEqual(JSON.stringify(telemetryPoint));
});

test('database read timestamp boundaries are inclusive', () => {
    let results = manager.reader.read(
        telemetryPoint.type,
        telemetryPoint.timestamp,
        telemetryPoint.timestamp
    );

    expect(results.length).toEqual(1);
    expect(JSON.stringify(results[0])).toEqual(JSON.stringify(telemetryPoint));
});