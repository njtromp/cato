"use strict";

exports.constructDate = function(year, month, day, hours, minutes, seconds) {
	if (arguments.length === 2) {
		var datePart = arguments[0];
		var timePart = arguments[1];
		var yearPart = datePart.substring(4);
		var epoch = new Date().getFullYear() % 100;
		year = yearPart > epoch ? '19' + yearPart : '20' + yearPart;		
		return _constructDate(year, datePart.substring(2,4), datePart.substring(0, 2), timePart.substring(0, 2), timePart.substring(2, 4), timePart.substring(4));
	} else if (arguments.length === 6) {		
		return _constructDate(year, month, day, hours, minutes, seconds);
	} else {
		console.log('oeps....');
	}
}

function _constructDate(year, month, day, hours, minutes, seconds) {
	var date = new Date();
	date.setFullYear(year);
	date.setMonth(month);
	date.setDate(day);
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(seconds);
	date.setMilliseconds(0);
	return date;
}