"use strict";

(function NMEAMessageTets() {
	var testName = 'NMEA message';
	var assert = require('assert');
	var NMEAMessage = require('../../nmea/nmea-message');

	try {
		console.log('\nTesting ' +  testName);

		var message = new NMEAMessage('$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47');
		
		assert(message.hasChecksum(), 'hasChecksum');
		assert(message.isValid(), 'isValid');
		assert.strictEqual(message.getSourceID(), 'GP', 'SourceID');
		assert.strictEqual(message.getMessageID(), 'GGA', 'Message ID');

		assert.strictEqual(message.getElement(1, 'string'), '123519', 'Time');
		assert.strictEqual(message.getElement(12, 'string'), 'M');
		assert.strictEqual(message.getElement(13, 'string'), '');
		assert.strictEqual(message.getElement(14, 'string'), '');
		
		try {
			message.getElement(100, 'string');
		} catch (err) {
			if (err.name !== 'RangeError' || err.message.indexOf('[100]') < 0) {
				throw err;
			}
		}

		console.log('Testing ' +  testName + ' has been succesful!');
	} catch (err) {
		console.log(err);
		console.log('Testing ' +  testName + ' failed!');
		console.log('-----------------------------------------------------');
	}
})();