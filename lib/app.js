var express = require('express');
var db = require('./db').connect();
var usersExternal = require('./external/usersEndpoint.js');
var users = require('./controllers/users.js');
var app = express(); 
var logger = require('./framework/logger.js');
var bodyParser = require('body-parser');
var Constants = require('./utils/Constants');

// Since server has just started - we create a new logger file
logger.initFile();
logger = logger.init('server');


//configure app to use bodyParser()
//this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(usersExternal);


var router = express.Router();
app.use('/wePlay', router); // All requests have wePlay attached

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


app.listen(3000);
console.log("Listening on port 3000");

//Validate the request
function validateRequest( req, callback ) {
	var clientId = req.get(Constants.CLIENT_ID);
	users.getUserById(clientId, function(result, err) {
		if( err == null ) {
			// No user was found
			callback( "No Client was found in the DB, error: " + err );
		} else {
			// User was found
			callback(null);
		}
	});
}