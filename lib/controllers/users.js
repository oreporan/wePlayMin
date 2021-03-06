//Controller for Users
//var User = require('../models/Schemas').User;
var User = require('../models/main/Schemas/User');

//Init the logger
var logger = require('../utils/logger').init('users');


var getUserById = module.exports.getUserById = function( clientId , callback ) {
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

module.exports.addNotification = function(notification, callback) {
	User.addNotification(notification, callback);
}

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

module.exports.findOrCreate = function(userName, email, password, authId, profilePicURL, callback) {
	// Attempt to add user
	addUser(userName, email, password, authId, profilePicURL, function(err, result) {
		// User was created
		if(err == null) {
			logger.audit('findOrCreate', 'new user, registering with auth type - ' + authId.method);
			return callback(null, result);
		}
		logger.audit('findOrCreate', 'user already exists in the DB, fetching');
		// Client exists
		getUserByEmail(email, function(err, result){
			if(err || !result) {
				logger.error('findOrCreate', 'problem getting user '+ email +' from the DB');
				callback(err,null);
			} else {
				if(result.authId.method != authId.method) {
					logger.audit('findOrCreate', 'user existed with different authentication method, updating');
					// The user has changed his authentication method, we update the user
					updateUser(result._id, {authId : authId} ,callback);
				} else {
					callback(err, result);
				}
			}
		});
	});
}

module.exports.getUsersListSearchQuery = function(keyword, callback) {
	User.getUsersListSearchQuery(keyword, function(err, result) {
		if(err != null) {
			callback("could not get users: " + keyword + ', reason : ' + err, null);
			return;
		}
		callback(null, result);
	});
};

var addUser = module.exports.addUser = function(userName, email, password, authId, profilePicURL, callback ) {
	User.addUser(userName, email, password, authId, profilePicURL, callback);
};

module.exports.updateLeagues = function(clientId, leagueId, shouldAdd, callback ) {
	User.updateLeagues(clientId, leagueId, shouldAdd, callback);
};

var updateActiveGames = module.exports.updateActiveGames = function(clientId, gameId, shouldAdd, callback ) {
	User.updateActiveGames(clientId, gameId, shouldAdd , callback);
};

module.exports.updateActiveGamesBulk = function(clientIdList, gameId, shouldAdd, callback ) {
	var updatedClients = 0;
	for(var i = 0 ; i < clientIdList.length ; i++) {
		updateActiveGames(clientIdList[i], gameId, shouldAdd, function(err, result) {
			updatedClients++;
			if(callback && updatedClients >= clientIdList.length) {
				callback(null, result);
			}
		});
	}
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

var getUserByEmail = module.exports.getUserByEmail = function(email, callback) {
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

var updateUser = module.exports.updateUser = function(userId, params, callback) {
	User.updateUser(userId, params, function(err, result) {
		if(err != null || result == null) {
			callback("Could not update user:" + userId + ", reason - " + err, null);
			return;
		}
		callback(null, result);
	});
};
