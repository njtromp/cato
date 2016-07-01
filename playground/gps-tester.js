"use strict";

console.log('Starting');

var PMTK_Q_RELEASE = '$PMTK605*31\r\n';
// different commands to set the update rate from once a second (1 Hz) to 10 times a second (10Hz)
// Note that these only control the rate at which the position is echoed, to actually speed up the
// position fix you must also send one of the position fix rate commands below too.
var PMTK_SET_NMEA_UPDATE_100_MILLIHERTZ = '$PMTK220,10000*2F\r\n' // Once every 10 seconds, 100 millihertz.
var PMTK_SET_NMEA_UPDATE_200_MILLIHERTZ = '$PMTK220,5000*1B\r\n'  // Once every 5 seconds, 200 millihertz.
var PMTK_SET_NMEA_UPDATE_1HZ = '$PMTK220,1000*1F\r\n'
var PMTK_SET_NMEA_UPDATE_5HZ = '$PMTK220,200*2C\r\n'
var PMTK_SET_NMEA_UPDATE_10HZ = '$PMTK220,100*2F\r\n'
// Position fix update rate commands.
var PMTK_API_SET_FIX_CTL_100_MILLIHERTZ = '$PMTK300,10000,0,0,0,0*2C\r\n' // Once every 10 seconds, 100 millihertz.
var PMTK_API_SET_FIX_CTL_200_MILLIHERTZ = '$PMTK300,5000,0,0,0,0*18\r\n'  // Once every 5 seconds, 200 millihertz.
var PMTK_API_SET_FIX_CTL_1HZ = '$PMTK300,1000,0,0,0,0*1C\r\n'
var PMTK_API_SET_FIX_CTL_5HZ = '$PMTK300,200,0,0,0,0*2F\r\n'
// Can't fix position faster than 5 times a second!

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var port = new SerialPort('/dev/ttyAMA0', {
	baudrate: 9600, 
	parser: serialport.parsers.readline('\n')
});

port.on('error', function(err) {
	console.log('ERROR [' + err + ']')
});

port.on('data', function (data) {
	console.log('Data: ' + data);
});

port.open(function (err) {
	console.log('GPS port opened.');
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  // errors will be emitted on the port since there is no callback to write
  setTimeout(function() {
	port.write(PMTK_Q_RELEASE);
	// Once per 5 seconds
	  	// port.write(PMTK_SET_NMEA_UPDATE_200_MILLIHERTZ);
	  	// port.write(PMTK_API_SET_FIX_CTL_200_MILLIHERTZ);
  	// Once per second
  	port.write(PMTK_SET_NMEA_UPDATE_1HZ);
  	port.write(PMTK_API_SET_FIX_CTL_1HZ);
  }, 1000);
  
  setTimeout(function() {
  	console.log('That\'s all folks...');
  	process.exit(1);
  }, 20000);
});