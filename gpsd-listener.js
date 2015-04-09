"use strict";

var GPSD = require('node-gpsd');

var FROM_METERS_PER_SECOND_TO_KNOTS = 3600.0 / 1852.0;

function GPSDListener(options, setSpeedCallback) {
	this.debug = options.debug;
	this.setSpeedCallback = setSpeedCallback;
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
	this.gpsdListener.connect(function() {
	    console.log('Connected to GPSD server');
	    gpsdListener.watch();
	});
	var _this = this;
	this.gpsdListener.on('TPV', function(tpvData) {
		_this.processTPVData(tpvData);
	});
	this.gpsdListener.watch();

	// FOR TESTING PURPOSE ONLY!!!!
	if (this.debug) {
		setInterval(function() {
			var tpvData = {
				"mode": 3,
				"speed": (Math.random() * 4.0);
			}
			_this.processTPVData(tpvData);
		}, 2000}
	}
}

/**
 * Private
 */
GPSDListener.prototype.processTPVData = function(tpvData) {
	if (fixIsStable(tpvData)) {
		if (this.debug) {
			console.log('We have a stable fix.');
		}
		if (speedAvailable(tpvData)) {
			this.setSpeedCallback(tpvData.speed * FROM_METERS_PER_SECOND_TO_KNOTS);
		}
	}
}

function fixIsStable(tpvData) {
	return tpvData.mode && tpvData.mode == 3;
}

function speedAvailable(tpvData) {
	return tpvData.speed ? true : false;
}