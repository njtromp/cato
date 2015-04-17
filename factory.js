"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
var RPMController = require('./rpm-controller');
var GPSDListener = require('./gpsd-listener');
var LogController =  require('./log-controller');
var config = require('./config.json'); 

var config = {
    PWM: {
        i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
        frequency: 100, // Hz
        debug: false
    },
    PulseSensor: {
        sensorPin: 22,
        activeLevel: 1
    },
    RPM: {
        repeatInterval: 300, // Milliseconds between every RPM control cycle.
        debug: false
    },
    GPSD: {
        port: 2947,
        hostname: 'localhost',
        mockSpeed: false,
        mockInterval: 3000, // Milliseconds between mocked speed updates.
        debug: true
    }
}

function Factory() {}

/**
 * Creates a RPM controller that can be used to control the RPM.
 * The RPM controller uses a PWM and a PulseSensor instance which are also created.
 */
Factory.prototype.createRPMController = function() {
	var pwm = new PWM(config.PWM);
	var pulseSensor = new PulseSensor(config.PulseSensor);
	return new RPMController(config.RPM, pwm, pulseSensor);
}

/**
 * Creates a log controller that takes care of passing speed updates to the log-motor.
 * The LogController uses a GPSDListener and a RPMController instance which are also created.
 */
Factory.prototype.createLogController = function() {
    var rpmController = this.createRPMController();
    var logController = new LogController(rpmController);
    var gpsdListener = new GPSDListener(config.GPSD, logController);
    return logController;
}

module.exports = Factory;
