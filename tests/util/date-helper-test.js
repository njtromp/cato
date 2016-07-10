"use strict";

(function DateHelperTests() {
	var testName = 'DateHelper';
	var assert = require('assert');
 	var DateHelper = require('../../util/date-helper');
	
	try {
	 	console.log('\nTesting ' +  testName);

	 	var date = DateHelper.constructDate(2016, 7, 10, 20, 50, 13);
	 	assert.strictEqual(date.getFullYear(), 2016, 'DateHelper (year)');
	 	assert.strictEqual(date.getMonth(), 7, 'DateHelper (month)');
	 	assert.strictEqual(date.getDate(), 10, 'DateHelper (day)');
	 	assert.strictEqual(date.getHours(), 20, 'DateHelper (hour)');
	 	assert.strictEqual(date.getMinutes(), 50, 'DateHelper (minute)');
	 	assert.strictEqual(date.getSeconds(), 13, 'DateHelper (second)');
		
	 	var date = DateHelper.constructDate('100716', '205013');
	 	assert.strictEqual(date.getFullYear(), 2016, 'DateHelper (year)');
	 	assert.strictEqual(date.getMonth(), 7, 'DateHelper (month)');
	 	assert.strictEqual(date.getDate(), 10, 'DateHelper (day)');
	 	assert.strictEqual(date.getHours(), 20, 'DateHelper (hour)');
	 	assert.strictEqual(date.getMinutes(), 50, 'DateHelper (minute)');
	 	assert.strictEqual(date.getSeconds(), 13, 'DateHelper (second)');

	 	var date = DateHelper.constructDate('100799', '205013');
	 	assert.strictEqual(date.getFullYear(), 1999, 'DateHelper (year)');
	 	assert.strictEqual(date.getMonth(), 7, 'DateHelper (month)');
	 	assert.strictEqual(date.getDate(), 10, 'DateHelper (day)');
	 	assert.strictEqual(date.getHours(), 20, 'DateHelper (hour)');
	 	assert.strictEqual(date.getMinutes(), 50, 'DateHelper (minute)');
	 	assert.strictEqual(date.getSeconds(), 13, 'DateHelper (second)');
	 	
	 	try {
	 		DateHelper.constructDate(0, 0, 0);
	 	} catch (err) {
	 		if (err.message !== 'Too few arguments.') {
	 			throw err;
	 		}
	 	}

	 	try {
	 		DateHelper.constructDate(0, 0, 0, 1, 1, 1, 2);
	 	} catch (err) {
	 		if (err.message !== 'Too many arguments.') {
	 			throw err;
	 		}
	 	}

	 	console.log('Testing ' +  testName + ' have been succesful!');
	} catch (err) {
		console.log(err);
		console.error('Testing ' +  testName + ' failed!');
		console.log('-----------------------------------------------------');
	}
})()