// This class holds messages to log
var config = require('../../config.json');

var init = module.exports.init = function( className ) {
	var messageToSend;
	return {
		audit : function(mn, message) {
			messageToSend = '[INFO ]' + buildRootMessage(className, mn) + message;
			console.log(messageToSend);
		},
		warn : function(mn , message ) {
			messageToSend =  '[WARN ]' +  buildRootMessage(className, mn) + message ;
			console.warn(messageToSend);
		},
		error : function(mn , message ) {
			messageToSend = '[ERROR]' + buildRootMessage(className, mn) + message ;
			console.error (messageToSend);
		},
		test : function(mn, message) {
			messageToSend = '[TEST ]' + buildRootMessage(className, mn) + message ;
			console.warn (messageToSend);
		},
		debug : function(mn, message) {
			messageToSend = '[DEBUG]' + buildRootMessage(className, mn) + message ;
			if(config.debugLogging) {
				console.log (messageToSend);
			}
		}
	}
};


function buildRootMessage ( className , methodName) {
	var date = new Date();
	var dateFormat = date.toLocaleDateString() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	return  '[' + dateFormat + '][' +className+ '.' + methodName + '] ';
};
