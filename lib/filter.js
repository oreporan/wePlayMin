var express = require('express');
var app = module.exports = express(); 
var router = express.Router();
var logger = require('./framework/logger.js').init('filter');
var Constants = require('./utils/Constants');
var users = require('./controllers/users.js');

module.exports.router = router;

//middleware to use for all requests
router.use(function(req, res, next) {
	logger.audit('use' , req.method + '. New Request from: ' + req.hostname + ' routing to: ' + req.path);
	validateRequest(req, function( err ) {
		if(err == null) {
			next();
		} else {
			res.status(401).send({error : "Not a valid request, missing headers" , description : err });
		}
	});
});


//Validate the request
function validateRequest( req, callback ) {
	var clientId = req.get(Constants.CLIENT_ID);
	users.getUserById(clientId, function(result, err) {
		if( err != null ) {
			// No user was found
			callback( "No Client was found in the DB, error: " + err );
		} else {
			// User was found
			callback(null);
		}
	});
}