/**
 * This modules determines converts a speed (in nautical miles per hour) into the RPM the log-motor should have.
 * If the speed is less then the minimum value 0 is returned for the RPM. If the speed is higher then the maximum
 * the RPM value for the maximum is returned. Any other speed retults in a value that is a linear interpolation
 * between the two closest values.
 */

"use strict";

var calibration = require('./calibration.json');

function SpeedRPMConvertor() {
}

SpeedRPMConvertor.prototype.convert = function(speed) {
	if (speed < calibration.limits.min) {
		return 0;
	}
	if (speed > calibration.limits.max) {
		speed = calibration.limits.max;
	}
	var i = 0;
	while (i < (calibration.speeds.length - 1) && speed >= calibration.speeds[i + 1].speed) {
		i += 1;
	};
	if (speed == calibration.speeds[i].speed) {
		return calibration.speeds[i].rpm;
	} else {
		return Math.floor(calibration.speeds[i].rpm + (calibration.speeds[i + 1].rpm - calibration.speeds[i].rpm) * ((speed - calibration.speeds[i].speed) / (calibration.speeds[i + 1].speed - calibration.speeds[i].speed)));
	}
}
