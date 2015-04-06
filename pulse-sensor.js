/**
 * This module measures the pulselength of a IR sensor that detects the rotation
 * of disc (whith intermitted holes) that is attached to a electronic motor. 
 */

"use strict";

var Gpio = require('onoff').Gpio;

// Used to have a reference to the sensor object inside the method that is called by the GPIO code
// on every new pulse.
var THIS = null;

/**
 * Starts a new sensor. 
 *
 * @param: options has two properties.
 * - sensorPin: the GPIO pin number to which the pulse sensor is attached.
 * - activeLevel: the level (0 or 1) which is considered as the start of a new pulse. 
 *
 * @param: pulseCallback function is called on every pulse. This method takes a single
 * parameter that will have the value of the pulselength in nanoseconds of the last pulse.
 */
function PulseSensor(options, pulseCallback) {
  console.log('Installing RPM sensor listener.');
  this.pulseCallback = typeof pulseCallback === "function" ? pulseCallback : function(pulseLengthInNanos) { return; };
  this.sensorPin = options.sensorPin;
  this.activeLevel = options.activeLevel;
  this.lastSwitch = -1;
  this.pulses = new Array();
  
  this.sensor = new Gpio(options.sensorPin, 'in', 'both');
  this.sensor.watch(this._registerPulse);
  THIS = this;
}

/**
 * Retuns the average pulse length of the pulses since the
 * last call to this function. The pulse length is in nanosecods.
 * A value
 */
PulseSensor.prototype.getAveragePulseLength = function() {
  if (this.pulses.length == 0) {
    return -1;
  } else {
    var copyOfPulses = this.pulses.splice(0, this.pulses.length);
    return averagePulseLength(copyOfPulses);
  }
}

function averagePulseLength(copyOfPulses) {
  var sum = 0;
  for (var i = 0; i < copyOfPulses.length; i++) {
    sum += copyOfPulses[i];
  }
  return sum / copyOfPulses.length;
}

/**
 * Private function, should be hidden from clients!
 */
PulseSensor.prototype._registerPulse = function(err, value) {
  if (value == THIS.activeLevel) {
    var currentSwitch = convertNanoTimeData(process.hrtime());
    if (THIS.lastSwitch != -1) {
      var pulseLengthInNanos = currentSwitch - THIS.lastSwitch;
      THIS.pulses.push(pulseLengthInNanos);
      THIS.pulseCallback(pulseLengthInNanos);
    }
    THIS.lastSwitch = currentSwitch;
  }
}

function convertNanoTimeData(nanoTimeData) {
  return (nanoTimeData[0] * 1000000000) + nanoTimeData[1];
} 

module.exports = PulseSensor;