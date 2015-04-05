/**
 * This module is currently for testing the PWM module.
 */

"use strict";

var I2C = require("i2c");
var PWM = require("./pwm");
 
var options = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 50,
    debug: true
};

var pwm = new PWM(options, function() {
    console.log("Initialization done");
    controlMotor();
});

function controlMotor() {
    // Set Motor 0 to turn on on st
    // Set the duty cycle to 25% for Motor 0
    //console.log('About the turn the Motor on...');
    //pwm.setChannelOffStep(0, 4095);

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
        pwm.setChannelOffStep(0, brightness);
        setTimeout(dim, 10);    
    }
    // Start the cycle
    // dim();
    pwm.allChannelsOff();

    setTimeout(function () {
        pwm.switchChannelOn(0);
        console.log('Switched on.');
        setTimeout(function() {
            pwm.switchChannelOff(0);
            console.log('Switched off.');
            setTimeout(function () {
                pwm.setChannelOffStep(0, 1024);
                console.log('Dimmed 25%.');
            }, 1000);
        }, 1000);
    }, 1000);

    setTimeout(function() {pwm.setChannelOffStep(0, 4096);},4000);
    setTimeout(function() {pwm.setChannelOffStep(0, 0);},7000);

    setTimeout(function() {
        console.log('Shutting down');
        pwm.allChannelsOff();
    }, 16000);

}