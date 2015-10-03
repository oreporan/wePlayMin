//Controller for leagues

//Init the logger
var logger = require('../framework/logger').init('leagues');
var League = require('../models/Schemas/League');
var users = require('./users');
var games = require('./games');

module.exports.addLeague = function(name, admin, frequency, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
	var games = [];
	League.addLeague(name, admin, frequency, games, [admin], numOfPlayersPerTeam , makeTeamsAtNum,  function(err , leagueResult) {
		if(err != null) {
			callback(err , null);
		} else {
			// League was saved - now we add this league to the user's league array
			users.updateLeagues(leagueResult.admin, leagueResult._id, true, function(err, userResult) {
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
			callback("could not add game to league: " + leagueId + ", error: " + err, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.addUserToLeague = function(clientId, leagueId, callback) {
	// First we add league to the users league array
	users.updateLeagues(clientId, leagueId, true, function(err, result) {
		if(err != null) {
			logger.warn('addUserToLeague', 'could not update this league in this users league array');
			callback(err, null);
		} else {
			League.addUserToLeague(clientId, leagueId, callback);
		}
	})
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	League.removeUserFromLeague(clientId, leagueId, function(err, result) {
		if(err != null || result == null) {
			callback("could not remove user from league: " + leagueId + ", client ID: " + clientId, null);
			return;
		}

		if(result.users.length == 0) {
			// The league is dead
			logger.audit('removeUserFromLeague', 'The last user has left the league ' + leagueId);
			updateLeague(result.id, { admin: null });
		}

	else if(result.admin === clientId){
			var randomUser = Math.floor((Math.random() * result.users.length) + 1);
			logger.audit('removeUserFromLeague', 'The client leaving the league is the admin - appointing new admin: ' + result.users[randomUser]);
			updateLeague(result.id, { admin: result.users[randomUser] });
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

var updateLeague = module.exports.updateLeague = function(leagueId, params, callback) {
	League.updateLeague(leagueId, params, function(err, result) {
		if(err != null || result == null) {
			if(callback != null) {
			callback("updateLeague", "could not update league: " + leagueId + " with params: " + params + leagueId, null);
			}
			logger.error("updateLeague", "could not update league: " + leagueId + " with params: " + params);
			return;
		}
		logger.audit("updateLeague", "success to update league: " + leagueId + " with params: " + params);
		if(callback != null) {
				callback(null, result);
		}
	});
};
