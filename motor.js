var I2C = require("i2c");
 
var constants = {
    modeRegister1: 0x00, // MODE1
    modeRegister1Default: 0x01,
    channel0OnStepLowByte: 0x06, // LED0_ON_L
    channel0OnStepHighByte: 0x07, // LED0_ON_H
    channel0OffStepLowByte: 0x08, // LED0_OFF_L
    channel0OffStepHighByte: 0x09, // LED0_OFF_H
    registersPerChannel: 4,
    allChannelsOnStepLowByte: 0xFA, // ALL_LED_ON_L
    allChannelsOnStepHighByte: 0xFB, // ALL_LED_ON_H
    allChannelsOffStepLowByte: 0xFC, // ALL_LED_OFF_L
    allChannelsOffStepHighByte: 0xFD, // ALL_LED_OFF_H
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
    this.allChannelsOff();

    this._setFrequency(this.frequency, cb);
}

PWM.prototype._send = function sendCommand(cmd, values) {
    if (!Array.isArray(values)) {
        values = [values];
    }

    this.i2c.writeBytes(cmd, values, function (err) {
        if (err) {
            console.log("Error writing to PCA8685 via I2C", err);
        }
    });
};

PWM.prototype._setFrequency = function setPwmFrequency(freq, cb) {
    // 25MHz base clock, 12 bit (4096 steps per cycle)
    var prescale = Math.round(25000000 / (constants.stepsPerCycle * freq)) - 1;

    if (this.debug) {
        console.log("Setting PWM frequency to", freq, "Hz");
        console.log("Pre-scale value:", prescale);
    }

    this.i2c.readBytes(constants.modeRegister1, 1, createSetFrequencyStep2(this._send, this.debug, prescale, cb));
};

PWM.prototype.setPulseRange = function setPwmRange(channel, onStep, offStep) {
    if (this.debug) {
        console.log("Setting PWM channel, channel:", channel, "onStep:", onStep, "offStep:", offStep);
    }

    this._send(constants.channel0OnStepLowByte + constants.registersPerChannel * channel, onStep & 0xFF);
    this._send(constants.channel0OnStepHighByte + constants.registersPerChannel * channel, (onStep >> 8) & 0x0F);
    this._send(constants.channel0OffStepLowByte + constants.registersPerChannel * channel, offStep & 0xFF);
    this._send(constants.channel0OffStepHighByte + constants.registersPerChannel * channel, (offStep >> 8) & 0x0F);
};
 
PWM.prototype.allChannelsOff = function startAllMotors() {
    this._send(constants.allChannelsOnStepLowByte, 0x00);
    this._send(constants.allChannelsOnStepHighByte, 0x00);
    this._send(constants.allChannelsOffStepLowByte, 0x00);
    this._send(constants.allChannelsOffStepHighByte, 0x10);
};

PWM.prototype.allChannelsOn = function stopAllMotors() {
    this._send(constants.allChannelsOnStepLowByte, 0x00);
    this._send(constants.allChannelsOnStepHighByte, 0x10);
    this._send(constants.allChannelsOffStepLowByte, 0x00);
    this._send(constants.allChannelsOffStepHighByte, 0x00);
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

module.exports = PWM;

pwm = new PWM(options, function() {
    console.log("Initialization done");
    main();
});

function main() {
    // Set channel 0 to turn on on st
    // Set the duty cycle to 25% for channel 8 
    console.log('About the turn the LED on...');
    pwm.setPulseRange(0, 0, 4096);

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
        pwm.setPulseRange(0, 0, brightness);
        setTimeout(dim, 10);    
    }
    dim();

    setTimeout(function () {
        pwm.allChannelsOn();
        console.log('Switched on.');
        setTimeout(function() {
            pwm.allChannelsOff();
            console.log('Switched off.');
            setTimeout(function () {
                pwm.setPulseRange(0, 0, 1024);
                console.log('Dimmed 25%.');
            }, 1000);
        }, 1000);
    }, 13000);

    setTimeout(function() {
        console.log('Shutting down');
        pwm.allChannelsOff();
    }, 16000);

}