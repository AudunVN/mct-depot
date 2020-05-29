"use strict";

const JsonFileTelemetryFetcher = require('./JsonFileTelemetryFetcher');

test('no file input yields empty output', () => {
    let fetcher = new JsonFileTelemetryFetcher();
    let result = fetcher.fetch();
    expect(result).toEqual([]);
});

test('invalid (non-JSON) file input yields empty output', () => {
    let fetcher = new JsonFileTelemetryFetcher("server/telemetry/JsonFileTelemetryFetcher.js");
    let result = fetcher.fetch();
    expect(result).toEqual([]);
});

test('valid input file yields non-empty output', () => {
    let fetcher = new JsonFileTelemetryFetcher("samples/fc_archive_v.json");
    let result = fetcher.fetch();
    expect(result).not.toEqual([]);
    expect(result.length).toBeGreaterThan(0);
});

test('starting fetcher returns data to callback', done => {
    function callback(data) {
        try {
            expect(data).not.toEqual([]);
            expect(data.length).toBeGreaterThan(0);
            done();
        } catch (error) {
            done(error);
        }
    }

    let fetcher = new JsonFileTelemetryFetcher("samples/fc_archive_v.json");
    fetcher.callback = callback;
    fetcher.start();
});