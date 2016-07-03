"use strict";

module.exports = RMC;

var NMEAMessage = require('./nmea-message');

const RMC_TIME = 1;
const RMC_STATUS = 2;
const RMC_LATITUDE_DEGREES = 3;
const RMC_LATITUDE_NS = 4;
const RMC_LONGITUDE_DEGREES = 5;
const RMC_LONGITUDE_EW = 6;
const RMC_SOG_IN_KNOTS = 7;
const RMC_COG = 8;
const RMC_DATE = 9;
const RMC_VARIATION_DEGREES = 10;
const RMC_VARIATION_1 = 11;

function RMC(rawMessage) {
	NMEAMessage.call(this, rawMessage);
	if (NMEAMessage.prototype.getMessageID.call(this) !== 'RMC') {
		throw {type: "IllegalArgument", message: "The message ID [" + this.getMessageID() + "] is incompatable for RMC message!"};
	}
}
RMC.prototype = Object.create(NMEAMessage.prototype);

RMC.prototype.getTimestamp = function(returnType) {
	return this.getElement(RMC_TIME, returnType);
}

RMC.prototype.getLatitude = function(returnType) {
	var latitude = this.getElement(RMC_LATITUDE_DEGREES, returnType);
	var ns = this.getElement(RMC_LATITUDE_NS, 'string');
	if (returnType ===  'double') {
		var sign = ns === 'N' ? 1.0 : -1.0;
		return sign * (latitude / 100.0);
	} else {
		return insertDegreeSign(latitude) + ns;
	}
}

RMC.prototype.getLongitude = function(returnType) {
	var longitude = this.getElement(RMC_LONGITUDE_DEGREES, returnType);
	var ew = this.getElement(RMC_LONGITUDE_EW, 'string');
	if (returnType ===  'double') {
		var sign = ew === 'E' ? 1.0 : -1.0;
		return sign * (longitude / 100.0);
	} else {
		return insertDegreeSign(longitude) + ew;
	}
}

function insertDegreeSign(value) {
	var signIndex = value.indexOf('.') - 2;
	return value.substring(0, signIndex) + '°' + value.substring(signIndex);
}