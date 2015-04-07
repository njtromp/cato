/**
 * This module is currently for testing the PWM module.
 */

"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
 
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

var pulseSensor = new PulseSensor(sensorOptions);
var rpmController = null;
var pwm = new PWM(pwmOptions, function() {
    rpmController = new RPMController(rpmOptions, pwm, pulseSensor);
    rpmController.setRPM(100);
});

// Constants
var MOTOR_CHANNEL = 0;
var FULL_STOP = 0;
var FULL_AHEAD = 4096;

function RPMController(options, pwm, pulseSensor) {
    this.targetRPM = 0;
    this.offStep = 0;
    this.debug = options.debug;
    if (this.debug) {
        console.log('About to take control over the RPM...');
    }

    pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
    var _this = this;
    setInterval(function() {
        _this.controlRPM();
    }, options.repeatInterval);

    if (options.autoOffDelay > 0) {
        console.log('Activating auto stop.');
        setTimeout(function() {
            console.log('Auto stop activated!');
            _this.setRPM(0);
        }, options.autoOffDelay);
    }
}

RPMController.prototype.setRPM = function(rpm) {
    if (this.debug) {
        console.log('New target RPM [' + rpm + ']');
    }
    this.targetRPM = rpm;
}

RPMController.prototype.controlRPM = function() {
    if (this.targetRPM == 0) {
        this.offStep = 0;
    } else {
        var pulseLength = pulseSensor.getAveragePulseLength();
        if (pulseLength > 0) {
            // We are able to determine the RPM
            var currentRPM = determineRPM(pulseLength);
            if (this.debug) {
                console.log('Target RPM [' + this.targetRPM + '], actual RPM [' + currentRPM + ']');
            }
            // Do a rough estimation for the new off-step
            var newOffStep = Math.floor(this.offStep * (this.targetRPM / currentRPM));
            // Keep it real
            if (newOffStep > FULL_AHEAD) {
                newOffStep = FULL_AHEAD;
            } else if (newOffStep < FULL_STOP) {
                newOffStep = FULL_STOP;
            }
            // When running slowly, only do minor adjustments.
            if (currentRPM < 200) {
                newOffStep = limitChange(this.offStep, newOffStep, 10);
            } else {
                newOffStep = limitChange(this.offStep, newOffStep, 100);
            }
            if (this.debug) {
                console.log('Current off-step [' + this.offStep + '], new off-step [' + newOffStep + ']');
            }
            this.offStep = newOffStep;
        } else {
            // Not running but it should be running
            if (this.targetRPM > 0) {
                if (this.debug) {
                    console.log('Ignition...');
                }
                this.offStep  = 800;
            }
        }
    }
    
    pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
}

function determineRPM(pulseLength) {
    return Math.floor(10000000000 / pulseLength);
}

function limitChange(curentOffStep, newOffStep, limit) {
    if (newOffStep - curentOffStep > limit) {
        newOffStep = curentOffStep + limit;
    } else if (newOffStep - curentOffStep < -limit) {
        newOffStep = curentOffStep - limit;
    }
    return newOffStep;
}