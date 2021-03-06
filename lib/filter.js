var express = require('express');
var logger = require('./utils/logger.js').init('filter');
var Constants = require('./utils/Constants');
var users = require('./controllers/users.js');
var wpResponse = require('./framework/wpResponse');
var leagues = require('./controllers/leagues');
var async = require('async');



module.exports.doFilter = function(req,res, next) {
	logger.audit('doFilter', '================== START OF REQUEST ==================');
	logger.audit('doFilter' , 'new request coming in: ' + req.method + ' ' + req.ip + ' ' + req.path);
	if(req.path.indexOf('/auth/') == 0) {
		logger.audit('doFilter', 'going to authenticate, no need to validate');
		next();
	} else {
		validateRequest(req, function( err ) {
			if(err == null) {
				next();
			} else {
				logger.error('doFilter' ,  'Request failed validation - ' + err);
				res.send(wpResponse.sendResponse(false, null, err, null));
			}
		});
	}
};

//Validate the request
function validateRequest( req, callback ) {
	var clientId = req.get(Constants.CLIENT_ID_HEADER_KEY);
	users.getUserById(clientId, function(err, result) {
		if( err != null || result == null ) {
			// No user was found
			callback( "No Client with id "+clientId+" was found in the DB, error: " + err );
		} else {
			// Not a games request
			callback(null);
		}
	});
}
