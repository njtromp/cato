/** 
 * Main program for Cato. The main purpose is to include
 * all the modules and start them.
 */

// Start the correcting the clock.
var correctClock = require('./correct-clock');
correctClock.start();

// Enable the shutdown button.
var shutdown = require('./shutdown');
shutdown.enableButton();
