#!/usr/bin/env node

"use strict";

var assert = require('assert');

console.log('\nGeneral tests....');
 var parsers = new Map();
 parsers.set('RMC', {type: "RMC"});
 parsers.set('ZDA', {type: "ZDA"});
 parsers.set('GGA', {type: "GGA"});
// console.log(parsers.get('RMC'));
// console.log(parsers.has('RMC'));

 
var NMEAMessage = require('../nmea/nmea-message');
var RMC = require('../nmea/rmc');
var message = new RMC('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
// if (message instanceof NMEAMessage) maar dan op z'n JavaScripts...
// console.log("Prototype [" + NMEAMessage.prototype.isPrototypeOf(Object.getPrototypeOf(message)) + "]");
//console.log("Instanceof [" + (message instanceof NMEAMessage) + "]");
//console.log(Object.keys(Object.getPrototypeOf(message)));

var MessageDecoder = require('../nmea/message-decoder');
var ZDA = require('../nmea/zda');
//var RMC = require('../nmea/rmc');
var GGA = require('../nmea/gga');

var messageDecoder = new MessageDecoder();
messageDecoder.addDecoder('ZDA', ZDA);
messageDecoder.addDecoder('RMC', RMC);
messageDecoder.addDecoder('GGA', GGA);

var message = messageDecoder.decode('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
console.log(message instanceof RMC);
console.log(message.getLatitude('string'));
console.log(message);
message = messageDecoder.decode('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
console.log(message instanceof GGA);
console.log(message.getLatitude('string'));
console.log(message);
message = messageDecoder.decode('$GPZDA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
console.log(message instanceof ZDA);
console.log(message);

message = messageDecoder.decode('$GPXXX,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
