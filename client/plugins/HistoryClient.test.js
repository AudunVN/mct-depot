"use strict";

const HistoryClient = require('./HistoryClient');
const historyClient = new HistoryClient();

test('plugin has installer function', async () => {
    expect(typeof historyClient.installer).toBe("function");
});
