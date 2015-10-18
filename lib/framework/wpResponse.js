// This sends a response to the client
var logger = require('../utils/logger').init('wpResponse');

module.exports.sendResponse = function(isSuccessfull, responseText, errorText, errorDescription) {
	logger.audit('sendResponse', '================== END OF REQUEST ==================');
	return {success: isSuccessfull, responseText: responseText, error: errorText, errorDescription : errorDescription};
}
