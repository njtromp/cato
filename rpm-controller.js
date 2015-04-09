/**
 * This module can adjust a PWM module so that the RPM that is measured by a pulseSensor
 * matches that which the module is supposed to maintain.
 */

"use strict";

// Constants
var MOTOR_CHANNEL = 0;
var FULL_STOP = 0;
var FULL_AHEAD = 4096;

function RPMController(options, pwm, pulseSensor) {
    this.targetRPM = 0;
    this.offStep = 0;
    this.debug = options.debug;
    this.pwm = pwm;
    this.pulseSensor = pulseSensor;
    if (this.debug) {
        console.log('About to take control over the RPM...');
    }

    this.pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
    var _this = this;
    setInterval(function() {
        _this.controlRPM();
    }, options.repeatInterval);
}

RPMController.prototype.setRPM = function(rpm) {
    if (this.debug) {
        console.log('New target RPM [' + rpm + ']');
    }
    this.targetRPM = rpm;
}

/**
 * Private function.
 */
RPMController.prototype.controlRPM = function() {
    if (this.targetRPM == 0) {
        this.offStep = 0;
    } else {
        var pulseLength = this.pulseSensor.getAveragePulseLength();
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
    
    this.pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
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

module.exports = RPMController;