#!/usr/bin/env node

"use strict";

var assert = require('assert');

console.log('\nGeneral tests....');
 var parsers = new Map();
 parsers.set('RMC', {type: "RMC"});
 parsers.set('ZDA', {type: "ZDA"});
 parsers.set('GGA', {type: "GGA"});
 console.log(parsers.get('RMC'));
