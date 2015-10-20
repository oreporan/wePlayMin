// This external endpoint holds Signup and Sign in
var express = require('express');
var app = module.exports = express();
var router = express.Router({mergeParams:true});
var wpresponse = require('../../framework/wpResponse');
var users = require('../../controllers/users');
var Constants = require('../../utils/Constants');


//Init the logger
var logger = require('../../utils/logger').init('authenticate');
var path = require('../../utils/Paths');
var nodemailer = require('nodemailer');
var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(path.BASE_AUTHENTICATE, router);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookTokenStrategy({
    clientID: Constants.FACEBOOK_APP_ID,
    clientSecret: Constants.FACEBOOK_APP_SECRET
  }, function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    var password = accessToken;
    var userName = profile.name.givenName + ' ' + profile.name.familyName;
    logger.audit('facebookAuthentication' , 'user ' + email + ' authenticating via facebook');
    var user = {email : email, password : password, username : userName};
    return done(null, user);
  }
));

router.post(path.PATH_AUTHENTICATE_FACEBOOK,
  passport.authenticate('facebook-token'),
  function (req, res) {
    var user = req.user
    users.findOrCreate(user.username, user.email, user.password, function(err, result){
      if(err) {
        res.send(wpresponse.sendResponse(false, null, err, err.errmsg));
        return;
      }
      res.send(wpresponse.sendResponse(true, {'client-id' : result._id}));
    });
  }
);


//Path : /users Method: POST
router.post(path.PATH_AUTHENTICATE_SIGNUP, signup);
function signup(req, res) {
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
			res.send(wpresponse.sendResponse(true, {'client-id' : result.id}));
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

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'weplaymodulus@gmail.com',
        pass: 'niryahavore'
    }
});

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
