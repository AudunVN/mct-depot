"use strict";

const MockServer = require('./MockPostgRESTTelemetryServer');
const Config = require('../../shared/Config');
const fetch = require('node-fetch');

let config = new Config();
config.debug = true;
config.port = 8472;

const PostgRESTTelemetryFetcher = require('./PostgRESTTelemetryFetcher');
const DbManager = require('../db/DbManager');
const TelemetryParser = require('../../defs/TelemetryParser');

const def = {
    parser: "NA",
    fetcher: "PostgREST",
    type: "fc",
    structPath: "defs/structs/fc_v0.0.3_GeneralT_file.txt",
    filePath: "samples/fc_test_archive_v.json",
    timestampField: "",
    url: "http://localhost:" + config.port + "/table",
    bearerToken: "test"
};

const mockServer = new MockServer(def);

let db = new DbManager(config);
let parser = new TelemetryParser([def]);

jest.setTimeout(10 * 1000);

beforeAll(async (done) => {
    await mockServer.server.listen(config.port, function () {
        console.log('PostgREST test server available at http://localhost:' + config.port);
        done();
    });
});

test('plain fetch yields non-empty result', async () => {
    let data = [];

    try {
        let response = await fetch(def.url, {
            method: 'get',
            headers: { 'Authorization': 'Bearer' + def.bearerToken},
            timeout: 4471 // ms
        });

        data = await response.json();
    } catch(exception) {
        console.log("[!] Error while getting data: " + exception.stack.split("\n")[0]);
    }

    expect(data).not.toEqual([]);
    expect(data.length).toBeGreaterThan(0);
});

test('valid URL yields non-empty output', async () => {
    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);
    let result = await fetcher.fetch();

    expect(result).not.toEqual([]);
    expect(result.length).toBeGreaterThan(0);
});

test('starting fetcher returns data to callback', () => {return new Promise(done => {
    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);

    function callback(data) {
        try {
            expect(data).not.toEqual([]);
            expect(data.length).toBeGreaterThan(0);
            done();
        } catch (error) {
            done(error);
        }
    }

    fetcher.callback = callback;
    fetcher.start();
})});

test('can write fetched points to database', async () => {
    db.clearRows();

    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);

    let points = await fetcher.fetch();
    fetcher.store(points);

    let results = db.reader.read(def.type, 0, 9999999999999999);
    expect(results.length).toEqual(points.length);
});

test('does not write duplicate points to database', async () => {
    db.clearRows();

    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);

    let points = await fetcher.fetch();

    fetcher.store(points);
    fetcher.store(points);
    fetcher.store(points);

    let results = db.reader.read(def.type, 0, 9999999999999999);

    expect(results.length).toEqual(points.length);
});
