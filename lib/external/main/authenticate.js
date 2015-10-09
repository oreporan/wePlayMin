// This external endpoint holds Signup and Sign in
var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpresponse = require('../../framework/wpResponse');
var users = require('../../controllers/users');
//Init the logger
var logger = require('../../utils/logger').init('authenticate');
var path = require('../../utils/Paths');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'weplaymodulus@gmail.com',
        pass: 'niryahavore'
    }
});


app.use(path.BASE_AUTHENTICATE, router);

//Path : /users Method: POST
router.post(path.PATH_AUTHENTICATE_SIGNUP, addUser);
function addUser(req, res) {
	var email = req.body.email;
	var name = req.body.name;
  var password = req.body.password;
	logger.audit('signup' , 'adding User: ' + email + ' to runtime DB');

	users.addUser(name, email, password ,function(err , result ) {
		if( err != null ) {
			logger.warn('signup' , ' can not add user: ' + email + ' to runtime DB, ' + err);
			res.send(wpresponse.sendResponse(false, null, err , err.errmsg));
			return;
		} else {
			logger.audit('signup' , 'User: ' + email + ' added to Users DB with clientId ' + result.id);
			res.send(wpresponse.sendResponse(true, {clientId : result.id}));
		}
	});
};

//Path : /users Method: POST
router.post(path.PATH_AUTHENTICATE_SIGNIN, authenticate);
function authenticate(req, res) {
	var email = req.body.email;
  var password = req.body.password;
	logger.audit('signin' , 'authenticating user: ' + email);
  users.authenticateUser(email, password , function(err, result) {
    if(err != null || result == null) {
      if(err == null) err = "could not get user";
      logger.error('signin' , 'could not authenticate user, wrong email or password ' + email);
      res.send(wpresponse.sendResponse(false, null, err , err.errmsg));
    } else {
			logger.audit('signin' , 'success - user authenticated: ' + email);
      res.send(wpresponse.sendResponse(true, result));
    }
  });
};

router.get(path.PATH_AUTHENTICATE_FORGOTPASSWORD_WITH_EMAIL + '/:email', forgotPassword);
function forgotPassword(req, res) {
  var email = req.params.email;
  logger.audit('forgotPassword' , 'user : ' + email + ', has forgotten his password');
  users.getUserByEmail(email, function(err, result) {
      if(err != null || result == null) {
        logger.error('forgotPassword' , 'could not retrieve user ' + email + ' from db');
        res.send(wpresponse.sendResponse(false, null, err , err.errmsg));
        return;
      }
      logger.audit('forgotPassword' , 'retrieved ' + email + ' from db, sending Email that contains password');
			var mailOptions = {
    		from: 'WePlay <weplaymodulus@gmail.com>', // sender address
    		to: result.email,
    		subject: 'Your password at WePlay',
    		text: 'Hey' + result.name + ', this is your password - ' + result.password,
			};

			transporter.sendMail(mailOptions, function(error, info){
    if(error){
        logger.warn('forgotPassword', 'could not send email with password, reason: ' + error);
    } else {
				logger.audit('forgotPassword','Message sent: ' + info.response);
		}
		});
			res.send(wpresponse.sendResponse(true, "email sent"));
  });
};
