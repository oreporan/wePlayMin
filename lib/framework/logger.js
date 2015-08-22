// This class holds messages to log
var fs = require('fs');
var path = require('path');
var SERVER_LOG_PATH = path.join(__dirname, "/log/server.log");

module.exports.init = function( className ) {
	var messageToSend;
	return {
		audit : function(mn, message) {
			messageToSend = '[INFO]' + buildRootMessage(className, mn) + message;
			console.log(messageToSend);
			writeLogToFile(messageToSend);
		},
		warn : function(mn , message ) {
			messageToSend =  '[WARN]' +  buildRootMessage(className, mn) + message ;
			console.warn(messageToSend);
			writeLogToFile(messageToSend);
		},
		error : function(mn , message ) {
			messageToSend = '[ERROR]' + buildRootMessage(className, mn) + message ;
			console.error (messageToSend);
			writeLogToFile(messageToSend);
		}
	}
};

function buildRootMessage ( className , methodName) {
	return  '[' + new Date().toString() + '][' +className+ '.' + methodName + '] ';
};

function writeLogToFile(message) {
	var stream = fs.createWriteStream( SERVER_LOG_PATH, {'flags': 'a'} );
	stream.once('open', function(fd) {
		stream.write(message + '\n');
	});
};

module.exports.initFile = function() {
	fs.exists( SERVER_LOG_PATH, function ( exists ) {
		if(exists) {
			fs.unlinkSync(SERVER_LOG_PATH);
		};
	});
}