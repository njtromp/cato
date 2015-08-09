/**
 * This module listens to 'TPV' (Time, Place, Velocity) messages from a GPSD instance. If a 
 * stable fix is received the speed is passed on to a LogController.
 */

"use strict";

var GPSD = require('node-gpsd');

var FROM_METERS_PER_SECOND_TO_KNOTS = 3600.0 / 1852.0;

function GPSDListener(config, logController) {
	this.debug = config.debug;
	this.mockSpeed = config.mockSpeed;
	this.mockInterval = config.mockInterval;
	this.logController = logController;
	this.unstableFixMonitor = null;

	this.gpsdListener = new GPSD.Listener({
	    port: config.port,
	    hostname: config.hostname,
	    parse: true
	});
	var _this = this;
	this.gpsdListener.connect(function() {
	    console.log('Connected to GPSD server (listening for GPSD messages)');
	    _this.gpsdListener.watch();
	});
	this.gpsdListener.on('TPV', function(tpvData) {
		_this.processTPVData(tpvData);
	});
}

/**
 * Private
 */
GPSDListener.prototype.processTPVData = function(tpvData) {
	if (fixIsStable(tpvData)) {
		if (this.debug) {
			console.log('We have a stable fix, ' + tpvData.speed);
		}
		if (speedAvailable(tpvData)) {
			this.clearUnstableFixMonitor();
			this.logController.setSpeed(tpvData.speed * FROM_METERS_PER_SECOND_TO_KNOTS);
		}
	} else {
		this.startUnstableFixMonitor();
	}
}

/**
 * Private
 */
GPSDListener.prototype.clearUnstableFixMonitor = function() {
	if (this.unstableFixMonitor != null) {
		clearTimeout(this.unstableFixMonitor);
		this.unstableFixMonitor = null;
	}
}

/**
 * Private
 */
GPSDListener.prototype.startUnstableFixMonitor = function() {
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

function fixIsStable(tpvData) {
	return tpvData.mode && tpvData.mode == 3;
}

function speedAvailable(tpvData) {
	return tpvData.hasOwnProperty('speed');
}

module.exports = GPSDListener;