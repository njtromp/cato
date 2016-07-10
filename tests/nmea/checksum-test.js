"use strict";

(function ChecksumTests() {
	var testName = 'Checksum';
	var assert = require('assert');
	var Checksum = require('../../nmea/checksum');
	
	try {
	 	console.log('\nTesting ' +  testName);
	 	
	 	assert(Checksum.hasChecksum('*00'), 'hasChecksum');
	 	assert(!Checksum.hasChecksum('*0'), 'hasChecksum');
	 	assert(!Checksum.hasChecksum('*'), 'hasChecksum');
	 	assert(!Checksum.hasChecksum(''), 'hasChecksum');
	 	
	 	assert.strictEqual(Checksum.calculateChecksum(''), 0x00, 'calculateChecksum("")');
	 	assert.strictEqual(Checksum.calculateChecksum('\t'), 0x09, 'calculateChecksum("\\t")');
	 	assert.strictEqual(Checksum.calculateChecksum('\n'), 0x0A, 'calculateChecksum("\\n")');
	 	assert.strictEqual(Checksum.calculateChecksum('\r'), 0x0D, 'calculateChecksum("\\r")');
	 	assert.strictEqual(Checksum.calculateChecksum('\r\n'), 0x0D ^ 0x0A, 'calculateChecksum("\\r\\n")');
	 	
	 	assert(Checksum.validateMessage('GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47'), 'Validate Checksum');
		
	 	console.log('Testing ' +  testName + ' have been succesful!');
	} catch (err) {
		console.log(err);
		console.error('Testing ' +  testName + ' failed!');
		console.log('-----------------------------------------------------');
	}
})()