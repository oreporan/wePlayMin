// Taks manager, this class handles the cronJob module and sets off tasks
var CronJob = require('cron').CronJob;
var logger = require('../utils/logger').init('wpTaskManager');

module.exports.createTasksBulk = function(dateList, onReadyFunction) {
  for(var i = 0 ; i < dateList.length ; i++) {
    createTask(date[i], onReadyFunction);
  }
}


function createTask(date, onReadyFunction, options) {
  logger.audit('createTask', 'task created on date: ' + date);
  new CronJob({cronTime : date, onTick: function() {
    onReadyFunction(options);
  }, start : true });
}

module.exports.createTask = createTask;
