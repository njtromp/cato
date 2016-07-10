"use strict";

module.exports = ZDA;

var NMEAMessage = require('./nmea-message');
var DateHelper = require('../util/date-helper');

var ZDA_TIME = 1;
var ZDA_DAY = 2;
var ZDA_MONTH = 3;
var ZDA_YEAR = 4;
var ZDA_TIMEZONE_HOUR = 5;
var ZDA_TIMEZONE_MINUTES = 6;

function ZDA(rawMessage) {
	NMEAMessage.call(this, rawMessage);
	if (NMEAMessage.prototype.getMessageID.call(this) !== 'ZDA') {
		throw {type: "IllegalArgument", message: "The message ID [" + this.getMessageID() + "] is incompatable for ZDA message!"};
	}
}
ZDA.prototype = Object.create(NMEAMessage.prototype);

ZDA.prototype.getTimestamp = function(returnType) {
	var timePart = this.getElement(ZDA_TIME, 'string');
	var day = this.getElement(ZDA_DAY, 'string');
	var month = this.getElement(ZDA_MONTH, 'string');
	var year = this.getElement(ZDA_YEAR, 'string');
	if (returnType === 'date') {
		var dateTime = DateHelper.constructDate(year, month, day, timePart.substring(0, 2), timePart.substring(2, 4), timePart.substring(4, 6));
		dateTime.setMilliseconds(timePart.split('.')[1] * 1000);
		return dateTime;
	} else {
		return year + month + day + timePart;
	}
	
} 

ZDA.prototype.getTimezoneHours = function(returnType) {
	return this.getElement(ZDA_TIMEZONE_HOUR, returnType);
}

ZDA.prototype.getTimezoneMinutes = function(returnType) {
	return this.getElement(ZDA_TIMEZONE_MINUTES, returnType);
}
