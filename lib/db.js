// DB handler

var mongoose   = require('mongoose');
module.exports.connect = function() {
	mongoose.connect('mongodb://oreporan:yotamp86@ds031903.mongolab.com:31903/users'); // connect to our database

}