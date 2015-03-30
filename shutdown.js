/**
 * This module will shutdown the Raspberry PI when a button is pressed.
 * In order to prevent unwanted shutdowns the button needs to be pressed
 * twice before the shutting down is performed. As an extra safeguard
 * the second press must be between half a second after and two seconds
 * after the first press.
 */
var execSync = require('child_process').execSync;

module.exports = {
	enableButton: function() {
		console.log('Installing shutdown listener.');
		var Gpio = require('onoff').Gpio,
  			button = new Gpio(24, 'in', 'rising');
  			button.watch(function(err, value) {
  				if (value == 1 && secondPressWithin2Seconds()) {
    				shutdown();
    			}
			});
	}

}

var lastPress = null;
function secondPressWithin2Seconds() {
	var now = new Date();
	if (lastPress == null) {
		// First press
		lastPress = now;
	} else if (now - lastPress < 2000) {
		// Within two seconds from first press
		if (now - lastPress > 500) {
			// After half a second of first press
			shutdown();
		}
	} else {
		// Restart timing
		lastPress = now;
	}
}

function shutdown() {
	console.log('Shutting down...');
	execSync("sudo shutdown -h now");
}
