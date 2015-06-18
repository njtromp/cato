var DelayedSwitch = require('./delayed-switch');


var config = {
	delay: 10000,
	initialState: 1
}

var delayedSwitch = new DelayedSwitch(config, function() {console.log('Switching ON');}, function() {console.log('Switching OFF');});

setTimeout(function() {delayedSwitch.switchOff()},   800);
setTimeout(function() {delayedSwitch.switchOn()},   4000);

setTimeout(function() {delayedSwitch.switchOff()}, 11000);
setTimeout(function() {delayedSwitch.switchOn()},  12000);
setTimeout(function() {delayedSwitch.switchOff()}, 13000);
setTimeout(function() {delayedSwitch.switchOn()},  14000);

setTimeout(function() {delayedSwitch.switchOff()}, 31000);
setTimeout(function() {delayedSwitch.switchOff()}, 50000);
setTimeout(function() {delayedSwitch.switchOn()},  51000);
var time = 0;
var timer = setInterval(function() {console.log(time++)}, 1000);
setTimeout(function() {clearInterval(timer);}, 64000);