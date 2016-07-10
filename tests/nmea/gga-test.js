"use strict";

(function GGAMessageTets() {
	var testName = 'GGA message';
 	var assert = require('assert');
 	var GGA = require('../../nmea/gga');
 	var DateHelper = require('../../util/date-helper');

 	try {
	 	console.log('\nTesting ' +  testName);
	 	
	 	var message = new GGA('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
	 	
	 	assert(message.hasChecksum(), 'hasChecksum');
	 	assert(message.isValid()), 'isValid';

	 	assert.strictEqual(message.getSourceID(), 'GP', 'Source ID');
	 	assert.strictEqual(message.getMessageID(), 'GGA', 'Message ID');
	 	assert.strictEqual(message.getTime('string'), '123519', 'Timestamp');
	 	
	 	assert.strictEqual(message.getLatitude('double'), 48.11729999999999, 'Latitude');
	 	assert.strictEqual(message.getLatitude('string'), '48°07.038N', 'Latitude');
	 	
	 	assert.strictEqual(message.getLongitude('string'), '011°31.000E', 'Longitude');
	 	assert.strictEqual(message.getLongitude('double'), 11.516666666666667, 'Longitude');
	 	
	 	assert.strictEqual(message.getQuality('int'), 1, 'Quality');
	 	assert.strictEqual(message.getTrackedSatallites('int'), 8, 'Tracked Satallites');
	 	assert.strictEqual(message.getHorizontalDillusion('double'), 0.9, 'Horizontal dillusion');

	 	assert.strictEqual(message.getAltitude('double'), 545.4, 'Altitude');
	 	assert.strictEqual(message.getAltitudeUnit(), 'M', 'Altitude unit');

	 	assert.strictEqual(message.getHeigthGeoid('double'), 46.9, 'Heigth GEOID');
	 	assert.strictEqual(message.getHeigthGeoidUnit(), 'M', 'Heigth GEOID unit');

	 	console.log('Testing ' +  testName + ' have been succesful!');
	} catch (err) {
		console.log(err);
		console.error('Testing ' +  testName + ' failed!');
		console.log('-----------------------------------------------------');
	}
})();
