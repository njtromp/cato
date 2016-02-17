/**
 * This module can adjust a PWM module so that the RPM that is measured by a pulseSensor
 * matches that which the module is supposed to maintain.
 */

"use strict";

// Constants
var MOTOR_CHANNEL = 0;
var FULL_STOP = 0;
var FULL_AHEAD = 4096;

function RPMController(config, pwm, pulseSensor, voltageReductionSwitch) {
    this.targetRPM = 0;
    this.offStep = 0;
    this.debug = config.debug;
    this.startStep = config.startStep;
    this.powerThreshold = config.powerThreshold;
    this.adjustmentThreshold = config.adjustmentThreshold;
    this.smallStepChange = config.smallStepChange;
    this.largeStepChange = config.largeStepChange;
    this.voltageReductionFactor = config.voltageReductionFactor;
    this.pwm = pwm;
    this.pulseSensor = pulseSensor;
    this.voltageReductionSwitch = voltageReductionSwitch;
    if (this.debug) {
        console.log('About to take control over the RPM...');
    }

    this.pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
    var _this = this;
    setInterval(function() {
        _this.controlRPM();
    }, config.repeatInterval);
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
            if (currentRPM < this.adjustmentThreshold) {
                newOffStep = limitChange(this.offStep, newOffStep, this.smallStepChange);
            } else {
                newOffStep = limitChange(this.offStep, newOffStep, this.largeStepChange);
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
                this.offStep  = this.startStep;
            }
        }
    }
    
    if (this.targetRPM >= this.powerThreshold) {
        this.voltageReductionSwitch.switchOff(this);
    } else {
        this.voltageReductionSwitch.switchOn(this);
    }
    this.pwm.setChannelOffStep(MOTOR_CHANNEL, this.offStep);
}

RPMController.prototype.switchingToLowVoltage = function() {
    if (this.debug) {
        console.log('Increasing the offStep due to switching to low voltage mode.');
    }
    this.offStep = Math.Min(FULL_AHEAD, Math.floor(this.offStep * this.voltageReductionFactor));
    this.controlRPM();
}

RPMController.prototype.switchingToHighVoltage = function() {
    if (this.debug) {
        console.log('Reducing the offStep due to switching to high voltage mode.');
    }
    this.offStep = Math.floor(this.offStep / this.voltageReductionFactor);
    this.controlRPM();
}

function determineRPM(pulseLength) {
    // TODO explain where the magic number comes from
    return Math.floor(10000000000 / pulseLength);
}

function limitChange(curentOffStep, newOffStep, limit) {
    var change = Math.min(Math.abs(curentOffStep - newOffStep), limit);
    return newOffStep >= curentOffStep ? curentOffStep + change : curentOffStep - change;
}

module.exports = RPMController;