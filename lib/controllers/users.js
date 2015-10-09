//Controller for Users
//var User = require('../models/Schemas').User;
var User = require('../models/Schemas/User');

//Init the logger
var logger = require('../utils/logger').init('users');


module.exports.getUserById = function( clientId , callback ) {
	if(clientId == null) {
		callback( "no clientId", null);
		return;
	}
	User.getUserById(clientId , function(err, user) {
		if (err != null){
			logger.error('getUserById' , err);
			callback(err , null);
			return;
		}
		if(user == null){
			callback("User not found" , null);
			return;
		} else {
			callback(null, user);
		}
	});
};

/*
* Returns an array of users
* @param - a list of clientIds
*/
module.exports.getUsersListById = function (listOfClientIds, callback) {
	User.getUsersListById(listOfClientIds, function(err , result) {
		if(err != null || result == null) {
			callback(err , null);
		}
		callback(null , result);
	});
};


module.exports.addUser = function(userName, email, password, callback ) {
	User.addUser(userName, email, password, function(err , result) {
		if(err) {
			callback(err , null);
		}
		// User was saved
		callback(null , result);
	});
};

module.exports.updateLeagues = function(clientId, leagueId, shouldAdd, callback ) {
	User.updateLeagues(clientId, leagueId, shouldAdd, function(err , result) {
		if(err) {
			callback(err , null);
		}
		// User was saved
		callback(null , result);
	});
};

module.exports.updateActiveGames = function(clientId, gameId, shouldAdd, callback ) {
	User.updateActiveGames(clientId, gameId, shouldAdd , function(err , result) {
		if(err) {
			callback(err , null);
		}
		callback(null , result);
	});
};


module.exports.getUserByName = function(userName, callback) {
	User.getUserByName(userName, function(err, result) {
		if(err != null || result == null) {
			callback("could not get user: " + userName, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.getUserByEmail = function(email, callback) {
	User.getUserByEmail(email, function(err, result) {
		if(err != null || result == null) {
			callback("could not get user: " + email, null);
			return;
		}
		callback(null, result);
	}); // Here we send the password as well, because this is used to retrieve an old user's password
}

module.exports.authenticateUser = function(email, password, callback) {
	User.authenticateUser(email, password, function(err, result) {
		if(err != null || result == null) {
			callback("Could not authenticate user" + email, null);
			return;
		}
		callback(null, result);
	});
}

module.exports.updateUser = function(userId, params, callback) {
	User.updateUser(userId, params, function(err, result) {
		if(err != null || result == null) {
			callback("Could not update user:" + userId + ", reason - " + err, null);
			return;
		}
		callback(null, result);
	});
};
