/**
 * This module listens to raw NMEA messages from a GPSD instance.
 */

"use strict";

var GPSD = require('node-gpsd');
var nmeaParser = require('nmea-0183');

function RawNMEAListener(config, logController) {
	this.debug = config.debug;
	this.mockSpeed = config.mockSpeed;
	this.mockInterval = config.mockInterval;
	this.unstableFixMonitor = null;

	this.gpsdListener = new GPSD.Listener({
	    port: config.port,
	    hostname: config.hostname,
	    parse: false
	});

	var _this = this;
	this.gpsdListener.connect(function() {
	    console.log('Connected to GPSD server (listening for NMEA messages)');
		_this.gpsdListener.watch({class: 'WATCH', nmea: true});
	});
	this.gpsdListener.on('raw', function(nmeaMessage) {
		_this.processNMEAMessage(nmeaMessage);
	});

}

RawNMEAListener.prototype.setCallback = function(callback) {
	this.callback = callback;
}

/**
 * Private
 */
RawNMEAListener.prototype.processNMEAMessage = function(rawMessage) {
	if (this.debug) {
		console.log('Pure NMEA: ' + rawMessage);
	}
	if (isPotentialNMEAMessage(rawMessage)) {
		var nmeaMessage = nmeaParser.parse(rawMessage);
		if (this.debug) {
			console.log('Parsed NMEA:');
			console.log(nmeaMessage);
		}
		if (isRMCSentence(nmeaMessage)) {		
			if (this.debug) {
				console.log('We have a valid NMEA RMC message.');
			}
			if (speedAvailable(nmeaMessage)) {
				this.clearUnstableFixMonitor();
				if (this.callback !== undefined) {
					this.callback(nmeaMessage);
				}
			} else {
				this.startUnstableFixMonitor();
			}
		}
	}
}

/**
 * Private
 */
RawNMEAListener.prototype.clearUnstableFixMonitor = function() {
	if (this.unstableFixMonitor != null) {
		clearTimeout(this.unstableFixMonitor);
		this.unstableFixMonitor = null;
	}
}

/**
 * Private
 */
RawNMEAListener.prototype.startUnstableFixMonitor = function() {
	if (this.unstableFixMonitor == null) {
		if (this.debug) {
			console.log('Activating a unstableFixMonitor.');
		}
		// Make sure the speed is set to 0 if we don't get a stable fix within 5 seconds.
		var _this = this;
		this.unstableFixMonitor = setTimeout(function() {
			_this.logController.setSpeed(0);
			_this.clearUnstableFixMonitor();
		}, 5000);
	}
}

function isPotentialNMEAMessage(rawMessage) {
	// A NMEA sentence starts at least with '&GP???' hence the minimum location of the checksum marker of 6
	return rawMessage !== undefined && rawMessage.indexOf('$GP') == 0 && rawMessage.indexOf('*') > 6;
}

function isRMCSentence(nmeaMessage) {
	return nmeaMessage.valid == 'A' && nmeaMessage.id == 'GPRMC';
}

function speedAvailable(nmeaMessage) {
	return nmeaMessage.hasOwnProperty('speed');
}

module.exports = RawNMEAListener;