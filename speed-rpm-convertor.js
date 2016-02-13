/**
 * This modules converts a speed in knots (nautical miles per hour) into the RPM the log-motor should have.
 * If the speed is less then the minimum value the log-motor will be turned off by returning 0. If the speed
 * is higher then the maximum the RPM value for the maximum is returned. Any other speed results in a value
 * that is a linear interpolation between the two closest values.
 */

"use strict";

var calibration = require('./calibration.json');

function convertSpeed2RPM(speed) {
	// Switch off if below minimum
	if (speed < calibration.limits.min) {
		return 0;
	}
	// Keep within limits
	if (speed > calibration.limits.max) {
		speed = calibration.limits.max;
	}
	return interpolate(speed, findLowestCalibrationPoint(speed));
}

function findLowestCalibrationPoint(speed) {
	var i = 0;
	while (i < (calibration.speeds.length - 1) && speed >= calibration.speeds[i + 1].speed) {
		i += 1;
	};
	return i;
}

function interpolate(speed, lowerstCalibrationPoint) {
	// Just a short-cut to keep the code small ;-)
	var i = lowerstCalibrationPoint;
	if (speed == calibration.speeds[i].speed) {
		return calibration.speeds[i].rpm;
	} else {
		return Math.floor(calibration.speeds[i].rpm + (calibration.speeds[i + 1].rpm - calibration.speeds[i].rpm) * ((speed - calibration.speeds[i].speed) / (calibration.speeds[i + 1].speed - calibration.speeds[i].speed)));
	}
}

module.exports = convertSpeed2RPM;