"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
var RPMController = require('./rpm-controller');
var GPSListener = require('./gpsd-listener');
var LogController =  require('./log-controller');
 
var PWMOptions = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 100,
    debug: false
};

var SensorOptions = {
    sensorPin: 22,
    activeLevel: 1
}

var RPMOptions = {
    repeatInterval: 300,
    autoOffDelay: 20000,
    debug: false
}

function createRPMController() {
	var pwm = new PWM(PWMOptions);
	var pulseSensor = new PulseSensor(SensorOptions);
	return new RPMController(RPMOptions, pwm, pulseSensor);
}

var GPSDOptions = {
    port: 2947,
    hostname: 'localhost',
    debug: true
}

function createLogController() {
    var rpmController = createRPMController();
    var logController = new LogContoller(rpmController);
    var gpsdListener = new GPSListener(GPSDOptions, logController.setSpeed);
    return logController;
}

module.exports = {
    createRPMController,
    createLogController
}