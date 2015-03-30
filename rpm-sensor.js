/**
 * This module measures the RPM of the motor that eventually drives
 * the old mechanical log.
 */
module.exports = {
	enableSensor: function() {
		console.log('Installing sensor listener.');
		var lastSwitch = null;
		var Gpio = require('onoff').Gpio,
  		  rpmSensor = new Gpio(22, 'in', 'both');
  		  rpmSensor.watch(function(err, value) {
  				if (value == 1) {
  					var currentSwitch = convertNanoTimeData(process.hrtime());
  					if (lastSwitch != null) {
  						var deltaInNanos = currentSwitch - lastSwitch;
  						console.log("RPM = " + (10000000000 / deltaInNanos));
  					}
            lastSwitch = currentSwitch;
  				}
			});
	}
}

function convertNanoTimeData(nanoTimeData) {
  return (nanoTimeData[0] * 1000000000) + nanoTimeData[1];
} 
