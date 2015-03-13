/**
 * This module will shutdown the Raspberry PI when a button is pressed.
 */
var execSync = require('child_process').execSync;

module.exports = {
	enableButton: function() {
		console.log('Installing shutdown listener.');
		var Gpio = require('onoff').Gpio,
  			button = new Gpio(4, 'in', 'rising');

  			button.watch(function(err, value) {
    		shutdown();
		});
	}
}

function shutdown() {
	console.log('Shutting down...');
	execSync("sudo shutdown -h now");
}
