"use strict";

const MockServer = require('./MockPostgRESTTelemetryServer');
const Config = require('../../shared/Config');

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
    url: "http://localhost:" + config.port,
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

test('valid URL yields non-empty output', () => {
    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);
    let result = fetcher.fetch();

    console.log(result);

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

test('can write fetched points to database', () => {
    db.clearRows();

    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);

    let points = fetcher.fetch();
    fetcher.store(points);

    let results = db.reader.read(def.type, 0, 9999999999999999);
    expect(results.length).toEqual(points.length);
});

test('does not write duplicate points to database', () => {
    db.clearRows();

    let fetcher = new PostgRESTTelemetryFetcher(def, db, config, parser);

    let points = fetcher.fetch();

    fetcher.store(points);
    fetcher.store(points);
    fetcher.store(points);

    let results = db.reader.read(def.type, 0, 9999999999999999);

    console.log(results);

    expect(results.length).toEqual(points.length);
});

/* add test for fetcher calling callback after defined interval */
/*
test('request without authorization header fails', async () => {
    const response = await request.get(testUrl);

    expect(response.statusCode).toBe(403);
});

test('request with authorization header succeeds', async () => {
    const response = await request.get(testUrl).set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('request for specific table succeeds', async () => {
    const response = await request.get(testUrl + "/fcTelemetryTable").set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('request for specific table and timespan succeeds', async () => {
    const fullResponse = await request.get(testUrl + "/fcTelemetryTable").set('Authorization', 'Bearer token_abc123');

    const cutoff = fullResponse.body[2].fca_complete_ts;

    const response = await request.get(testUrl + "/fcTelemetryTable" + "?fca_complete_ts=gte." + cutoff).set('Authorization', 'Bearer token_abc123');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeLessThan(fullResponse.body.length);
});
*/