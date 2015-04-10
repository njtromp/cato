
/**
 * This program can be used to calibrate the speed to RPM table that is stored in 'calibrarion.json'.
 * With the left and right arrow keys different speeds are selected. With the up and down arrow keys
 * the RPM is controlled. Ctrl+S saves the current configuration to the 'calibrartion.json' file.
 */

"use strict";

var Factory = new require('./factory');
var factory = new Factory();
var rpmController = factory.createRPMController();
var fs = require('fs');

var calibration = require('./calibration.json');
var currentSpeed = 0;

function calibrateApplication() {
	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
		var rpmChange = key.ctrl ? 10 : 1;
	  	switch (key.name) {
	  	case 'c':
		  	if (key && key.ctrl) {
		    	process.stdin.pause();
	  		}
	  		break;
	  	case 'up':
	  		calibration.speeds[currentSpeed].rpm += rpmChange;
	  		adjustRPM();
	  		break;
	  	case 'down':
	  		calibration.speeds[currentSpeed].rpm -= rpmChange;
	  		adjustRPM();
	  		break;
	  	case 'left':
			if (currentSpeed > 0) {
				currentSpeed -= 1;
			}
			showSpeedChange();
	  		adjustRPM();
	  		break;
	  	case 'right':
			if (currentSpeed < (calibration.speeds.length - 1)) {
				currentSpeed += 1;
			}
			showSpeedChange();
	  		adjustRPM();
	  		break;
	  	case 's':
		  	if (key && key.ctrl) {
		  		saveCalibrationFile();
		  	}
		  	break;
	  	}
	});
	
	process.stdin.setRawMode(true);
	process.stdin.resume();
}

function showSpeedChange() {
	console.log('Now calibrating ' + calibration.speeds[currentSpeed].speed + ' knots.');
}

function adjustRPM() {
	console.log(calibration.speeds[currentSpeed].rpm);
	rpmController.setRPM(calibration.speeds[currentSpeed].rpm);
}

function saveCalibrationFile() {
	console.log('Saving calibration table');
	fs.writeFile("./calibration.json", JSON.stringify(calibration, null, '\t'), function(err) {
    	if(err) {
        	return console.log(err);
    	}

		console.log('Calibration table saved');
	}); 
}

calibrateApplication();
showSpeedChange();
