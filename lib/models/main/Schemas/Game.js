//Game
var mongoose     = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var cache = require('../../../framework/wpCache');
var logger = require('../../../utils/logger').init('User');

var Schema = mongoose.Schema;

var GameSchema   = new Schema({
	leagueId : {type : String, required: true},
	users : [Schema.Types.Mixed],
	matchDay : {type : Date, required : true},
	dateCreated: { type: Date, default: Date.now },
	closed : {type : Boolean, default : false},
	matchId : String,
	makeTeamsAtNum : Number,
	numOfPlayersPerTeam : Number,
	teams : [Schema.Types.Mixed]
});

var Game = mongoose.model('Game', GameSchema);
module.exports.Game = Game;

module.exports.addGame = function(leagueId, matchDay, clientId, users, numOfPlayersPerTeam, makeTeamsAtNum, callback) {
	var game = new Game();
	game.leagueId = leagueId;
	game.users = users;
	game.matchDay = matchDay;
	game.makeTeamsAtNum = makeTeamsAtNum;
	game.numOfPlayersPerTeam = numOfPlayersPerTeam;
	game.save(function(err, result) {
		if(err != null) {
			callback(err, null);
		} else {
			// Success in creating the game
			cache.setById( game._id, game);
			callback(null, result);
		}
	});
};

module.exports.closeGame = function(gameId, callback) {
	Game.findOneAndUpdate({'_id' : gameId, closed : false}, {$set : {closed : true}}, {new : true}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}
		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};

module.exports.openGame = function(gameId, callback) {
	Game.findOneAndUpdate({'_id' : gameId, closed : true}, {$set : {closed : false}}, {new : true} , function(err, game) {
		if(err != null) {
			return callback(err, null);
		}

		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};

module.exports.linkMatchToGame = function(matchId, gameId) {
	Game.findByIdAndUpdate(gameId, {$set : {matchId : matchId}}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}

		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};

module.exports.setTeams = function(gameId, teamsArray, callback) {
	Game.findByIdAndUpdate(gameId, {$set : {teams : teamsArray}}, {new:true}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}
		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
}

module.exports.getGamesListById = function(listOfGamesIds, callback) {
			Game.find({'_id': { $in: listOfGamesIds} }, function(err, result) {
				if(err != null) {
					return callback(err, null);
				} else {
					return callback(null, result);
				}
			}).sort( { matchDay: 1 } );

			// 	if(result != null){
			// 		var jsonResult = {};
			// 		// Cache keys
			// 		for(var i = 0; i < result.length; i++){
			// 			cache.setById(result[i]._id, result[i]);
			// 			jsonResult[result[i]._id] = result[i];
			// 		}
			// 		return callback(null, jsonResult);
			// 	}
			// 	return callback(null, null);
			// });
}

module.exports.updateGameAttendingStatus = function(gameId, clientId, attendingStatus, callback) {
	Game.findOneAndUpdate({ _id: gameId, 'users._id' : clientId},
			{$set : { 'users.$.attending' : attendingStatus, 'users.$.date' : Date() }}, {new:true}, function(err, game) {
				if(err != null) {
					return callback(err, null);
				}

				if(game != null){
					cache.setById( game.id, game);
					return callback(null, game);
				}

				return callback(null, null);
			});
};

module.exports.addUserToGamesBulk = function(gamesArray, gameUser, callback) {
	Game.update({'_id': { $in: gamesArray} },
							{ $addToSet: {users:  gameUser } },
							{new:true, multi: true}, callback);
};

module.exports.addUserToGame = function(gameId, gameUser, callback) {
	Game.findOneAndUpdate({ _id: gameId, closed: false}, { $addToSet: {users:  gameUser  } }, {new:true}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}

		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};

module.exports.updateGame = function(gameId, params, callback) {
	Game.findByIdAndUpdate(gameId,  { $set: params}, {new:true}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}

		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};

module.exports.removeUserFromGame = function(gameId, gameUser, callback) {
	Game.findByIdAndUpdate(gameId,{ $pull: { users: clientId } }, {new:true}, function(err, game) {
		if(err != null) {
			return callback(err, null);
		}

		if(game != null){
			cache.setById( game.id, game);
			return callback(null, game);
		}

		return callback(null, null);
	});
};
