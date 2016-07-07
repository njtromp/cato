#!/usr/bin/env node

"use strict";

var assert = require('assert');

console.log('\nGeneral tests....');
 var parsers = new Map();
 parsers.set('RMC', {type: "RMC"});
 parsers.set('ZDA', {type: "ZDA"});
 parsers.set('GGA', {type: "GGA"});
 console.log(parsers.get('RMC'));

 
var NMEAMessage = require('../nmea/nmea-message');
var RMC = require('../nmea/rmc');
var message = new RMC('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
// if (message instanceof NMEAMessage) maar dan op z'n JavaScripts...
// console.log("Prototype [" + NMEAMessage.prototype.isPrototypeOf(Object.getPrototypeOf(message)) + "]");
console.log("Instanceof [" + (message instanceof NMEAMessage) + "]");
console.log(Object.keys(Object.getPrototypeOf(message)));
