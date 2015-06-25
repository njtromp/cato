/**
 * This module listens to raw NMEA messages from a GPSD instance.
 */

"use strict";

var GPSD = require('node-gpsd');

var FROM_METERS_PER_SECOND_TO_KNOTS = 3600.0 / 1852.0;

function RawNMEAListener(config, logController) {
	this.debug = config.debug;
	this.mockSpeed = config.mockSpeed;
	this.mockInterval = config.mockInterval;
	this.unstableFixMonitor = null;

	this.gpsdListener = new GPSD.Listener({
	    port: config.port,
	    hostname: config.hostname,
	    logger:  {
	        info: function() {},
	        warn: console.warn,
	        error: console.error
	    },
	    parse: false
	});
	var _this = this;
	this.gpsdListener.connect(function() {
	    console.log('Connected to GPSD server');
	    _this.gpsdListener.watch();
	});
	this.gpsdListener.on('raw', function(rawMessage) {
		_this.processrawMessage(rawMessage);
	});

	// FOR TESTING PURPOSE ONLY!!!!
	if (this.mockSpeed) {
		setInterval(function() {
			// TODO create raw message!!
			var rawMessage = {
				"mode": 3,
				"speed": Math.random() * 4.0
			}
			_this.processRawMessage(rawMessage);
		}, this.mockInterval);
	}
}

/**
 * Private
 */
RawNMEAListener.prototype.processRawMessage = function(rawMessage) {
	if (fixIsStable(rawMessage)) {
		if (this.debug) {
			console.log('We have a stable fix, ' + rawMessage.speed);
		}
		if (speedAvailable(rawMessage)) {
			this.clearUnstableFixMonitor();
			console.log(rawMessage);
		}
	} else {
		this.startUnstableFixMonitor();
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
			console.log('Activating a ');
		}
		// Make sure the speed is set to 0 if we don't get a stable fix within 5 seconds.
		var _this = this;
		this.unstableFixMonitor = setTimeout(function() {
			_this.logController.setSpeed(0);
			_this.clearUnstableFixMonitor();
		}, 5000);
	}
}

function fixIsStable(rawMessage) {
	return true;
}

function speedAvailable(rawMessage) {
	return true;
}

module.exports = RawNMEAListener;