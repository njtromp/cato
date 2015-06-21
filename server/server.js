/**
 * Skeleton for pushing speed updates to browsers.
 */

"use strict";

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

function handler (request, response) {
    // Only serve files if they exist
    console.log(request.url);
    fs.exists(__dirname + request.url, function() {
        fs.readFile(__dirname + request.url,
        function (err, data) {
            if (err) {
                response.writeHead(500);
                return response.end('Error loading ' + request.url);
              }

            response.writeHead(200);
            response.end(data);
        });
    });
}

// Mimic varying speed
setInterval(function() {
    io.emit('speed', { 
        knots: (Math.round(Math.random()*6.0*10) / 10.0 ).toFixed(1)
    });
}, 1000);