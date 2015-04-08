"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
var RPMController = require('./rpm-controller');
 
var pwmOptions = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 100,
    debug: false
};

var sensorOptions = {
    sensorPin: 22,
    activeLevel: 1
}

var rpmOptions = {
    repeatInterval: 300,
    autoOffDelay: 20000,
    debug: false
}

function createRPMController() {
	var pwm = new PWM(pwmOptions);
	var pulseSensor = new PulseSensor(sensorOptions);
	return new RPMController(rpmOptions, pwm, pulseSensor);
}

module.exports = createRPMController;