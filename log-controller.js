"use strict";

var convertSpeed2RPM = require('./speed-rpm-convertor').convertSpeed2RPM;

function LogController(rpmController) {
	this.rpmController = rpmController;
}

LogController.prototype.setSpeed = function(speed) {
	var rpm =  convertSpeed2RPM(speed);
	this.rpmController.setRPM(rpm);
}

module.exports = LogController;