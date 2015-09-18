// This sends a response to the client
var logger = require('./logger').init('wpResponse');

module.exports.sendResponse = function(isSuccessfull, responseText, errorText, errorDescription) {
	
	// For debug:
//	logger.audit('response', 'success: ' + isSuccessfull + ', responseText: ' + responseText +
//			', error: ' + errorText + ', errorDescription: ' + errorDescription);
	
	return {success: isSuccessfull, responseText: responseText, error: errorText, errorDescription : errorDescription};
}

