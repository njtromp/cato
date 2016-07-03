"use strict";

exports.calculateChecksum = function(message) {
	return _calculateChecksum(message);
}

exports.hasChecksum = function(rawMessage) {
	return _hasChecksum(rawMessage);
}

exports.validateMessage = function(rawMessage) {
	if (_hasChecksum(rawMessage)) {
		var messageParts = rawMessage.split('*');
		var messagePart = messageParts[0];
		var checksumPart = messageParts[1];
		return _matchChecksum(messagePart, checksumPart);
	} else {
		return false;
	}
}

exports.matchChecksum = function(message, checksum) {
    return calculateChecksum(message) === parseInt(checksum, 16);
}

function _calculateChecksum(message) {
	// Start with the first character
	var checksum = 0;
	// process rest of characters, zero delimited
	for(var i = 0; i < message.length; ++i) {
	    checksum = checksum ^ message.charCodeAt(i);
	}
	return checksum & 0xff;
}

function _hasChecksum(rawMessage) {
	return rawMessage.indexOf('*') == (rawMessage.length - 3);
}

function _matchChecksum(message, checksum) {
    return _calculateChecksum(message) === parseInt(checksum, 16);
}
