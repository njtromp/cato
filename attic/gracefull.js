/**
 * This module will ensure that the everything is cleanly brought
 * to a stable off-state. This will ensure that the motor that drives
 * the mechanical VDO log will be stopped.
 */

// STILL WORK IN PROGRESS. NEED TO FIGURE OUT WHICH INTERRUPT TO USE
if (true) {
//	process.on('exit', function () {
	process.on('SIGINT', function () {
	 //handle your on exit code
	 console.log("Exiting (SIGINT), have a nice day");
	});
	process.on('SIGTERM', function () {
	 //handle your on exit code
 	   console.log("Exiting (SIGTERM), have a nice day");
	});
}

setTimeout(function() {console.log('We are about to quit...')}, 5000);
