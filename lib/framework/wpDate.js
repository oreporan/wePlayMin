// Handles all things that have to do with dates
var moment = require('moment');


module.exports.getNearestDateByWeekDay = function(weekDay) {
  return moment().day(weekDay);
}

function dateAdd(date, interval, units) {
  var ret = new Date(date); //don't change original date
  switch(interval.toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

module.exports.addWeekToDate = function(date) {
  return dateAdd(date, 'week', 1);
}

module.exports.displayDate = function(dateObj) {
  var curr_date = dateObj.getDate();
  var curr_month = dateObj.getMonth() + 1;
  var curr_year = dateObj.getFullYear();
  var curr_hours = dateObj.getHours();
  var curr_minutes = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
  return curr_month + "/" + curr_date + "/" + curr_year + " at " + curr_hours + ":" + curr_minutes;

}
module.exports.timeZone = "";
module.exports.dateAdd = dateAdd;
