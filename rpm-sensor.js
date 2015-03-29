/**
 * This module will shutdown the Raspberry PI when a button is pressed.
 * In order to prevent unwanted shutdowns the button needs to be pressed
 * twice before the shutting down is peerformed. As an extra safeguard
 * the second press must be between half a second after and two seconds
 * after the first press.
 */
module.exports = {
	enableSensor: function() {
		console.log('Installing sensor listener.');
		var lastSwitch = null;
		var Gpio = require('onoff').Gpio,
  			button = new Gpio(22, 'in', 'both');
  			button.watch(function(err, value) {
  				if (value == 0) {
  					var currentSwitch = new Date();
  					if (lastSwitch == null) {
  						lastSwitch = currentSwitch;
  					} else {
  						var rps = 1000 / ((currentSwitch - lastSwitch) / 6)
  						console.log("RPS = " + rps);
  						lastSwitch = currentSwitch;
  					}
  				}
			});
	}

}
