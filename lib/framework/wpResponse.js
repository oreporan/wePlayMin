// This sends a response to the client


module.exports.sendResponse = function(responseText, errorText, errorDescription, isSuccessfull) {
	return {success: isSuccessfull, responseText: responseText, error: errorText, errorDescription : errorDescription};
}