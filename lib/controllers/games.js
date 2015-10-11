//Controller for games
var logger = require('../utils/logger').init('games');
var wpDate = require('../framework/wpDate');
var matches = require('../models/main/matches');
var gameBuilder = require('../models/main/gameBuilder');
var Game = require('../models/Schemas/Game');
var leagues = require('./leagues');
var users = require('./users');
var async = require('async');


function createNewGame(leagueId, matchDay, clientId, callback){
  logger.audit('createNewGame' , 'creating a game in league - '+ leagueId +', to be played at:' + matchDay);
  Game.addGame(leagueId, matchDay, clientId, function(er , game) {
    if(er) {
      if(callback) callback(er , null);
    } else {
      async.parallel({
    league : function(callback) {
      leagues.addGameToLeague(leagueId, game.id, callback);
    },
    user : function(callback) {
      if(clientId) {
        addUserToGame(game.id, clientId, callback);
      }
    },
    match : function(callback){
      matches.createMatch(game.id, game.matchDay, callback);
  },
}, function (err, result) {
    if(err != null) {
      if(callback ) callback('error creating new game, reason : ' + err, null);
    } else {
        // Now we need to dump all the users in to the game's users
        var users = result.league.users;
        updateGame(game.id, {users : users}, function(err, gameRes) {
        Game.linkMatchToGame(result._id, game._id);
        if(callback) callback(null, result.league);
        })
    }
    });
    }
  });
};


/* Closes the game and builds the game! */
module.exports.closeGame = function(gameId, clientId, callback) {
    // Get the match linked with this game
    getGameById(gameId, function(err, gameResult) {
      if( err != null ) {
        callback(err, null);
      } else {
        var leagueId = gameResult.leagueId;
        leagues.getLeagueById(leagueId, function(err, leagueResult){
          if(err != null || leagueResult == null) {
            // No league found
            callback(err, null);
          } else if (leagueResult.admins.indexOf(clientId) < 0) {
            // League was found, check if the creator is the admin, only admins can create games
            callback('only admins can close games', null);
          } else {
            var matchId = gameResult.matchId;
            Game.closeGame(gameId, callback);
          }
        });
      }
    });
  };


module.exports.addGame = function(leagueId, matchDay, clientId, callback) {
  // Use the league controller to push this game in to the league
  leagues.getLeagueById(leagueId, function(err, result){
  if(err != null || result == null) {
    // No league found
    callback(err, null);
  } else if (result.admins.indexOf(clientId) < 0) {
    // League was found, check if the creator is the admin, only admins can create games
    callback('only admins can create games', null);
  } else {
    createNewGame(leagueId, matchDay, clientId, callback);
    }
  });
};

/*
* Returns an array of games objects
* @param - a list of gameIds
*/
module.exports.getGamesListById = function (listOfGames, callback) {
  var ids = [];
  for(var i = 0 ; i < listOfGames.length ; i++) {
    ids.push(listOfGames[i]._id);
  }

	Game.getGamesListById(ids, function(err , result) {
		if(err != null || result == null) {
			callback(err , null);
		}
		callback(null , result);
	});
};

function getGameById(gameId, callback) {
	Game.getGamesListById([gameId], function(err , result) {
		if(err != null || result == null) {
			callback(err , null);
		}
		callback(null , result);
	});
};

var addUserToGame = module.exports.addUserToGame = function(gameId, clientId, callback) {
  async.parallel({
    game : function(callback) {
      Game.addUserToGame(gameId, clientId, function(err, gameResult) {
        callback(err, gameResult);
      })
    },
    user : function(callback) {
      users.updateActiveGames(clientId, gameId, true, callback);
    }
  }, function(err, result) {
    if(err) {
    return  callback(err, null);
    } else {
      // Close the game if the number of players has reached max
      if(result.game == null) {
        return callback('game closed', null);
      }
      updateGameStatus(result.game);
    return  callback(null, result.game); // Return the game
    }
  });
};

var removeUserFromGame = module.exports.removeUserFromGame = function(gameId, clientId, callback) {
  users.updateActiveGames(clientId, gameId, false , function(err, client) {
    Game.addUserToGame(gameId, client.id, callback);
  });
};

// This closes the game if players == max
function updateGameStatus(gameObj) {
  var numOfPlayers = gameObj.users.length;
  var leagueId = gameObj.leagueId;
  leagues.getLeagueById(leagueId, function(err, result) {
    if(err == null) {
      if(result.makeTeamsAtNum == numOfPlayers) {
        logger.audit('updateGameStatus', 'game '+gameObj._id+ ' has reached the makeTeams number, closing game..');
        Game.closeGame(gameObj._id, function (err, result) {
          if(err == null) {
            logger.audit('updateGameStatus', 'game ' + gameObj._id+ ' closed');
          } else {
            logger.error('updateGameStatus', 'game ' + gameObj._id+ ' could not be closed');
          }
        });
      }
    }
  });
}

function createNextGame(gameObj) {
    // Create a new game
    var matchDay = wpDate.addWeekToDate(gameObj.matchDay); // This should be equal to now + week
    logger.audit('createNextGame', 'game : ' + gameObj._id + ' is reoccuring, adding new game for date: ' + matchDay);
    createNewGame(gameObj.leagueId, matchDay, null);
}

/* This function is called by matches model X time before a match */
module.exports.warmUpGame = function(match, callback) {
  var gameId = match.gameId;
  // Now we get the game associated with this match
  Game.getGamesListById([gameId], function(err, gameResult) {
    if(err == null) {

      // Get the league associated with this game - we need this to build a game
      leagues.getLeagueById(gameResult.leagueId, function(err, leagueResult){
        if(err == null) {
          var maxNumOfPlayersPerTeam = leagueResult.numOfPlayersPerTeam;
          var builtGame = gameBuilder.buildGame(gameResult, maxNumOfPlayersPerTeam);
          var params = {teamA: builtGame.teamA, teamB: builtGame.teamB, invites: builtGame.invites};
          updateGame(gameResult._id, params, callback);
        }
      });
    }
  });
}

/* This function is called by matches when a cron job is ticked */
module.exports.playGame = function(match, callback) {
  var gameId = match.gameId;
  // Now we get the game associated with this match
  Game.getGamesListById([gameId], function(err, gameResult) {
    if(err == null) {
      // Set this game to closed
      Game.closeGame(gameId);
      // We need to take this game off of all the user's active games list
      removeUserFromGameBulk(gameId, gameResult.users);
      // Get the league associated with this game - we need this to know if a game is reoccuring
      leagues.getLeagueById(gameResult.leagueId, function(err, leagueResult){
        if(err == null) {
          var maxNumOfPlayersPerTeam = leagueResult.numOfPlayersPerTeam;
          var frequency = leagueResult.frequency;
          if(frequency == 0) {
            // Handle games with weekly frequency
            createNextGame(gameResult);
          }
        }
      });
    }
  });
}

function removeUserFromGameBulk(gameId, usersList) {
  users.updateActiveGamesBulk(usersList, gameId, false);
}

// Updates game fields
function updateGame(gameId, builtGame, callback) {
  Game.updateGame(gameId, builtGame, callback);
}

module.exports.updateGame = updateGame;
module.exports.getGameById = getGameById;
