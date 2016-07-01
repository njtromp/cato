#!/usr/bin/env node

"use strict";

var rawRMCMessage = '$GPRMC,145721.000,A,5223.1929,N,00439.0452,E,0.24,114.13,300616,,,A*60';
var rmcMessage = { id: 'GPRMC',
  time: '145721.000',
  valid: 'A',
  latitude: '52.38654833',
  longitude: '4.65075333',
  speed: 0.24,
  course: 114.13,
  date: '300616',
  mode: '',
  variation: NaN
 };

        var speed = rmcMessage.speed.toFixed(2);
        var heading = rmcMessage.course.toFixed(0);
        var location = {latitude: '', longitude: ''};
        location.latitude = format('00', 'NS', rmcMessage.latitude);
        location.longitude = format('000', 'EW', rmcMessage.longitude);
        var bla = { speed: speed, heading: heading, location: location };
        console.log(bla);

    function format(padding, rumbs, value) {
        var parts = value.split('.');
        var degrees = Number(parts[0]);
        var minutes = Number('0.' + parts[1]) * 60.0;
        return pad(padding, Math.abs(degrees)) + '°' + padl(padding, minutes.toFixed(4), (4+1) + padding.length) + rumbs.charAt(degrees >= 0 ? 0 : 1);
    }

    function pad(padding, value) {
        return (padding + value).slice(-padding.length);
    }

    function padl(padding, value, length) {
        return (padding + value).slice(-length);
    }
