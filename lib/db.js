// DB handler

var mongoose   = require('mongoose');
var logger = require('./framework/logger').init('db');
module.exports.connect = function() {
	logger.audit('connect', "Connecting to database");
	mongoose.connect('mongodb://oreporan:yotamp86@ds031903.mongolab.com:31903/users'); // connect to our database

}