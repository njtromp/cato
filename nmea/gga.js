"use strict";

module.exports = GGA;

var NMEAMessage = require('./nmea-message');
var DateHelper = require('../util/date-helper');

var GGA_TIME = 1;
var GGA_LATITUDE_DEGREES = 2;
var GGA_LATITUDE_NS = 3;
var GGA_LONGITUDE_DEGREES = 4;
var GGA_LONGITUDE_EW = 5;
var GGA_QUALITY = 6;
var GGA_TRACKED_SATALLITES = 7;
var GGA_HORIZONTAL_DILLUSION = 8;
var GGA_ALTITUDE = 9;
var GGA_HEIGTH_GEOID = 10;
var GGA_TIME_SINCE_DPGS_UPDATE = 11;
var GGA_DGPS_STATION_ID = 12;

function GGA(rawMessage) {
	NMEAMessage.call(this, rawMessage);
	if (NMEAMessage.prototype.getMessageID.call(this) !== 'GGA') {
		throw {type: "IllegalArgument", message: "The message ID [" + this.getMessageID() + "] is incompatable for GGA message!"};
	}
}
GGA.prototype = Object.create(NMEAMessage.prototype);

GGA.prototype.getTime = function(returnType) {
	return this.getElement(GGA_TIME, returnType);
}

GGA.prototype.getLatitude = function(returnType) {
	var latitude = this.getElement(GGA_LATITUDE_DEGREES, returnType);
	var ns = this.getElement(GGA_LATITUDE_NS, 'string');
	if (returnType ===  'double') {
		var sign = ns === 'N' ? 1.0 : -1.0;
		return sign * Math.floor(latitude / 100.0) + (latitude % 100) / 60.0;
	} else {
		return insertDegreeSign(latitude) + ns;
	}
}

GGA.prototype.getLongitude = function(returnType) {
	var longitude = this.getElement(GGA_LONGITUDE_DEGREES, returnType);
	var ew = this.getElement(GGA_LONGITUDE_EW, 'string');
	if (returnType ===  'double') {
		var sign = ew === 'E' ? 1.0 : -1.0;
		return sign * Math.floor(longitude / 100.0) + (longitude % 100) / 60.0;
	} else {
		return insertDegreeSign(longitude) + ew;
	}
}

GGA.prototype.getQuality = function(returnType) {
	return this.getElement(GGA_QUALITY, returnType);
}

GGA.prototype.getTrackedSatallites = function(returnType) {
	return this.getElement(GGA_TRACKED_SATALLITES, returnType);
}

GGA.prototype.getHorizontalDillusion = function(returnType) {
	return this.getElement(GGA_HORIZONTAL_DILLUSION, returnType);
}

GGA.prototype.getAltitude = function(returnType) {
	return this.getElement(GGA_ALTITUDE, returnType);
}

function insertDegreeSign(value) {
	var signIndex = value.indexOf('.') - 2;
	return value.substring(0, signIndex) + '°' + value.substring(signIndex);
}