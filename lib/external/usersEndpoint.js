var express = require('express');
var app = module.exports = express(); 
var router = express.Router({mergeParams:true});
var wpresponse = require('../framework/wpResponse');
app.use("/users", router);

//This class holds all the methods for users
var User = require('../models/Schemas').User;
var users = require('../controllers/users');
//Init the logger
var logger = require('../framework/logger').init('usersEndpoint');

//Path : /users Method: POST
router.post('/addUser', addUser);
function addUser(req, res) {
	var email = req.body.email;
	var name = req.body.name;
	logger.audit('addUser' , 'adding User: ' + email + ' to Users DB');
	
	users.addUser(name, email ,function(result , err ) {
		if( err != null ) {
			logger.error('addUser' , ' can not add user: ' + email + ' to Users DB, ' + err.errmsg);
			res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
		} else {
			logger.audit('addUser' , 'User: ' + email + ' added to Users DB with clientId ' + result.id);
			res.send(wpresponse.sendResponse(result, null, null, true));
		}
	});
};

//Path : /users/:user_name Method: GET
router.get('/getUsersByName/:name', getUserByName);
function getUserByName(req, res) {
	users.getUserByName(req.params.name, function(err, user) {
		if (err != null){
			logger.error('getUserByName', "could not get user " + req.params.name + ", error:" + err.errmsg);
			res.send(wpresponse.sendResponse(null, err , err.errmsg ,false));
			return;
		}
		if(user == null){
			res.send(wpresponse.sendResponse(null, "no user error", "No User exists in the Database", "User: " + req.params.name + ", does not exist in the database", false));
		} else {
			res.send(wpresponse.sendResponse(user, null, null, true));
		}
	});
};

//Path : /users/:user_id Method: GET
router.get('/getUsers/:user_id', getUserById);
function getUserById(req, res) {
	users.getUserById(req.params.user_id, function(err, user) {
		if (err != null){
			res.send(wpresponse.sendResponse(null, err, err.errmsg, false));
		}
		if(user == null){
			res.send(wpresponse.sendResponse(null, "no user error", "No User exists in the Database", "User: " + req.params.name + ", does not exist in the database", false));
		} else {
			res.send(wpresponse.sendResponse(user, null, null, true));
		}
	});
};

//Path : /users/:user_id Method: PUT
router.put('/updateUser/:user_id', updateUser);
function updateUser(req, res) {

	// use our user model to find the user we want
	User.find({name : req.params.user_id}, function(err, user) {

		if (err)
			res.send(err);

		user.name = req.body.name;
		user.id = req.body.id;
		user.leagues = req.body.leagues;
		user.attending = req.body.attending;

		// save the bear and check for errors
		user.save(function(err) {
			if(err) {
				console.log(err.stack);
				res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
			} 
			// User was saved
			res.json(messages.dBUserSavedMessage());
		});

	})

};

