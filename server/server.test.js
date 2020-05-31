"use strict";

const server = require('./Server');
const supertest = require('supertest');
const request = supertest(server);
