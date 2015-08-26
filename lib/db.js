// DB handler

var mongoose   = require('mongoose');
var logger = require('./framework/logger').init('db');
module.exports.connect = function( dbName, port ) {
	logger.audit('connect', "Connecting to database " + dbName);
	mongoose.connect('mongodb://dbuser:88888888@ds0' + port +'.mongolab.com:'+ port +'/' + dbName);

}
