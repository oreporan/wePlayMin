// DB handler

var mongoose   = require('mongoose');
var logger = require('../utils/logger').init('db');
module.exports.connect = function( dbName, port ) {
	logger.audit('connect', "Connecting to database ");
	if(process.env.NODE_ENV === 'production') {
		logger.audit('connect', "running in production, db name - weplay_runtime");
		mongoose.connect('mongodb://dbuser:88888888@ds033153.mongolab.com:33153/weplay_runtime');
	} else {
		logger.audit('connect', "running locally, db name - " + dbName);
		mongoose.connect('mongodb://localhost:' + port + '/' + dbName);
	}
}
