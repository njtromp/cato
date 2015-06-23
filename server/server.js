/**
 * Skeleton for pushing speed updates to browsers.
 */

"use strict";

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

function handler (request, response) {
    console.log(request.url);

    if (firstVisit(request.url)) {
        redirectToIndexPage(response);
    } else {
        var fileName = request.url;
        // Append '.html' if the name doesn't contains '.'.
        if (fileName.indexOf('.') < 0) {
            fileName += '.html'; 
        }
        fileName = __dirname + fileName
        // Only serve files if they exist
        fs.exists(fileName, function() {
            fs.readFile(fileName,
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
}

function firstVisit(requestURL) {
    return '/' == requestURL;
}

function redirectToIndexPage(response) {
    response.writeHead(302, {'Location': '/info'});
    response.end();
}

// Mimic varying speed
setInterval(function() {
    io.emit('cur-speed', { 
        knots: (Math.random()*6.0).toFixed(1)
    });
    io.emit('avg-speed', { 
        knots: (Math.random()*6.0).toFixed(1)
    });
}, 1000);