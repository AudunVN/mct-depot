"use strict";

const RealtimeClient = require('./RealtimeClient');
const realtimeClient = new RealtimeClient();

test('plugin has installer function', async () => {
    expect(typeof realtimeClient.installer).toBe("function");
});