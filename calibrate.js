"use strict";

//var Factory = require('./factory');
//var RPMController = Factory.createRPMController();

function keypressModule() {
	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
	  switch (key.name) {
	  	case 'c':
		  	if (key && key.ctrl) {
		    	process.stdin.pause();
	  		}
	  		break;
	  	case 'up':
	  		console.log('Increase RPM');
	  		break;
	  	case 'down':
	  		console.log('Decrease RPM');
	  		break;
	  	case 'left':
	  		console.log('Previous speed');
	  		break;
	  	case 'right':
	  		console.log('Next speed');
	  		break;
	  	case 's':
		  	if (key && key.ctrl) {
		  		console.log('Saving calibration table');
		  	}
		  	break;
	  }
	});
	
	process.stdin.setRawMode(true);
	process.stdin.resume();
}


keypressModule();
console.log('Start typing...');
