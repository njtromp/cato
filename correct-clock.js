/**
 * This modules ensures that the Raspberry PI clock stays wihtin a one second 
 * difference from the time received from the GPS. After the first correction
 * the Raspberry PI clock is only checked once every minute. (Assuming the 
 * GPS emits a time related message every second.)
 *
 * TODO: refactor GPS communication from the actual clock correction code.
 */

var gpsd = require('node-gpsd');
var execSync = require('child_process').execSync;

module.exports = {
    start: function () {
		var listener = new gpsd.Listener({
		    port: 2947,
		    hostname: 'localhost',
		    logger:  {
		        info: function() {},
		        warn: console.warn,
		        error: console.error
		    },
		    parse: false
		});

		listener.connect(function() {
			console.log('Synchronizing clock with GPS.');
		});
		// Correct time at once
		var timeSentenceIgnoreCounter = 0;
		listener.on('raw', function(nmeaMessage) {
		    var nmeaSentenceParts = nmeaMessage.split(',');
		    if (isTimeSentence(nmeaSentenceParts) && timeSentenceIgnoreCounter-- < 0) {
		    	// Now correct only once every minute
		    	timeSentenceIgnoreCounter = 60;

		  		var nmeaDateTime = constructNMEADateTime(nmeaSentenceParts);
				var piDateTime = new Date();
				if (moreThenOneSecondDifference(piDateTime, nmeaDateTime)) {
					adjustPiTime(nmeaDateTime);
				}
		  	}
		});

		function isTimeSentence(sentenceParts) {
			return sentenceParts[0] == '$GPRMC';
		}

		function constructNMEADateTime(timeParts) {
			return new Date(Date.parse(formatDate(timeParts[9]) + "T" + formatTime(timeParts[1])));
		}

		function formatDate(nmeaDate) {
			return "20" + nmeaDate.substring(4, 6) +  "-"+ nmeaDate.substring(2, 4) +  "-" + nmeaDate.substring(0, 2)
		}

		function formatTime(nmeaTime) {
			return nmeaTime.substring(0, 2) + ":" + nmeaTime.substring(2, 4) + ":" + nmeaTime.substring(4);
		}

		function moreThenOneSecondDifference(piDateTime, nmeaDateTime) {
			return Math.abs(piDateTime - nmeaDateTime) > 1000;
		}

		function adjustPiTime(nmeaDateTime) {
			var setDateTime = "sudo date -u -s " + nmeaDateTime.toISOString() + " +%Y-%m-%dT%H:%M:%S.%N";
			console.log("About to exec: '" + setDateTime + "'");
			execSync(setDateTime);
		}

		listener.watch({class: 'WATCH', nmea: true});
	}
}