/**
 * This modules ensures that the Raspberry PI clock stays wihtin a one second 
 * difference from the time received from the GPS. After the first correction
 * the Raspberry PI clock is only checked once every minute. (Assuming the 
 * GPS emits a time related message every second.)
 * In order to use the time emitted by the GPS the raw RMC messages must be
 * intercepted. (There might be another message send by GPSD, but I am not
 * aware of that message at the moment.)
 *
 * TODO: refactor GPS communication from the actual clock correction code.
 */

var gpsd = require('node-gpsd');
var execSync = require('child_process').execSync;

module.exports = {
	// Connects to GPSD and starts processing the raw NMEA sentences.
    start: function () {
    	// Listen to raw NMEA sentences
		var listener = new gpsd.Listener({parse: false});

		listener.connect(function() {
			console.log('Synchronizing clock with GPS.');
		});
		listener.on('raw', correctClockIfNeeded);
		listener.watch({class: 'WATCH', nmea: true});
	}
}

// Some private constants
var ONE_SECOND_IN_MILLIS = 1000;
var ONE_MINUTES_IN_SECONDS = 60;

// Correct time every time this counter gets less then zero.
var timeSentenceIgnoreCounter = 0;

/**
 * This is the main function for handling the NMEA sentences.
 */
function correctClockIfNeeded(nmeaMessage) {
    var nmeaSentenceParts = nmeaMessage.split(',');
    if (isTimeSentence(nmeaSentenceParts) && timeSentenceIgnoreCounter-- < 0) {
    	// Now correct only once every minute
    	timeSentenceIgnoreCounter = ONE_MINUTES_IN_SECONDS;

		var piDateTime = new Date();
  		var nmeaDateTime = constructNMEADateTime(nmeaSentenceParts);
		if (moreThenOneSecondDifference(piDateTime, nmeaDateTime)) {
			adjustPiTime(nmeaDateTime);
		}
  	}
}

function isTimeSentence(sentenceParts) {
	return sentenceParts[0] == '$GPRMC';
}

function constructNMEADateTime(timeParts) {
	return new Date(Date.parse(formatDate(timeParts[9]) + "T" + formatTime(timeParts[1])));
}

function formatDate(nmeaDate) {
	// If this code ever makes it into the 22th century the "20" needs to be replaced by "21".
	return "20" + nmeaDate.substring(4, 6) +  "-"+ nmeaDate.substring(2, 4) +  "-" + nmeaDate.substring(0, 2)
}

function formatTime(nmeaTime) {
	return nmeaTime.substring(0, 2) + ":" + nmeaTime.substring(2, 4) + ":" + nmeaTime.substring(4);
}

function moreThenOneSecondDifference(piDateTime, nmeaDateTime) {
	return Math.abs(piDateTime - nmeaDateTime) > ONE_SECOND_IN_MILLIS;
}

function adjustPiTime(nmeaDateTime) {
	var setDateTime = "sudo date -u -s " + nmeaDateTime.toISOString() + " +%Y-%m-%dT%H:%M:%S.%N";
	console.log("About to exec: '" + setDateTime + "'");
	execSync(setDateTime);
}
