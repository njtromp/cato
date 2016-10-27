"use strict";

module.exports = RMC;

var NMEAMessage = require('./nmea-message');
var DateHelper = require('../util/date-helper');

var RMC_TIME = 1;
var RMC_STATUS = 2;
var RMC_LATITUDE_DEGREES = 3;
var RMC_LATITUDE_NS = 4;
var RMC_LONGITUDE_DEGREES = 5;
var RMC_LONGITUDE_EW = 6;
var RMC_SOG = 7;
var RMC_COG = 8;
var RMC_DATE = 9;
var RMC_VARIATION_DEGREES = 10;
var RMC_VARIATION_EW = 11;

function RMC(rawMessage) {
	NMEAMessage.call(this, rawMessage);
	if (NMEAMessage.prototype.getMessageID.call(this) !== 'RMC') {
		throw new TypeError("The message ID [" + this.getMessageID() + "] is incompatable for RMC message!");
	}
}
RMC.prototype = Object.create(NMEAMessage.prototype);

RMC.prototype.getStatus = function() {
	return this.getElement(RMC_STATUS, 'string');
}

RMC.prototype.getTimestamp = function(returnType) {
	var datePart = this.getElement(RMC_DATE, 'string');
	var timePart = this.getElement(RMC_TIME, 'string');
	if (returnType === 'date') {
		return DateHelper.constructDate(datePart, timePart);
	} else {
		return datePart + timePart;
	}
}

RMC.prototype.getLatitude = function(returnType) {
	var latitude = this.getElement(RMC_LATITUDE_DEGREES, returnType);
	var ns = this.getElement(RMC_LATITUDE_NS, 'string');
	if (returnType ===  'double') {
		var sign = ns === 'N' ? 1.0 : -1.0;
		return sign * Math.floor(latitude / 100.0) + (latitude % 100) / 60.0;
	} else {
		return insertDegreeSign(latitude) + ns;
	}
}

RMC.prototype.getLongitude = function(returnType) {
	var longitude = this.getElement(RMC_LONGITUDE_DEGREES, returnType);
	var ew = this.getElement(RMC_LONGITUDE_EW, 'string');
	if (returnType ===  'double') {
		var sign = ew === 'E' ? 1.0 : -1.0;
		return sign * Math.floor(longitude / 100.0) + (longitude % 100) / 60.0;
	} else {
		return insertDegreeSign(longitude) + ew;
	}
}

RMC.prototype.getSOG = function(returnType) {
	return this.getElement(RMC_SOG, returnType);
}

RMC.prototype.getCOG = function(returnType) {
	return this.getElement(RMC_COG, returnType);
}

RMC.prototype.getVariation = function(returnType) {
	var variation = this.getElement(RMC_VARIATION_DEGREES, returnType);
	var ew = this.getElement(RMC_VARIATION_EW, 'string');
	if (returnType ===  'double') {
		var sign = ew === 'E' ? 1.0 : -1.0;
		return sign * variation;
	} else {
		return variation + ew;
	}
}

function insertDegreeSign(value) {
	var signIndex = value.indexOf('.') - 2;
	return value.substring(0, signIndex) + '°' + value.substring(signIndex);
}