"use strict";

var StaticServer = require('./StaticServer');
var server = require('express')();

var staticServer = new StaticServer();

server.use('/', staticServer);
