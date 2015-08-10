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

    app.listen(this.config.port);

    function handler (request, response) {
        if (_this.config.debug) {
            console.log(request.url);
        }

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
        var speed = rmcMessage.speed.toFixed(2);
        var heading = rmcMessage.course.toFixed(0);
        var location = {latitude: '', longitude: ''};
        location.latitude = format('00', 'NS', rmcMessage.latitude);
        location.longitude = format('000', 'EW', rmcMessage.longitude);
        _this.io.emit('update', { speed: speed, heading: heading, location: location });
    }

    function format(padding, rumbs, value) {
        var parts = value.split('.');
        var degrees = Number(parts[0]);
        var minutes = Number('0.' + parts[1]) * 60.0;
        return pad(padding, Math.abs(degrees)) + '°' + (minutes < 10 ? '0' : '') + minutes.toFixed(4) + rumbs.charAt(degrees >= 0 ? 0 : 1);
    }

    function pad(padding, value) {
        return (padding + value).slice(-padding.length);
    }

    console.log('Server should be started.');
}

module.exports = InfoServer;