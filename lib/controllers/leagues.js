//Controller for leagues

//Init the logger
var logger = require('../framework/logger').init('leagues');
var League = require('../models/Schemas').League;

module.exports.addLeague = function(name, admin, frequency, games, users, callback) {
	var league = new League();      // create a new instance of the League model
	league.name = name;
	league.admin = admin;
	league.frequency = frequency;
	league.games = games;
	league.users = users;
	// save the user and check for errors
	league.save(function(err , result) {
		if(err) {
			callback(null , err);
		}
		// User was saved
		callback(result , null);
	});
};

module.exports.getLeagueByName = function(leagueName, callback) {
	League.findOne({name : leagueName}, function(err, result) {
		if(err != null || result == null) {
			callback("could not get league: " + leagueName, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.getLeagueById = function(leagueId, callback) {
	League.findOne({_id: leagueId }, function(err, result) {
		if(err != null || result == null) {
			callback("could not get league by ID: " + leagueId, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.addUserToLeague = function(clientId, leagueId, callback) {
	League.update({_id : leagueId}, { $addToSet: {users: [ clientId ] } }, function(err, result) {
		if(err != null || result == null) {
			callback("could not add user to league: " + leagueId + ", client ID: " + clientId, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.removeUserFromLeague = function(clientId, leagueId, callback) {
	League.update({_id : leagueId}, { $pull: { users: clientId } }, function(err, result) {
		if(err != null || result == null) {
			callback("could not remove user from league: " + leagueId + ", client ID: " + clientId, null);
			return;
		}
		if(result.admin === clientId){
			updateLeague(result.id, { admin: clientId});
		}
		callback(null, result);
	});
};


module.exports.getAllUserLeagues = function(clientId, callback) {
	League.find({ users: { $all: [ clientId ] } }, function(err, result) {
		if(err != null || result == null) {
			callback("could not get all user's league, clientId " + clientId, null);
			return;
		}
		callback(null, result);
	});
};

module.exports.updateLeague = function(leagueId, params, callback) {
	League.update({ _id: leagueId},  { $set: params}, function(err, result) {
		if(err != null || result == null) {
			callback("updateLeague", "could not update league: " + leagueId + " with params: " + params + leagueId, null);
			logger.error("updateLeague", "could not update league: " + leagueId + " with params: " + params);
			return;
		}
		logger.error("updateLeague", "success to update league: " + leagueId + " with params: " + params);
		callback(null, result);
	});
};