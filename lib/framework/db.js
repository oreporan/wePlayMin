// DB handler

var mongoose   = require('mongoose');
var logger = require('../framework/logger').init('db');
module.exports.connect = function( dbName, port ) {
	logger.audit('connect', "Connecting to database " + dbName);
	mongoose.connect('mongodb://localhost:' + port + '/' + dbName);
}
