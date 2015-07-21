/**
 * This module measures the pulselength of a IR sensor that detects the rotation
 * of a disc (whith intermitted holes) that is attached to a electronic motor. 
 */

"use strict";

var Gpio = require('onoff').Gpio;

/**
 * Starts a new sensor. 
 *
 * @param: config has two properties.
 * - sensorPin: the GPIO pin number to which the pulse sensor is attached.
 * - activeLevel: the level (0 or 1) which is considered as the start of a new pulse. 
 *
 * @param: pulseCallback (optional) function is called on every pulse. This method takes a single
 * parameter that will have the value of the pulselength in nanoseconds of the last pulse.
 */
function PulseSensor(config, pulseCallback) {
  console.log('Installing RPM sensor listener.');
  this.pulseCallback = typeof pulseCallback === "function" ? pulseCallback : function(pulseLengthInNanos) { return; };
  this.sensorPin = config.sensorPin;
  this.activeLevel = config.activeLevel;
  this.lastSwitch = -1;
  this.pulses = new Array();
  
  this.sensor = new Gpio(config.sensorPin, 'in', 'both');
  var _this = this;
  this.sensor.watch(function(err, value) {
    _this.registerPulse(value)
  });
}

/**
 * Retuns the average pulse length of the pulses since the
 * last call to this function. The pulse length is in nanosecods.
 * A value of -1 indicates that no pulse has been detected since
 * the previous pulse!
 */
PulseSensor.prototype.getAveragePulseLength = function() {
  if (this.pulses.length == 0) {
    return -1;
  } else {
    var copyOfPulses = this.pulses.splice(0, this.pulses.length);
    return averagePulseLength(copyOfPulses);
  }
}

/**
 * Adds new pulse to the set of pulses and calls the pulseCallback function.
 */
PulseSensor.prototype.registerPulse = function(value) {
  if (value == this.activeLevel) {
    var currentSwitch = convertNanoTimeData(process.hrtime());
    if (this.lastSwitch != -1) {
      var pulseLengthInNanos = currentSwitch - this.lastSwitch;
      this.pulses.push(pulseLengthInNanos);
      this.pulseCallback(pulseLengthInNanos);
    }
    this.lastSwitch = currentSwitch;
  }
}

/**
 * Converts the nano-second time construct (from process.hrtime()) into a single value.
 */
function convertNanoTimeData(nanoTimeData) {
  return (nanoTimeData[0] * 1000000000) + nanoTimeData[1];
} 

/**
 * Returns the average pulse length of the pulses present in copyOfPulses.
 */
function averagePulseLength(copyOfPulses) {
  var sum = 0;
  for (var i = 0; i < copyOfPulses.length; i++) {
    sum += copyOfPulses[i];
  }
  return sum / copyOfPulses.length;
}

module.exports = PulseSensor;