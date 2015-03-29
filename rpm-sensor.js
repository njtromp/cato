/**
 * This module measures the RPM of the motor that eventually drives
 * the old mechanical log.
 */
module.exports = {
	enableSensor: function() {
		function triggerTime(nanotimestructure) {
			return (nanotimestructure[0] * 1000000000) + nanotimestructure[1];
		} 
		console.log('Installing sensor listener.');
		var lastSwitch = null;
		var Gpio = require('onoff').Gpio,
  			button = new Gpio(22, 'in', 'both');
  			button.watch(function(err, value) {
  				if (value == 0) {
  					var currentSwitch = process.hrtime();
  					if (lastSwitch == null) {
  						lastSwitch = currentSwitch;
  					} else {
  						var deltaInNanos = (triggerTime(currentSwitch) - triggerTime(lastSwitch));
  						console.log("RPS = " + (1000000000 / (deltaInNanos / 6)));
  						lastSwitch = currentSwitch;
  					}
  				}
			});
	}

}
