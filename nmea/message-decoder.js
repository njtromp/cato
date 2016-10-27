"use strict";

module.exports = MessageDecoder;

var NMEAMessage = require('./nmea-message');

function MessageDecoder() {
	this.decoders = new Map();
	this.unknownMessageHandler = function(rawMessage) {
		console.log('Unknown message [' + rawMessage + ']!');
		return null;
	}
}

MessageDecoder.prototype.addDecoder = function(messageID, decoder) {
	if (!NMEAMessage.prototype.isPrototypeOf(decoder.prototype)) {
		throw new TypeError('Decoder for ' + messageID + 'is not a subclass of NMEAMessage!');
	}
	this.decoders.set(messageID, decoder);
}

MessageDecoder.prototype.setUnknownMessageHandler = function(unknownMessageHandler) {
	this.unknownMessageHandler = unknownMessageHandler;
}

MessageDecoder.prototype.decode = function(rawMessage) {
	var messageID = rawMessage.substring(3, 6);
	if (this.decoders.has(messageID)) {
		var MessageType = this.decoders.get(messageID);
		return new MessageType(rawMessage);
	} else {
		return this.unknownMessageHandler(rawMessage);
	}
}