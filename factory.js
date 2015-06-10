"use strict";

var Constants = {
    OFF: 0,
    ON: 1
}

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
var RPMController = require('./rpm-controller');
var GPSDListener = require('./gpsd-listener');
var LogController =  require('./log-controller');
var DelayedSwitch = require('./delayed-switch');
var GPIO = require('onoff').Gpio;
var config = require('./config.json'); 

function Factory() {}

/**
 * Creates a RPM controller that can be used to control the RPM.
 * The RPM controller uses a PWM and a PulseSensor instance which are also created.
 */
Factory.prototype.createRPMController = function() {
	var pwm = new PWM(config.PWM);
	var pulseSensor = new PulseSensor(config.PulseSensor);
    var powerSwitch = createPowerSwitch();
	return new RPMController(config.RPM, pwm, pulseSensor, powerSwitch);
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

function createPowerSwitch() {
    var powerSwitch = new GPIO(config.PowerSwitch.switchPin, 'out');
    var onFunction = function() {
        if (config.PowerSwitch.debug) {
            console.log('Flipping the power switch to ON');
        }
        powerSwitch.writeSync(Constants.ON);
    };
    var offFunction = function() {
        if (config.PowerSwitch.debug) {
            console.log('Flipping the power switch to OFF');
        }
        powerSwitch.writeSync(Constants.OFF);
    };
    // Wrap the actual powerswitch in a delayed switch
    // this will ensure that the power is not switched on and off every control interval
    return new DelayedSwitch(config.PowerSwitch, onFunction, offFunction);
}

module.exports = Factory;
