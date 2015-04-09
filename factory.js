"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
var RPMController = require('./rpm-controller');
var GPSDListener = require('./gpsd-listener');
var LogController =  require('./log-controller');
 
var Options = {
    PWM: {
        i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
        frequency: 100,
        debug: false
    },
    PulseSensor: {
        sensorPin: 22,
        activeLevel: 1
    },
    RPM: {
        repeatInterval: 300,
        autoOffDelay: 20000,
        debug: true
    },
    GPSD: {
        port: 2947,
        hostname: 'localhost',
        mockSpeed: true,
        mockInterval: 3000,
        debug: true
    }
}

function Factory() {}

Factory.prototype.createRPMController = function() {
	var pwm = new PWM(Options.PWM);
	var pulseSensor = new PulseSensor(Options.PulseSensor);
	return new RPMController(Options.RPM, pwm, pulseSensor);
}

Factory.prototype.createLogController = function() {
    var rpmController = this.createRPMController();
    var logController = new LogController(rpmController);
    var gpsdListener = new GPSDListener(Options.GPSD, logController);
    return logController;
}

module.exports = Factory;
