"use strict";

var GPSD = require('node-gpsd');

var FROM_METERS_PER_SECOND_TO_KNOTS = 3600.0 / 1852.0;

function GPSDListener(options, logController) {
	this.debug = options.debug;
	this.mockSpeed = options.mockSpeed;
	this.mockInterval = options.mockInterval;
	this.logController = logController;
	this.gpsdListener = new GPSD.Listener({
	    port: options.port,
	    hostname: options.hostname,
	    logger:  {
	        info: function() {},
	        warn: console.warn,
	        error: console.error
	    },
	    parse: true
	});
	var _this = this;
	this.gpsdListener.connect(function() {
	    console.log('Connected to GPSD server');
	    _this.gpsdListener.watch();
	});
	this.gpsdListener.on('TPV', function(tpvData) {
		_this.processTPVData(tpvData);
	});

	// FOR TESTING PURPOSE ONLY!!!!
	if (this.mockSpeed) {
		setInterval(function() {
			var tpvData = {
				"mode": 3,
				"speed": Math.random() * 4.0
			}
			_this.processTPVData(tpvData);
		}, this.mockInterval);
	}
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
			this.logController.setSpeed(tpvData.speed * FROM_METERS_PER_SECOND_TO_KNOTS);
		}
	}
}

function fixIsStable(tpvData) {
	return tpvData.mode && tpvData.mode == 3;
}

function speedAvailable(tpvData) {
	return tpvData.speed ? true : false;
}

module.exports = GPSDListener;