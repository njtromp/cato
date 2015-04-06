/**
 * This module is currently for testing the PWM module.
 */

"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
var PulseSensor = require('./pulse-sensor');
 
var pwmOptions = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 50,
    debug: true
};

var sensorOptions = {
    sensorPin: 22,
    activeLevel: 1
}

// Constants
var MOTOR_CHANNEL = 0;
var FULL_STOP = 0;
var FULL_AHEAD = 4096;

var pulseSensor = new PulseSensor(sensorOptions, function(bla) {console.log(bla);});
var pwm = new PWM(pwmOptions, function() {
    console.log("Initialization done");
    controlMotor(pwm, pulseSensor);
});

function controlMotor(pwm, pulseSensor) {
    //console.log('About the turn the Motor on...');
    //pwm.setChannelOffStep(0, 4095);
    setInterval(function() {
        var pulseLength = pulseSensor.getAveragePulseLength();
        if (pulseLength > 0) {
            console.log('RPM ' + Math.floor(10000000000 / pulseLength));
        }
    }, 300);

    var direction = -1;
    var brightness = 4095;
    function dim() {
        brightness += direction * 100;
        if (brightness < 0) {
            direction = +1;
            brightness = 0;
        } else if (brightness > 4095) {
            direction = -1;
            brightness = 4095;
        }
        pwm.setChannelOffStep(MOTOR_CHANNEL, brightness);
        setTimeout(dim, 10);    
    }
    // Start the cycle
    // dim();
    pwm.allChannelsOff();

    setTimeout(function () {
        pwm.switchChannelOn(MOTOR_CHANNEL);
        console.log('Switched on.');
        setTimeout(function() {
            pwm.switchChannelOff(MOTOR_CHANNEL);
            console.log('Switched off.');
            setTimeout(function () {
                pwm.setChannelOffStep(MOTOR_CHANNEL, 1024);
                console.log('Dimmed 25%.');
            }, 1000);
        }, 1000);
    }, 1000);

    setTimeout(function() {pwm.setChannelOffStep(MOTOR_CHANNEL, FULL_AHEAD);}, 4000);
    setTimeout(function() {pwm.setChannelOffStep(MOTOR_CHANNEL, FULL_STOP);}, 7000);

    setTimeout(function() {
        console.log('Shutting down');
        pwm.allChannelsOff();
    }, 10000);

}