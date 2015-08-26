var express = require('express');
var db = require('./lib/db').connect('weplay_test' , 35693);
var usersExternal = require('./lib/external/usersEndpoint.js');
var users = require('./lib/controllers/users.js');
var app = express();
var filter = require('./lib/filter');
var authenticate = require('./lib/external/authenticate');
var logger = require('./lib/framework/logger.js');
var bodyParser = require('body-parser');
var Constants = require('./lib/utils/Constants');
var wpresponse = require('./lib/framework/wpResponse');

var router = express.Router();

var port = 3000;

// Since server has just started - we create a new logger file
logger.initFile();
logger = logger.init('server');


//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use('/wePlay', router); // All requests have wePlay attached
app.use(usersExternal);
app.use(authenticate);

//middleware to use for all requests
router.use(function(req, res, next) {
	logger.audit('use' , req.method + '. New Request from: ' + req.hostname + ' routing to: ' + req.path);
	validateRequest(req, function( err ) {
		if(err == null) {
			logger.audit('use' ,  'Request has passed validation, routing to: ' + req.path);
			next();
		} else {
			res.send(wpresponse.sendResponse(null, err, err.errmsg, false));
		}
	});
});


//Validate the request
function validateRequest( req, callback ) {
	var clientId = req.get(Constants.CLIENT_ID);
	users.getUserById(clientId, function(err, result) {
		if( err != null || result == null ) {
			// No user was found
			callback( "No Client was found in the DB, error: " + err );
		} else {
			// User was found
			callback(null);
		}
	});
}

app.listen(port);
logger.audit("listen","Making a smarter planet on port " + port);

module.exports.getApp = app;
