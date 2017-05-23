var moment = require('moment');

var now = moment();
console.log(now.format('X'));
var timeStamp = now.valueOf();

var timeStampMoment = moment.utc(timeStamp);
console.log(timeStampMoment.local().format('hh:mm a'))


//console.log(now.format('hh:mm:ss a')); // 2.15
//now.subtract(1, 'year');
//console.log(now.format('MMMM Do YYYY hh:mm:ss a'))//oct 5th, 2015, 2.15pm