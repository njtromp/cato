var gpsd = require('node-gpsd');
var delayed = require('delayed');

function readParsedNMEA() {
	var listener = new gpsd.Listener({
	    port: 2947,
	    hostname: 'localhost',
	    logger:  {
	        info: function() {},
	        warn: console.warn,
	        error: console.error
	    },
	    parse: true
	});
	listener.connect(function() {
	    console.log('Connected');
	});
	listener.on('TPV', function(tpvData) {
		console.log(tpvData);
	});
	listener.watch();

	console.log('Waiting...');
	delayed.delay(function() {
		console.log('Done');
		listener.disconnect(;
	}, 5000);
	console.log('klaar');
}

readParsedNMEA(); 