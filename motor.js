"use strict";

var I2C = require("i2c");
 
var constants = {
    modeRegister1: 0x00, // MODE1
    modeRegister1Default: 0x01, // 0x01 respond to led-all commands
    motorOnStepLowByte: 0x06, // LED0_ON_L
    motorOnStepHighByte: 0x07, // LED0_ON_H
    motorOffStepLowByte: 0x08, // LED0_OFF_L
    motorOffStepHighByte: 0x09, // LED0_OFF_H
    registersPerMotor: 4,
    allMotorsOnStepLowByte: 0xFA, // ALL_LED_ON_L
    allMotorsOnStepHighByte: 0xFB, // ALL_LED_ON_H
    allMotorsOffStepLowByte: 0xFC, // ALL_LED_OFF_L
    allMotorsOffStepHighByte: 0xFD, // ALL_LED_OFF_H
    sleepBit: 0x10,
    restartBit: 0x80,
    preScale: 0xFE, // PRE_SCALE
    stepsPerCycle: 4096
};

var options = {
    i2c: new I2C(0x40, { device: "/dev/i2c-1" }),
    frequency: 50,
    debug: true
};

function PWM(options, cb) {
    if (this.debug) {
        console.log("Initializing...");
    }

    this.i2c = options.i2c;
    this.debug = !!options.debug;
    this.frequency = options.frequency;
    var cycleLengthMicroSeconds = 1000000 / options.frequency;
    this.stepLengthMicroSeconds = cycleLengthMicroSeconds / constants.stepsPerCycle;

    this._send = this._send.bind(this);

    this._send(constants.modeRegister1, constants.modeRegister1Default);
    this.allMotorsOff();

    this._setFrequency(this.frequency, cb);
}

PWM.prototype._send = function(cmd, values) {
    if (!Array.isArray(values)) {
        values = [values];
    }

    this.i2c.writeBytes(cmd, values, function (err) {
        if (err) {
            console.log("Error writing to PCA8685 via I2C", err);
        }
    });
};

PWM.prototype._setFrequency = function(freq, cb) {
    // 25MHz base clock, 12 bit (4096 steps per cycle)
    var prescale = Math.round(25000000 / (constants.stepsPerCycle * freq)) - 1;

    if (this.debug) {
        console.log("Setting PWM frequency to", freq, "Hz");
        console.log("Pre-scale value:", prescale);
    }

    this.i2c.readBytes(constants.modeRegister1, 1, createSetFrequencyStep2(this._send, this.debug, prescale, cb));
};

function createSetFrequencyStep2(sendFunc, debug, prescale, cb) {
    cb = typeof cb === "function" ? cb : function () { return; };

    return function setFrequencyStep2(err, res) {
        if (err) {
            if (debug) {
                console.log("Error reading mode (to set frequency)", err);
            }
            cb(err);
        }

        var oldmode = res[0],
            newmode = (oldmode & ~constants.restartBit) | constants.sleepBit;

        if (debug) {
            console.log("Setting prescale to:", prescale);
        }

        sendFunc(constants.modeRegister1, newmode);
        sendFunc(constants.preScale, Math.floor(prescale));
        sendFunc(constants.modeRegister1, oldmode);

        // documentation says that 500 microseconds are required
        // before restart is sent, so a timeout of 10 milliseconds
        // should be plenty
        setTimeout(function () {
            if (debug) {
                console.log("Restarting controller");
            }

            sendFunc(constants.modeRegister1, oldmode | constants.restartBit);

            cb();
        }, 10);
    };
}
// The motor is allways turned on at the start of the cycle,
// so specifying the off pulse is enough.
PWM.prototype.setMotorPulseOff = function(motor, offStep) {
    offStep &= 0x0FFF;
    if (this.debug) {
        console.log("Setting PWM Motor:", motor, "offStep:", offStep);
    }
    // Just to be on the safe side we set the on pulse as well
    this._send(constants.motorOnStepLowByte + constants.registersPerMotor * motor, 0x00);
    this._send(constants.motorOnStepHighByte + constants.registersPerMotor * motor, 0x00);
    this._send(constants.motorOffStepLowByte + constants.registersPerMotor * motor, offStep & 0xFF);
    this._send(constants.motorOffStepHighByte + constants.registersPerMotor * motor, (offStep >> 8) & 0x0F);
};
 
PWM.prototype.allMotorsOff = function() {
    this._send(constants.allMotorsOnStepLowByte, 0x00);
    this._send(constants.allMotorsOnStepHighByte, 0x00);
    this._send(constants.allMotorsOffStepLowByte, 0x00);
    this._send(constants.allMotorsOffStepHighByte, 0x10);
};

PWM.prototype.allMotorsOn = function() {
    this._send(constants.allMotorsOnStepLowByte, 0x00);
    this._send(constants.allMotorsOnStepHighByte, 0x10);
    this._send(constants.allMotorsOffStepLowByte, 0x00);
    this._send(constants.allMotorsOffStepHighByte, 0x00);
};


module.exports = PWM;

var pwm = new PWM(options, function() {
    console.log("Initialization done");
    controlMotor();
});

function controlMotor() {
    // Set Motor 0 to turn on on st
    // Set the duty cycle to 25% for Motor 0
    console.log('About the turn the Motor on...');
    pwm.setMotorPulseOff(0, 4095);

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
        pwm.setMotorPulseOff(0, brightness);
        setTimeout(dim, 10);    
    }
    dim();
    pwm.allMotorsOff();

    setTimeout(function () {
        pwm.allMotorsOn();
        console.log('Switched on.');
        setTimeout(function() {
            pwm.allMotorsOff();
            console.log('Switched off.');
            setTimeout(function () {
                pwm.setMotorPulseOff(0, 1024);
                console.log('Dimmed 25%.');
            }, 1000);
        }, 1000);
    }, 13000);

    setTimeout(function() {
        console.log('Shutting down');
        pwm.allMotorsOff();
    }, 16000);

}