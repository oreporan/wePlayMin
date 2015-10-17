var express = require('express');
var logger = require('./utils/logger.js').init('filter');
var Constants = require('./utils/Constants');
var users = require('./controllers/users.js');
var wpResponse = require('./framework/wpResponse');
var leagues = require('./controllers/leagues');
var async = require('async');



module.exports.doRequest = function(req,res, next) {
	logger.audit('validateRequest' , 'new request coming in: ' + req.method + ' ' + req.ip + ' ' + req.path);
	if(req.path.indexOf('/auth/') == 0) {
		logger.audit('validateRequest', 'going to authenticate, no need to validate');
		next();
	} else {
		validateRequest(req, function( err ) {
			if(err == null) {
				logger.audit('validateRequest' ,  'Request has passed validation, routing to: ' + req.path);
				next();
			} else {
				logger.error('validateRequest' ,  'Request failed validation - ' + err);
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
			if(req.path.indexOf('/games/') == 0) {
				var leagueId = req.get(Constants.LEAGUE_ID_HEADER_KEY);
				if(!leagueId) {
					callback('No valid leagueId: ' + leagueId + ', can not route to: ' + req.path);
				} else {
					// Request to the games, must have a valid leagueId
					leagues.getLeagueById(leagueId, function(err, result) {
						if(err || !result) {
							callback('No valid leagueId: ' + leagueId + ', can not route to: ' + req.path);
						} else {
							callback(null);
						}
					});
				}
				} else {
					// Not a games request
					callback(null);
				}
		}
	});
}
