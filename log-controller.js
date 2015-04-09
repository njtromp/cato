"use strict";

var convertSpeed2RPM = require('./speed-rpm-convertor');

function LogController(rpmController) {
	this.rpmController = rpmController;
}

LogController.prototype.setSpeed = function(speed) {
	var rpm =  convertSpeed2RPM(speed);
	console.log('New RPM [' + rpm + ']');
	this.rpmController.setRPM(rpm);
}

module.exports = LogController;