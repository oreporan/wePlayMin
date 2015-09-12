// DB handler

var mongoose   = require('mongoose');
var logger = require('../framework/logger').init('db');
module.exports.connect = function( dbName, port, isLocal ) {
	logger.audit('connect', "Connecting to database " + dbName + ', is this a local db? answer - ' + isLocal);
	if(isLocal) {
		mongoose.connect('mongodb://localhost:' + port + '/' + dbName);
	} else {
		mongoose.connect('mongodb://dbuser:88888888@ds035693.mongolab.com:33153/weplay_runtime');
	}
}
