console.log('Discovering serial ports.')
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
 
portName = process.argv[2];
var myPort = new SerialPort(portName, {
//   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\n")
});

myPort.on('data', showData)

function showData(data) {
	console.log(data)
}

