/** 
 * Main program for Cato. The main purpose is to include
 * all the modules and start them.
 */

// Start correcting the clock.
var correctClock = require('./correct-clock');
correctClock.start();

// Start the log-controller
var Factory = require('./factory');
var factory = new Factory();
var logController = factory.createLogController();

// Start the information server
var server = factory.createServer();