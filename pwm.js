/**
 * This module controls a PCA9685 AdaFruit PWM board. It is capable of controlling 16 different channels.
 * Using 12 bits (4096) steps per channel. To keep the interface of this module simple every channel is 
 * switched on at step 0 leaving only the off-step to be specified by the client.
 * The PCA9685 has a full on and a full off mode per channel. These modes will be chosen automatically
 * if applicable.
 * When the off-step of a channel is set to 0, the channel is switched off.
 * When the off-step of a channel is set to 4096, the channel is switched on. 
 */

"use strict";

var I2C = require("i2c");
 
var constants = {
    modeRegister1: 0x00, // MODE1
    modeRegister1Default: 0x01, // 0x01 respond to led-all commands
    channelOnStepLowByte: 0x06, // CHANNEL0_ON_LOW
    channelOnStepHighByte: 0x07, // CHANNEL0_ON_HIGH
    channelOffStepLowByte: 0x08, // CHANNEL0_OFF_LOW
    channelOffStepHighByte: 0x09, // CHANNEL0_OFF_HIGH
    registersPerChannel: 4,
    allChannelsOnStepLowByte: 0xFA, // ALL_CHANNEL_ON_LOW
    allChannelsOnStepHighByte: 0xFB, // ALL_CHANNEL_ON_HIGH
    allChannelsOffStepLowByte: 0xFC, // ALL_CHANNEL_OFF_LOW
    allChannelsOffStepHighByte: 0xFD, // ALL_CHANNEL_OFF_HIGH
    sleepBit: 0x10,
    restartBit: 0x80,
    preScale: 0xFE, // PRE_SCALE
    stepsPerCycle: 4096,
    fullStop: 0x1000,
    fullAhead: 0x1000
};

/**
 * Creates a PWM controller for a specific PCA9685 board.
 *
 * @param: options has three properties.
 * - i2c: the I2C instance that takes care of the low-level communication.
 * - frequence: the frequency in HZ that the PCA9685 will be using. 
 * - debug: false/true which controls the logging at debug level.
 *
 * @param: startPWMControl is a function that is called after the PCA9685 board has been initialized
 * and that can start the motor control.
 */
function PWM(options, startPWMControl) {
    this.debug = !!options.debug;

    if (this.debug) {
        console.log("Initializing...");
    }

    this.i2c = options.i2c;
    this.frequency = options.frequency;
    var cycleLengthMicroSeconds = 1000000 / options.frequency;
    this.stepLengthMicroSeconds = cycleLengthMicroSeconds / constants.stepsPerCycle;

    this._send = this._send.bind(this);

    this._send(constants.modeRegister1, constants.modeRegister1Default);
    this.allChannelsOff();

    this._setFrequency(this.frequency, startPWMControl);
}

/**
 * Sets the off-step for a single channel. A channel
 * always is set on at step 0 so it is sufficient to
 * only specify the off-step.
 * When the off-step is 0 the channel will be switched off.
 * When the off-step is 4096 the channel will be switched on.
 */
PWM.prototype.setChannelOffStep = function(channel, offStep) {
    checkChannel(channel);
    checkOffStep(offStep);
    if (offStep == 0) {
        this.switchChannelOff(channel);
    } else if (offStep == constants.fullAhead) {
        this.switchChannelOn(channel);
    } else {
        if (this.debug) {
            console.log("Setting PWM channel:", channel, "offStep:", offStep);
        }
        // Just to be on the safe side we set the on pulse as well
        this._send(constants.channelOnStepLowByte + constants.registersPerChannel * channel, 0x00);
        this._send(constants.channelOnStepHighByte + constants.registersPerChannel * channel, 0x00);
        this._send(constants.channelOffStepLowByte + constants.registersPerChannel * channel, offStep & 0xFF);
        this._send(constants.channelOffStepHighByte + constants.registersPerChannel * channel, (offStep >> 8) & 0x0F);
    }
};

/**
 * Switches a single channel on.
 */
PWM.prototype.switchChannelOn = function(channel) {
    if (this.debug) {
        console.log("Full ahead channel:", channel);
    }
    checkChannel(channel);
    this._send(constants.channelOnStepLowByte + constants.registersPerChannel * channel, constants.fullAhead & 0xFF);
    this._send(constants.channelOnStepHighByte + constants.registersPerChannel * channel, constants.fullAhead >> 8);
    // Just to be on the safe side we set the off pulse as well
    this._send(constants.channelOffStepLowByte + constants.registersPerChannel * channel, 0x00);
    this._send(constants.channelOffStepHighByte + constants.registersPerChannel * channel, 0x00);
}
 
/**
 * Switches a single channel off.
 */
PWM.prototype.switchChannelOff = function(channel) {
    if (this.debug) {
        console.log("Full stop channel:", channel);
    }
    checkChannel(channel);
    // Just to be on the safe side we set the on pulse as well
    this._send(constants.channelOnStepLowByte + constants.registersPerChannel * channel, 0x00);
    this._send(constants.channelOnStepHighByte + constants.registersPerChannel * channel, 0x00);
    this._send(constants.channelOffStepLowByte + constants.registersPerChannel * channel, constants.fullStop & 0xFF);
    this._send(constants.channelOffStepHighByte + constants.registersPerChannel * channel, constants.fullStop >> 8);
}

/**
 * Switches all channels off.
 */
PWM.prototype.allChannelsOff = function() {
    this._send(constants.allChannelsOnStepLowByte, 0x00);
    this._send(constants.allChannelsOnStepHighByte, 0x00);
    this._send(constants.allChannelsOffStepLowByte, 0x00);
    this._send(constants.allChannelsOffStepHighByte, 0x10);
};

/**
 * Switches all channels on.
 */
PWM.prototype.allChannelsOn = function() {
    this._send(constants.allChannelsOnStepLowByte, 0x00);
    this._send(constants.allChannelsOnStepHighByte, 0x10);
    this._send(constants.allChannelsOffStepLowByte, 0x00);
    this._send(constants.allChannelsOffStepHighByte, 0x00);
};

/**
 * Private function, should be hidden from clients!
 */
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

/**
 * Private function, should be hidden from clients!
 */
PWM.prototype._setFrequency = function(freq, tartPWMControl) {
    // 25MHz base clock, 12 bit (4096 steps per cycle)
    var prescale = Math.round(25000000 / (constants.stepsPerCycle * freq)) - 1;

    if (this.debug) {
        console.log("Setting PWM frequency to", freq, "Hz");
        console.log("Pre-scale value:", prescale);
    }

    this.i2c.readBytes(constants.modeRegister1, 1, createSetFrequencyStep2(this._send, this.debug, prescale, tartPWMControl));
};

/**
 * Private function.
 */
function createSetFrequencyStep2(sendFunc, debug, prescale, startPWMControl) {
    startPWMControl = typeof startPWMControl === "function" ? startPWMControl : function () { return; };

    return function setFrequencyStep2(err, res) {
        if (err) {
            if (debug) {
                console.log("Error reading mode (to set frequency)", err);
            }
            startPWMControl(err);
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

            startPWMControl();
        }, 10);
    };
}

function checkChannel(channel) {
    if (channel < 0 || channel > 15) {
        throw "Invalid channel specified [" + channel + "], valid numers are 0..15.";
    }
}

function checkOffStep(offStep) {
    if (offStep < 0 || offStep > 4096) {
        throw "Invalid offStep specified [" + offStep + "], valid numers are 0..4096.";
    }
}

module.exports = PWM;