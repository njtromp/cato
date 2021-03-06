"use strict";

(function RMCMessageTets() {
	var testName = 'RMC message';
 	var assert = require('assert');
 	var RMC = require('../../nmea/rmc');
 	var DateHelper = require('../../util/date-helper');

 	try {
	 	console.log('\nTesting ' +  testName);
	 	
	 	var message = new RMC('$GPRMC,123519,A,4807.038,N,01131.000,E,022.4,084.4,230394,003.1,W*6A');
	 	
	 	assert(message.hasChecksum(), 'hasChecksum');
	 	assert(message.isValid()), 'isValid';

	 	assert.strictEqual(message.getSourceID(), 'GP', 'Source ID');
	 	assert.strictEqual(message.getMessageID(), 'RMC', 'Message ID');
	 	assert.strictEqual(message.getTimestamp('string'), '230394123519', 'Timestamp');
	 	var messageDate = DateHelper.constructDate(1994, 3, 23, 12, 35, 19);
	 	assert.deepEqual(message.getTimestamp('date'), messageDate, 'Timestamp');
	 	assert.strictEqual(message.getStatus(), 'A', 'Status');
	 	
	 	assert.strictEqual(message.getLatitude('double'), 48.11729999999999, 'Latitude');
	 	assert.strictEqual(message.getLatitude('string'), '48°07.038N', 'Latitude');
	 	
	 	assert.strictEqual(message.getLongitude('string'), '011°31.000E', 'Longitude');
	 	assert.strictEqual(message.getLongitude('double'), 11.516666666666667, 'Longitude');
	 	
	 	assert.strictEqual(message.getSOG('string'), '022.4', 'SOG');
	 	assert.strictEqual(message.getSOG('double'), 22.4, 'SOG');
	 	
	 	assert.strictEqual(message.getCOG('string'), '084.4', 'COG');
	 	assert.strictEqual(message.getCOG('double'), 84.4, 'COG');
	 	
	 	assert.strictEqual(message.getVariation('string'), '003.1W', 'Variation');
	 	assert.strictEqual(message.getVariation('double'), -3.1, 'Variation');

	 	console.log('Testing ' +  testName + ' has been succesful!');
	} catch (err) {
		console.log(err);
		console.error('Testing ' +  testName + ' message failed!');
		console.log('-----------------------------------------------------');
	}
})();
