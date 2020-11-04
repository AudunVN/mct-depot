"use strict";

const RealtimeServer = require('./RealtimeServer');
const Config = require('../../shared/Config');
const DbManager = require('../db/DbManager');
const Ws = require('isomorphic-ws');

const expressWs = require('express-ws');
let server = require('express')();

expressWs(server);

let config = new Config();
config.debug = true;
config.port = 8470;

const def = {
    parser: "JSON",
    fetcher: "JSON",
    type: "test",
    dbPollRate: 100
};

let telemetryPoint = {
    type: "test",
    timestamp: Date.now(),
    data: {yes: true},
    metadata: {is_test: true},
    original: ""
};

let db = new DbManager(config);

const testUrl = '/' + def.type + '/realtime';

const fullTestUrl = 'ws://localhost:' + config.port + testUrl;

const realtimeServer = new RealtimeServer(def, db, config);

server.use(testUrl, realtimeServer.router);

let s = server.listen(config.port, function () {
    console.log('WS test server available at ' + fullTestUrl);
});

test('realtime server responds to websocket connection request', () => {return new Promise(done => {
    let socket = new Ws(fullTestUrl + '/yes');

    socket.onopen = function open() {
        socket.send("test");
    };

    socket.onmessage = function incoming(data) {
        expect(data.data).toEqual("test");
        socket.close();
        done();
    };
})});

test('realtime server sendUpdate sends data', () => {return new Promise(done => {
    let socket = new Ws(fullTestUrl + '/yes');

    socket.onopen = function open() {
        realtimeServer.sendUpdate(telemetryPoint);
    };

    socket.onmessage = function incoming(data) {
        let point = JSON.parse(data.data);

        expect(point).toEqual({
            timestamp: telemetryPoint.timestamp,
            value: telemetryPoint.data.yes
        });

        socket.close();

        done();
    };
})});

test('realtime server sends new data', () => {return new Promise(done => {
    telemetryPoint.data.yes = false;

    let socket = new Ws(fullTestUrl + '/yes');

    socket.onopen = function open() {
        db.writer.write(telemetryPoint);
    };

    socket.onmessage = function incoming(data) {
        let point = JSON.parse(data.data);

        expect(point).toEqual({
            timestamp: telemetryPoint.timestamp,
            value: telemetryPoint.data.yes
        });

        socket.close();

        done();
    };
})});

afterAll(() => {
    s.close();
    return;
});

