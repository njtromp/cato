/** 
 * Main program for Cato. The main purpose is to include
 * all the modules and start them.
 */

// Start the log-controller
var Factory = require('./factory');
var factory = new Factory();
var logController = factory.createLogController();

// Start the information server
var server = factory.createServer();