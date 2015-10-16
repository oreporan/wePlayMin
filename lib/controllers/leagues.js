//Controller for leagues

//Init the logger
var logger = require('../utils/logger').init('leagues');
var League = require('../models/Schemas/League');
var users = require('./users');
var games = require('./games');

module.exports.addLeague = function(name, creator, frequency, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
	var games = [];
	League.addLeague(name, creator, [creator], frequency, games, [creator], numOfPlayersPerTeam , makeTeamsAtNum, [],  function(err , leagueResult) {
		if(err != null) {
			callback(err , null);
		} else {
			// League was saved - now we add this league to the user's league array
			users.updateLeagues(leagueResult.creator, leagueResult._id, true, function(err, userResult) {
				if(err != null) {
					callback(err, null);
				} else {
					callback(null, leagueResult);
				}
			});
		}
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

module.exports.addUserToLeague = function(clientId, leagueId, isInvite, callback) {
	users.updateLeagues(clientId, leagueId, true, function(err, result) {
		if(err != null) {
			logger.warn('addUserToLeague', 'could not update this league in this users league array');
		}
	});
	League.addUserToLeague(clientId, leagueId, isInvite, callback);
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
			console.log(result);
			if(err != null || result == null) {
				callback("could not remove user from league: " + leagueId + ", client ID: " + clientId, null);
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
		if(result.users.indexOf(clientToAdminize) < 0) {
			logger.error('addAdmin', 'attempt to make someone who is NOT a user in the league, an admin: '+clientToAdminize);
			callback('this user is not in the league', null);
			return;
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
