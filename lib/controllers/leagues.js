//Controller for leagues

//Init the logger
var logger = require('../utils/logger').init('leagues');
var League = require('../models/main/Schemas/League');
var users = require('./users');
var games = require('./games');
var LeagueUser = require('./userObjects/LeagueUser');
var Constants = require('../utils/Constants');
var wpError = require('../framework/wpError');
var async = require('async');

module.exports.addLeague = function(name, creator, frequency, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
	async.waterfall([
		function(callback) {
			League.addLeague(name, creator, [creator], frequency, numOfPlayersPerTeam , makeTeamsAtNum, [], callback);
		},
		function(league, callback) {
				users.updateLeagues(league.creator, league._id, true, function(err, result){
					callback(err, league);
				});
		}
	], function(err, result){
		// End of all callbacks
		if(err != null) {
			if(wpError.isDuplicateError(err)) {
				// Check if the error is a duplicate error, if so, clean it up
				var duplicateField = wpError.getDuplicateErrorField(err);
				return callback(duplicateField + ' league already exists', null);
			}
			return callback(err, null);
		}
		return callback(null, result);
	});
};

module.exports.getLeagueByGameId = function (gameId, callback) {
	League.getLeagueByGameId(gameId, function(err, result) {
		if(err || result == null) {
			callback('could not get league, reason : ' + err, null);
		} else {
			callback(null, result);
		}
	})
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.getLeagueByName(leagueName, function(err, result) {
		if(err != null || result == null) {
			callback("could not get league: " + leagueName + ', reason : ' + err, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.getLeagueById = function(leagueId, callback) {
	League.getLeagueById(leagueId, function(err, result) {
		if(err != null || result == null) {
			callback("could not get league by ID: " + leagueId, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.addGameToLeague = function(leagueId, gameId, callback) {
	League.addGameToLeague(leagueId, gameId, function(err, result) {
		if(err != null || result == null) {
			return callback("could not add game to league: " + leagueId + ", error: " + err, null);
		}
		return callback(null, result);
	});
};

module.exports.addUserToLeague = function(clientId, leagueId, isInvite, position, callback) {
	users.updateLeagues(clientId, leagueId, true, function(err, result) {
		if(err != null) {
			logger.warn('addUserToLeague', 'could not update this league in this users league array');
		}
		var leagueUser = new LeagueUser(result._id, position, isInvite);
		League.addUserToLeague(leagueUser, leagueId, callback);
	});
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	// First we remove the league from the user's array
	users.updateLeagues(clientId, leagueId, false, function(err, userResult) {
		if(err != null) {
			logger.error('removeUserFromLeague', 'could not remove user from league: " + leagueId + ", client ID: ' + clientId);
			return;
		}
	});
		League.removeUserFromLeague(clientId, leagueId, function(err, result) {
			if(err != null || result == null) {
				callback("could not remove user from league: " + leagueId + ", reason : " + err, null);
				return;
			}

			if(result.users.length == 0) {
				// The league is dead
				logger.audit('removeUserFromLeague', 'The last user has left the league ' + leagueId);
				updateLeague(result.id, { creator: null });
			}

			// If there are no more admins
		else if(result.admins.length == 0){
				var randomUser = Math.floor((Math.random() * result.users.length) + 1);
				logger.audit('removeUserFromLeague', 'The client leaving the league is the last admin - appointing new admin: ' + result.users[randomUser]);
				updateLeague(result.id, { admins: [result.users[randomUser]] });
			}
			callback(null, result);
		});
};


module.exports.getAllUserLeagues = function(listOfLeagues, callback) {
	League.getAllUserLeagues(listOfLeagues, function(err, result) {
		if(err != null || result.length < 1) {
			callback("could not get list of leagues", null);
			return;
		}
		callback(null, result);
	});
};

module.exports.addAdmin = function(leagueId, clientId, clientToAdminize, callback) {
	// First we check if this clientId has privilages to make admins
	League.getLeagueById(leagueId, function(err, result) {
		if(err != null || result == null) {
			callback('could not get league, reason: ' + err, null);
			return;
		}
		if(result.admins.indexOf(clientId) < 0) {
			logger.error('addAdmin', 'A non admin ('+clientId+') attempted to make someone an admin ('+clientToAdminize+')');
			callback('only admins can make other admins', null);
			return;
		}
		// iterate over all the users, check if this user is in the league
		var userExists = false;
		for(var i = 0 ; i < result.users.length ; i++) {
			if(result.users[i]._id == clientToAdminize) {
				userExists = true;
			}
		}
		if(!userExists) {
			logger.error('addAdmin', 'attempt to make someone who is NOT a user in the league, an admin: '+clientToAdminize);
			return callback('this user is not in the league', null);
		}
		// Update the league with the new admin
		var oldAdmins = result.admins;
		oldAdmins.push(clientToAdminize);
		updateLeague(leagueId, {admins : oldAdmins} , callback);
	})
};

var updateLeague = module.exports.updateLeague = function(leagueId, params, callback) {
	League.updateLeague(leagueId, params, function(err, result) {
		if(err != null || result == null) {
			if(callback != null) {
			callback("updateLeague", "could not update league: " + leagueId + " with params: " + JSON.stringify(params), null);
			}
			logger.error("updateLeague", "could not update league: " + leagueId + " with params: " + JSON.stringify(params));
			return;
		}
		logger.audit("updateLeague", "success to update league: " + leagueId + " with params: " + JSON.stringify(params));
		if(callback != null) {
				callback(null, result);
		}
	});
};
