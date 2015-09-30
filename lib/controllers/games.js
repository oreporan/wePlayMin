//Controller for games
var logger = require('../framework/logger').init('games');
var Game = require('../models/Game');
var leagues = require('./leagues');
var users = require('./users');


module.exports.addGame = function(leagueId, matchDay, clientId, callback) {
  // Use the league controller to push this game in to the league
  leagues.getLeagueById(leagueId, function(err, result){
  if(err != null || result == null) {
    // No league found
    callback(err, null);
  } else if (result.admin != clientId) {
    // League was found, check if the creator is the admin, only admins can create games
    callback('only admins can create games', null);
  } else {
    Game.addGame(leagueId, matchDay, clientId, function(er , game) {
  		if(er) {
  			callback(er , null);
  		} else {
        // Success in creating the game, push this game to the right league
        leagues.addGameToLeague(leagueId, game.id, callback);
      }
  	});
    }
  });
};

/*
* Returns an array of games objects
* @param - a list of gameIds
*/
module.exports.getGamesListById = function (listOfGamesIds, callback) {
	Game.getGamesListById(listOfGamesIds, function(err , result) {
		if(err != null || result == null) {
			callback(err , null);
		}
		callback(null , result);
	});
};

module.exports.getGameById = function (gameId, callback) {
	Game.getGamesListById([gameId], function(err , result) {
		if(err != null || result == null) {
			callback(err , null);
		}
		callback(null , result);
	});
};

module.exports.addUserToGame = function(gameId, clientId, callback) {
  users.updateActiveGames(clientId, gameId, true , function(err, client) {
    Game.addUserToGame(gameId, client.id, callback);
  });
};

module.exports.removeUserFromGame = function(gameId, clientId, callback) {
  users.updateActiveGames(clientId, gameId, false , function(err, client) {
    Game.addUserToGame(gameId, client.id, callback);
  });
};
