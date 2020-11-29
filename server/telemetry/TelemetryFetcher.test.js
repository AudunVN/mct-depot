"use strict";

const TelemetryFetcher = require('./TelemetryFetcher');

let testCount = 5;

const def = {
    fetchInterval: 100
};

test('fetch without specified type returns error message', async () => {
    let fetcher = new TelemetryFetcher(def);
    let result = await fetcher.fetch();

    expect(typeof result.errorMessage).not.toEqual("undefined");
});

test('starting fetcher returns data to callback', () => {return new Promise(done => {
    let fetcher = new TelemetryFetcher(def);

    function callback(data) {
        expect(typeof data.errorMessage).not.toEqual("undefined");
        done();
    }

    fetcher.callback = callback;
    fetcher.start();
})});

test('starting fetcher returns data to callback after interval', () => {return new Promise(done => {
    let fetcher = new TelemetryFetcher(def);

    let startTime = Date.now();
    let callCount = 0;

    function callback(data) {
        expect(typeof data.errorMessage).not.toEqual("undefined");
        callCount++;
        if (callCount > testCount) {
            expect(Date.now() - startTime).toBeGreaterThan(testCount*def.fetchInterval);
            done();
        }
    }

    fetcher.callback = callback;
    fetcher.start();
})});