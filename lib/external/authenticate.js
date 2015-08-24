// This external endpoint holds Signup and Sign in
var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpresponse = require('../framework/wpResponse');
app.use("/authenticate", router);
var users = require('../controllers/users');
//Init the logger
var logger = require('../framework/logger').init('authenticate');



//Path : /users Method: POST
router.post('/signup', addUser);
function addUser(req, res) {
	var email = req.body.email;
	var name = req.body.name;
  var password = req.body.password;
	logger.audit('addUser' , 'adding User: ' + email + ' to runtime DB');

	users.addUser(name, email, password ,function(result , err ) {
		if( err != null ) {
			logger.error('addUser' , ' can not add user: ' + email + ' to runtime DB, ' + err);
			res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
		} else {
			logger.audit('addUser' , 'User: ' + email + ' added to Users DB with clientId ' + result.id);
			res.send(wpresponse.sendResponse(result, null, null, true));
		}
	});
};


//Path : /users Method: POST
router.post('/signin', authenticate);
function authenticate(req, res) {
	var email = req.body.email;
  var password = req.body.password;
	logger.audit('authenticate' , 'authenticating user: ' + email);

  users.getUserByEmail(email, password , function(err, result) {
    if(err != null || result == null) {
      if(err == null) err = "could not get user";
      logger.error('authenticate' , 'could not get user by email : ' + email);
      res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
    } else {
      var isSuccesful = (password === result.password);
      if(isSuccesful) {
        logger.audit('authenticate' , 'User: ' + email + ' was retrieved, successfull login');
      } else {
        logger.warn('authenticate' , 'User: ' + email + ' was retrieved, but wrong password');
      }
      res.send(wpresponse.sendResponse(null, null, null, isSuccesful));
    }
  });
};
