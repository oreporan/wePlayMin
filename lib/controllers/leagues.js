//Controller for leagues

//Init the logger
var logger = require('../utils/logger').init('leagues');
var League = require('../models/main/Schemas/League');
var users = require('./users');
var games = require('./games');
var LeagueUser = require('./userObjects/LeagueUser');
var Constants = require('../utils/Constants');
var wpError = require('../framework/wpError');
var notificationManager = require('../framework/wpNotificationManager');

var async = require('async');
var exports = module.exports = {};

exports.addLeague = function(name, creator, weekDay, gameTime, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
	async.waterfall([
		function(callback) {
			League.addLeague(name, creator, [creator], weekDay, gameTime , numOfPlayersPerTeam , makeTeamsAtNum, [], callback);
		},
		function(league, callback) {
				users.updateLeagues(league.creator, league._id, true, function(err, result){
					callback(err, league);
				});
		}
		// ,
		// function(league, callback) {
		// 	// Create a new game
		// 	var weekDay = league.weekDay;
		// 	var gameTime = league.gameTime;
		//
		// 	games.addGame(league, matchDay, clientId, function(err, result){
		// 		callback(err, league);
		// 	});
		// }
	], function(err, result){
		// End of all callbacks
		if(err != null) {
			if(wpError.isDuplicateError(err)) {
				// Check if the error is a duplicate error, if so, clean it up
				var duplicateField = wpError.getDuplicateErrorField(err);
				return callback(duplicateField + ' leagues already exists', null);
			}
			return callback(err, null);
		}
		return callback(null, result);
	});
};

exports.getLeagueByGameId = function (gameId, callback) {
	League.getLeagueByGameId(gameId, function(err, result) {
		if(err || result == null) {
			callback('could not get leagues, reason : ' + err, null);
		} else {
			callback(null, result);
		}
	})
};

exports.getLeagueByName = function(leagueName, callback) {
	League.getLeagueByName(leagueName, function(err, result) {
		if(err != null || result == null) {
			callback("could not get leagues: " + leagueName + ', reason : ' + err, null);
			return;
		}
		callback(null, result);
	});
};

exports.getLeaguesListSearchQuery = function(leagueName, callback) {
	League.getLeaguesListSearchQuery(leagueName, function(err, result) {
		if(err != null || result == null) {
			callback("could not get leagues: " + leagueName + ', reason : ' + err, null);
			return;
		}
		callback(null, result);
	});
};

var getLeagueById = exports.getLeagueById = function(leagueId, callback) {
	League.getLeagueById(leagueId, function(err, result) {
		if(err != null || result == null) {
			callback("could not get leagues by ID: " + leagueId, null);
			return;
		}
		callback(null, result);
	});
};

var isAdmin = exports.isAdmin = function(clientId, leagueId, callback) {
	getLeagueById(leagueId, function(err, leagueResult) {
		if(err != null || leagueResult == null) {
			callback(false);
		} else {
			callback(leagueResult.admins.indexOf(clientId) > -1);
		}
	})
}

exports.addGameToLeague = function(leagueId, gameId, callback) {
	League.addGameToLeague(leagueId, gameId, function(err, result) {
		if(err != null || result == null) {
			return callback("could not add game to leagues: " + leagueId + ", error: " + err, null);
		}
		return callback(null, result);
	});
};

exports.addUserToLeague = function(clientIdToInvite, clientIdOfInviter, leagueId, isInvite, callback) {
		if(clientIdToInvite === clientIdOfInviter) {
			joinLeague(clientIdToInvite, leagueId, isInvite, callback);
		} else {
				isAdmin(clientIdOfInviter, leagueId, function(isAdmin) {
					if(isAdmin) {
						logger.debug('addUserToLeague', 'admin : ' + clientIdOfInviter + ', has added client : ' + clientIdToInvite + ' to league : ' + leagueId);
						joinLeague(clientIdToInvite, leagueId, isInvite, callback);
					} else {
						// Not self join or admin, kick out
						callback("only admins can invite players", null);
					}
			});
		}
};

function joinLeague(clientIdToInvite, leagueId, isInvite, callback) {
	async.parallel({
		user : function(callback) {
			users.updateLeagues(clientIdToInvite, leagueId, true, callback);
		},
		league : function(callback) {
			var leagueUser = new LeagueUser(clientIdToInvite, isInvite);
			League.addUserToLeague(leagueUser, leagueId, function(err, result) {
				// We need to add this user to all active games in the leagues
				var gamesArrayIds = result.games;
				games.addUserToGamesBulk(gamesArrayIds, leagueUser, function(error, gamesResult) {
					if(err != null) {
						logger.error('addUserToLeague', 'error adding user to all active games of the leagues, reason : ' + error);
						callback(error, null);
					} else {
						callback(null, result);
					}
				});
			});
		}
	}, function(err, results) {
		if(err != null) {
			logger.warn('addUserToLeague', 'could not add user to leagues, reason: ' + err);
			callback(err, null);
		} else {
			// notify
			notificationManager.addUserToLeague(results.league.admins, results.user.name, results.user._id, results.league.name, isInvite);
			callback(null, results.league);
		}
	});
}

exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	// First we remove the leagues from the user's array
	users.updateLeagues(clientId, leagueId, false, function(err, userResult) {
		if(err != null) {
			logger.error('removeUserFromLeague', 'could not remove user from leagues: " + leagueId + ", client ID: ' + clientId);
			return;
		}
	});
		League.removeUserFromLeague(clientId, leagueId, function(err, result) {
			if(err != null || result == null) {
				callback("could not remove user from leagues: " + leagueId + ", reason : " + err, null);
				return;
			}

			if(result.users.length == 0) {
				// The leagues is dead
				logger.audit('removeUserFromLeague', 'The last user has left the leagues ' + leagueId);
				updateLeague(result.id, { creator: null });
			}

			// If there are no more admins
		else if(result.admins.length == 0){
				var randomUser = Math.floor((Math.random() * result.users.length) + 1);
				logger.audit('removeUserFromLeague', 'The client leaving the leagues is the last admin - appointing new admin: ' + result.users[randomUser]);
				updateLeague(result.id, { admins: [result.users[randomUser]] });
			}
			callback(null, result);
		});
};


exports.getAllUserLeagues = function(listOfLeagues, callback) {
	League.getAllUserLeagues(listOfLeagues, function(err, result) {
		if(err != null || result == null || result.length < 1) {
			callback("could not get list of leagues", null);
			return;
		}
		callback(null, result);
	});
};

exports.addAdmin = function(leagueId, clientId, clientToAdminize, callback) {
	// First we check if this clientId has privilages to make admins
	League.getLeagueById(leagueId, function(err, result) {
		if(err != null || result == null) {
			callback('could not get leagues, reason: ' + err, null);
			return;
		}
		if(result.admins.indexOf(clientId) < 0) {
			logger.error('addAdmin', 'A non admin ('+clientId+') attempted to make someone an admin ('+clientToAdminize+')');
			callback('only admins can make other admins', null);
			return;
		}
		// iterate over all the users, check if this user is in the leagues
		var userExists = false;
		for(var i = 0 ; i < result.users.length ; i++) {
			if(result.users[i]._id == clientToAdminize) {
				userExists = true;
			}
		}
		if(!userExists) {
			logger.error('addAdmin', 'attempt to make someone who is NOT a user in the leagues, an admin: '+clientToAdminize);
			return callback('this user is not in the leagues', null);
		}
		// Update the leagues with the new admin
		var oldAdmins = result.admins;
		oldAdmins.push(clientToAdminize);
		// notify
		notificationManager.addAdmin(clientId, clientToAdminize, result.name);
		updateLeague(leagueId, {admins : oldAdmins} , callback);
	})
};

var updateLeague = exports.updateLeague = function(leagueId, params, callback) {
	League.updateLeague(leagueId, params, function(err, result) {
		if(err != null || result == null) {
			if(callback != null) {
			callback("updateLeague", "could not update leagues: " + leagueId + " with params: " + JSON.stringify(params), null);
			}
			logger.error("updateLeague", "could not update leagues: " + leagueId + " with params: " + JSON.stringify(params));
			return;
		}
		logger.audit("updateLeague", "success to update leagues: " + leagueId + " with params: " + JSON.stringify(params));
		if(callback != null) {
				callback(null, result);
		}
	});
};
