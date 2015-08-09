/**
 * Skeleton for pushing speed updates to browsers.
 */

"use strict";

function InfoServer(config, rawNMEAListener) {
    this.config = config;
    this.rawNMEAListener = rawNMEAListener;
}

InfoServer.prototype.startServer = function() {
    console.log('Starting the server...');
    var app = require('http').createServer(handler)
    this.io = require('socket.io')(app);
    var fs = require('fs');
    var _this = this;

    this.rawNMEAListener.setCallback(updateSpeed);

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

    function updateSpeed(rmcMessage) {
        _this.io.emit('update', { speed: rmcMessage.speed.toFixed(2), heading: rmcMessage.course, location: {latitude: rmcMessage.latitude, longitude: rmcMessage.longitude} });
    }

    console.log('Server should be started.');
}

module.exports = InfoServer;