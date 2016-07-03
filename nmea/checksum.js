"use strict";

module.exports = calculateChecksum;
module.exports = hasChecksum;
module.exports = validateMessage;
module.exports = matchChecksum;

function calculateChecksum(message) {
	    // Start with the first character
    var checksum = 0;
    // process rest of characters, zero delimited
    for(var i = 0; i < message.length; ++i) {
        checksum = checksum ^ message.charCodeAt(i);
    }
    return checksum & 0xff;
}

function hasChecksum(rawMessage) {
	return rawMessage.indexOf('*') == rawMessage.length - 3;
}

function validateMessage(rawMessage) {
	if (hasChecksum(rawMessage)) {
		var messageParts = rawMessage.split('*');
		var messagePart = messageParts[0];
		var checksumPart = messageParts[1];
		return matchChecksum(messagePart, checksumPart);
	} else {
		return false;
	}
}

function matchChecksum(message, checksum) {
    return calculateChecksum(message) === parseInt(checksum, 16);
}
