/**
 * Message is the base-class for NMEA messages. It only does some basic validations.
 * When constructing a new Message a raw NMEA message must be provided to the constructor.
 * The constructor does some basic validation, based on the parameter type and value.
 * When something goes wrong a JSON object is throw containing at least two attributes.
 * A 'type' attribute of type string which indicates what kind of error it is. And a 'message'
 * attribute of type string which holds more specific onformation on the error.
 */

"use strict";

module.exports = NMEAMessage;

var CheckSum = require('./checksum');

/**
 * Creates a new Message.
 * @param rawMessage - raw, pure NMEA, message.
 */
function NMEAMessage(rawMessage) {
	if (typeof rawMessage !== 'string') {
		throw {type: "IllegalArgurment", message: "Wrong dataype [" + typeof rawMessage + "] is being used, expecting a string!"};
	}
	if (rawMessage === null) {
		throw {type: "Illegalargument", message: "The message specified can't be null!"};
	}
	this.rawMessage = rawMessage;
	this.messageParts = rawMessage.split(',');
	if (this.hasChecksum()) {
		this.messageParts[this.messageParts.length - 1] = this.messageParts[this.messageParts.length - 1].split('*')[0];
	}
}

/**
 * Determines if the message matches the build-in checksum.
 * @Returns <true> if the message matches the checksum, <false> otherwise.
 */
NMEAMessage.prototype.hasChecksum = function() {
	return hasMinimalNeededLength(this.rawMessage) && CheckSum.hasChecksum(this.rawMessage);
}

/**
 * Determines if the message is valid e.g. if a checksum is present the message matches
 * the checksum.
 */
NMEAMessage.prototype.isValid = function() {
	if (this.hasChecksum() && startsWithDollar(this.rawMessage)) {
		return CheckSum.validateMessage(this.rawMessage.substring(1));
	} else {
		return false;
	}
}

/**
 * Returns the source ID for this NMEA message.
 */
NMEAMessage.prototype.getSourceID = function() {
	return this.messageParts[0].substring(1,3);
}

/**
 * Returns the message id for this NMEA message.
 */
NMEAMessage.prototype.getMessageID = function() {
	return this.messageParts[0].substring(3);
}

/**
 * Returns the original unparsed NMEA message.
 */
NMEAMessage.prototype.getRawMessage = function() {
	return this.rawMessage;
}

/**
 * Returns a specific element from the raw message.
 */
NMEAMessage.prototype.getElement = function(elementID, returnType) {
	if (elementID < 1 || elementID >= this.messageParts.length) {
		throw {type: "IndexOutOfBounds", message: "The element id [${elementID}] is not withing the allowed  (1, ${(this.messageParts.length - 1)})range!"}
	}
	switch (returnType) {
		case 'string' :
			return this.messageParts[elementID];
		case 'int' :
			return Math.floor(Number(this.messageParts[elementID]));
		case 'double' :
			return Number(this.messageParts[elementID]);
		default :
			throw {type: "IllegalArgurment", message: "Unknown returntype [${returnType}]!"};
	}
}

/*
 * Does a very minimalistic check based on the length of the raw message.
 * All messages start with a dollar-sign, a two character source-id and a three character message-id
 * so that gives us some indication of the minimal length.
 */
function hasMinimalNeededLength(rawMessage) {
	return rawMessage.length > '$IDMSG'.length;
}

/*
 * Checks if the message starts with a dollar-sign.
 * @Returns <true> if the first character is a dollar-sign, <false> otherwise.
 */
function startsWithDollar(rawMessage) {
	return rawMessage.startsWith('$');
}
