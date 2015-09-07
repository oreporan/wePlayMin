var express = require('express');
var logger = require('./framework/logger.js').init('filter');
var Constants = require('./utils/Constants');
var users = require('./controllers/users.js');
var wpResponse = require('./framework/wpResponse');
//middleware to use for all requests
module.exports.validateRequest = function(req,res, next) {
	logger.audit('validateRequest' , 'new request coming in: ' + req.method + ' ' + req.hostname + ' ' + req.path);
	validateRequest(req, function( err ) {
		if(err == null) {
			logger.audit('validateRequest' ,  'Request has passed validation, routing to: ' + req.path);
			next();
		} else {
			logger.error('validateRequest' ,  'Request failed validation - ' + err);
			res.send(wpResponse.sendResponse(null, err, err.errmsg, false));
		}
	});
};

//Validate the request
function validateRequest( req, callback ) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	users.getUserById(clientId, function(err, result) {
		if( err != null || result == null ) {
			// No user was found
			callback( "No Client with id "+clientId+" was found in the DB, error: " + err );
		} else {
			// User was found
			callback(null);
		}
	});
}
