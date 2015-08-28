//Controller for Users
var User = require('../models/Schemas').User;
//Init the logger
var logger = require('../framework/logger').init('users');


module.exports.getUserById = function( clientId , callback ) {
	logger.audit('getUserById' , "Getting user: " + clientId);

	if(clientId == null) {
		callback(null, "no clientId");
		return;
	}
	User.findById(clientId , function(err, user) {
		if (err != null){
			logger.error('getUserById' , err);
			callback(err , null);
			return;
		}
		if(user == null){
			callback("User not found" , null);
			return;
		} else {
			logger.audit('getUserById', "User " + clientId + " found succesfully");
			callback(null, user);
		}
	}).select("-password");
};


module.exports.addUser = function(userName, email, password, callback ) {
	var user = new User();      // create a new instance of the User model
	user.name = userName;
	user.password = password;
	user.leagues = [];
	user.email = email;
	user.attending = 0 ;


	// save the user and check for errors
	user.save(function(err , result) {
		if(err) {
			callback(null , err);
		}
		// User was saved
		callback(result , null);
	});

};


module.exports.getUserByName = function(userName, callback) {
	User.findOne({name : userName}, function(err, result) {
		if(err != null || result == null) {
			callback("could not get user: " + userName, null);
			return;
		}
		callback(null, result);
	}).select("-password");
};

module.exports.getUserByEmail = function(email, callback) {
	User.findOne({email : email}, function(err, result) {
		if(err != null || result == null) {
			callback("could not get user: " + email, null);
			return;
		}
		callback(null, result);
	}).select("+password"); // Here we send the password as well, because this is used to retrieve an old user's password
}

module.exports.authenticateUser = function(email, password, callback) {
	User.findOne({email : email, password: password}, function(err, result) {
		if(err != null || result == null) {
			callback("Could not authenticate user" + email, null);
			return;
		}
		callback(null, result);
	}).select("-password");
}
