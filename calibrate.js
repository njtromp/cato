"use strict";

//var Factory = require('./factory');
//var RPMController = Factory.createRPMController();

function keypressModule() {
	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
	  console.log('got "keypress"', key);
	  if (key && key.ctrl && key.name == 'c') {
	    process.stdin.pause();
	  }
	});
	
	process.stdin.setRawMode(true);
	process.stdin.resume();
}

function rawMode() {
	process.stdin.resume();

	process.stdin.on('data', function(chunk) {
	  console.log('chunk: ' + chunk);
	});
}

keypressModule();
// rawMode();
console.log('Start typing...');
