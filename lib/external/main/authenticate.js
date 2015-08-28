// This external endpoint holds Signup and Sign in
var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpresponse = require('../../framework/wpResponse');
app.use("/authenticate", router);
var users = require('../../controllers/users');
//Init the logger
var logger = require('../../framework/logger').init('authenticate');



//Path : /users Method: POST
router.post('/signup', addUser);
function addUser(req, res) {
	var email = req.body.email;
	var name = req.body.name;
  var password = req.body.password;
	logger.audit('addUser' , 'adding User: ' + email + ' to runtime DB');

	users.addUser(name, email, password ,function(result , err ) {
		if( err != null ) {
			logger.warn('addUser' , ' can not add user: ' + email + ' to runtime DB, ' + err);
			res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
		} else {
			logger.audit('addUser' , 'User: ' + email + ' added to Users DB with clientId ' + result.id);
			res.send(wpresponse.sendResponse({clientId : result.id}, null, null, true));
		}
	});
};

//Path : /users Method: POST
router.post('/signin', authenticate);
function authenticate(req, res) {
	var email = req.body.email;
  var password = req.body.password;
	logger.audit('authenticate' , 'authenticating user: ' + email);

  users.authenticateUser(email, password , function(err, result) {
    if(err != null || result == null) {
      if(err == null) err = "could not get user";
      logger.error('authenticate' , 'could not authenticate user, wrong email or password ' + email);
      res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
    } else {
      res.send(wpresponse.sendResponse(result, null, null, true));
    }
  });
};

router.get('/forgotpassword/:email', forgotPassword);
function forgotPassword(req, res) {
  var email = req.params.email;
  logger.audit('forgotPassword' , 'user : ' + email + ', has forgotten his password');
  users.getUserByEmail(email, function(err, result) {
      if(err != null || result == null) {
        logger.error('forgotPassword' , 'could not retrieve user ' + email + ' from db');
        res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
        return;
      }
      logger.audit('forgotPassword' , 'retrieved ' + email + ' from db, sending Email');
      // TODO: We need to send an Email, for now, we just send the client his credentials via JSON, but this is NOT good
      res.send(wpresponse.sendResponse(result, null, null, true));
  });
};
