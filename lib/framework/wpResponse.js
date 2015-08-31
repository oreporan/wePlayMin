// This sends a response to the client


module.exports.sendResponse = function(isSuccessfull, responseText, errorText, errorDescription) {
	return {success: isSuccessfull, responseText: responseText, error: errorText, errorDescription : errorDescription};
}

