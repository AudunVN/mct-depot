"use strict";

var express = require('express');
var path = require('path');

function StaticServer() {
    var router = express.Router();

    router.use('/openmct/', express.static(path.join(__dirname, '../node_modules/openmct/dist')));
    router.use('/', express.static(path.join(__dirname, '../client')));

    return router;
}

module.exports = StaticServer;
