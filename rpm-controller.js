/**
 * This module is currently for testing the PWM module.
 */

"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
 
var pwmOptions = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 200,
    debug: false
};

var sensorOptions = {
    sensorPin: 22,
    activeLevel: 1
}

// Constants
var MOTOR_CHANNEL = 0;
var FULL_STOP = 0;
var FULL_AHEAD = 4096;

var pulseSensor = new PulseSensor(sensorOptions);
var pwm = new PWM(pwmOptions, function() {
    console.log("Initializatiing RPM controller");
    var rpmController = new RPMController(pwm, pulseSensor);

    // Temporary code for development
    setTimeout(function() {
        console.log('Stopping the engine...');
        rpmController.setRPM(0);
    }, 20000);
});

function RPMController(pwm, pulseSensor) {
    console.log('About to take control over the RPM...');
    this.targetRPM = 0;
    this.offStep = 0;
    pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
    
    setInterval(this.controlRPM, 300);
}

RPMController.prototype.setRPM = function(rpm) {
    this.targetRPM = rpm;
}

RPMController.prototype.controlRPM = function() {
    var pulseLength = pulseSensor.getAveragePulseLength();
    if (pulseLength > 0) {
        var rpm = Math.floor(10000000000 / pulseLength);
        console.log('RPM [' + rpm + '], targetRPM [' + this.targetRPM + ']');
        var newOffStep = Math.floor(this.offStep * (targetRPM / rpm));
        if (newOffStep > FULL_AHEAD) {
            newOffStep = FULL_AHEAD;
        } else if (newOffStep < FULL_STOP) {
            newOffStep = FULL_STOP;
        }
        if (targetRPM < 300) {
            if (newOffStep - offStep > 20) {
                newOffStep = offStep + 20;
            } else if (newOffStep - offStep < -20) {
                newOffStep = offStep - 20;
            }
        }
    } else {
        // TODO: determine a beter value...
        this.offStep  = 400;
    }
    console.log('New offStep [' + newOffStep + '], current [' + this.offStep + ']');
    this.offStep = newOffStep;
    pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
}
