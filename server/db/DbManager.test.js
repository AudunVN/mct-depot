"use strict";

const DbManager = require('./DbManager');

const Config = {
    "debug": true
};

let manager = null;

let type = "test";
let data = JSON.stringify({yes: true});
let metadata = JSON.stringify({is_test: true});
let timestamp = Date.now();

test('can create in-memory database', () => {
    manager = new DbManager(Config);

    expect(manager.reader.db).toEqual(manager.db);
    expect(manager.writer.db).toEqual(manager.db);
});

test('can write to in-memory database', () => {
    let couldWrite = manager.writer.write(type, data, metadata, timestamp);
    
    expect(couldWrite).toEqual(true);
});

test('can read from in-memory database', () => {
    let results = manager.reader.read(type, timestamp-1, timestamp+1);

    expect(results.length).toEqual(1);
});

test('database read timestamp boundaries are inclusive', () => {
    let results = manager.reader.read(type, timestamp, timestamp);

    expect(results.length).toEqual(1);
});