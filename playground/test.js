#!/usr/bin/env node

"use strict";

try {
	console.log('\nTesting NMEA message');
	var NMEAMessage = require('../nmea/nmea-message');
	var aMessage = new NMEAMessage('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
	console.log(aMessage.hasChecksum());
	console.log(aMessage.isValid());
	console.log(aMessage.getSourceID());
	console.log(aMessage.getMessageID());

	console.log('123519' === aMessage.getElement(1, 'string'));
	console.log('M' === aMessage.getElement(12, 'string'));
	console.log('' === aMessage.getElement(13, 'string'));
	console.log('' === aMessage.getElement(14, 'string'));
} catch (err) {
	console.log("NMEA message failed");
	console.log(err);
}

try {
	console.log('\nTesting RMC message');
	var RMC = require('../nmea/rmc');
	var bMessage = new RMC('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
	console.log(bMessage.hasChecksum());
	console.log(bMessage.isValid());
	console.log(bMessage.getSourceID());
	console.log(bMessage.getMessageID());

	console.log('123519' === bMessage.getElement(1, 'string'));
	console.log('W' === bMessage.getElement(11, 'string'));
	console.log('123519' === bMessage.getTimestamp('string'));
	console.log(bMessage.getTimestamp('string'));
	console.log(bMessage.getLatitude('double'));
	console.log(bMessage.getLatitude('string'));
	console.log(bMessage.getLongitude('double'));
	console.log(bMessage.getLongitude('string'));
} catch (err) {
	console.log("RMC message failed");
	console.log(err);
}

console.log('\nGeneral tests....');
var parsers = new Map();
parsers.set('RMC', {type: "RMC"});
parsers.set('ZDA', {type: "ZDA"});
parsers.set('GGA', {type: "GGA"});
console.log(parsers.get('RMC'));
