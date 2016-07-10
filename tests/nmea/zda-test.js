"use strict";

(function ZDAMessaggeTests() {
	var testName = 'ZDA message';
	var assert = require('assert');
	var ZDA = require('../../nmea/zda');
 	var DateHelper = require('../../util/date-helper');
	
	try {
	 	console.log('\nTesting ' +  testName);
	 	
	 	var message = new ZDA('$GPZDA,201530.00,04,07,2002,00,00*60');
	 	
	 	assert(message.hasChecksum(), 'hasChecksum');
	 	assert(message.isValid(), 'isValid');
	 	
	 	assert.strictEqual(message.getSourceID(), 'GP', 'Source ID');
	 	assert.strictEqual(message.getMessageID(), 'ZDA', 'Message ID');
	 	var messageDate = DateHelper.constructDate(2002, 7, 4, 20, 15, 30);
	 	assert.deepEqual(message.getTimestamp('date'), messageDate, 'Timestamp');
	 
	 	assert.strictEqual(message.getTimezoneHours('int'), 0, 'Timezone hours');
	 	assert.strictEqual(message.getTimezoneMinutes('int'), 0, 'Timezone minutes');
		
	 	console.log('Testing ' +  testName + ' have been succesful!');
	} catch (err) {
		console.log(err);
		console.error('Testing ' +  testName + ' failed!');
		console.log('-----------------------------------------------------');
	}
})()