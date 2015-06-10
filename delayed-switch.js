/**
 * This module contains a switch that does not immediately switches to
 * the new value. Upon the first flip only after the delay as expired
 * the switch is flipped to its new value if and only if the switch is
 * not flipped back.
 */

"use strict";

var Constants = {
	OFF: 0,
	ON: 1
}

/**
 * Creates a new DelayedSwitch.
 *
 * @param: config has one property.
 * - delayInMillis: the delay in milliseconds after which the switch is switchable again.
 * - initialState: the initial state of the switch. If it is flipped on the 'onCallback'
 *                 function will be called. 
 * @param: onCallback is a function that will be called when the switch is switched
 *                    on, taking into acount the delay specified by config.delay.
 * @param: offCallback is a function that will be called when the switch is switched
 *                    off, taking into acount the delay specified by config.delay.
 */
function DelayedSwitch(config, onCallback, offCallback) {
	this.switchState = Constants.OFF;
	this.requestedState = config.initialState;
	this.onCallback = onCallback;
	this.offCallback = offCallback;
	this.switchBlocked = false;
	this.delayInMillis = config.delayInMillis;
	flipSwitchIfNeeded(this);
}

DelayedSwitch.prototype.switchOn = function() {
	requestFlip(this, Constants.ON);
}

DelayedSwitch.prototype.switchOff = function() {
	requestFlip(this, Constants.OFF);
}

function requestFlip(self, newState) {
	self.requestedState = newState;
	if (!self.switchBlocked) {
		startDelayedSwitch(self);
	}
}

function startDelayedSwitch(self) {
	blockSwitch(self);
	delaySwitch(self);
}

function blockSwitch(self) {
	self.switchBlocked = true;
}

function unblockSwitch(self) {
	self.switchBlocked = false;
}

function delaySwitch(self) {
	setTimeout(function() {
		flipSwitchIfNeeded(self);
		unblockSwitch(self);
	}, self.delayInMillis);
}

function flipSwitchIfNeeded(self) {
	if (self.switchState != self.requestedState) {
		self.switchState = self.requestedState;
		if (self.switchState == Constants.ON) {
			self.onCallback();
		} else {
			self.offCallback();
		}
	}
}

module.exports = DelayedSwitch;
