var express = require('express');
var app = module.exports = express(); 
var router = express.Router();

app.use("/users", router);

//This class holds all the methods for users
var User = require('../models/Schemas').User;
var users = require('../controllers/users');
//Init the logger
var logger = require('../framework/logger').init('users');

//Path : /users Method: POST
router.post('/addUser', addUser);
function addUser(req, res) {
	logger.audit('addUser' , 'adding User: ' + req.body.name + ' to Users DB');
	users.addUser(req.body.name, null ,function(result , err ) {
		if( err != null ) {
			logger.error('addUser' , ' can not add user: ' + req.body.name + ' to Users DB');
			res.status(400).send(err);
		} else {
			res.send(result);
		}
	});
};

//Path : /users Method: GET
router.get('/getUsers', getAllUsers);
function getAllUsers(req, res) {
	logger.audit('getAllUsers' , 'getting all users..');
	User.find(function(err, users) {
		if (err)
			res.status(400).send(messages.dbErrorMessage(err.message, err.errors));

		res.json(users);
	});
};

//Path : /users/:user_name Method: GET
router.get('/getUsers/:user_name', getUserByName);
function getUserByName(req, res) {
	User.findOne({name : req.params.user_name}, function(err, user) {
		if (err){
			res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
		}
		if(user == null){
			res.json(messages.dbErrorMessage("No User exists in the Database", "User: " + req.params.user_name + ", does not exist in the database"));
		} else {
			res.send(user);
		}
	});
};

//Path : /users/:user_id Method: GET
router.get('/getUsers/:user_id', getUserById);
function getUserById(req, res) {
	User.findById(req.params.user_id, function(err, user) {
		if (err){
			res.status(400).send(messages.dbErrorMessage(err.message, err.errors));
		}
		if(user == null){
			res.json(messages.dbErrorMessage("No User exists in the Database", "User: " + req.params.user_id + ", does not exist in the database"));
		} else {
			res.send(user);
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

