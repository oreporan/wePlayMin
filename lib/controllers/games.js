//Controller for games
var logger = require('../framework/logger').init('games');
var wpDate = require('../framework/wpDate');
var matches = require('../models/main/matches');
var gameBuilder = require('../models/main/gameBuilder');
var Game = require('../models/Schemas/Game');
var leagues = require('./leagues');
var users = require('./users');

function createNewGame(leagueId, matchDay, clientId, callback){
  logger.audit('createNewGame' , 'creating a game in league - '+ leagueId +', to be played at:' + matchDay);
  Game.addGame(leagueId, matchDay, clientId, function(er , game) {
    if(er) {
      if(callback) callback(er , null);
    } else {
      // Success in creating the game, push this game to the league
      leagues.addGameToLeague(leagueId, game.id, function(err, leagueResult) {
        if(err != null) {
          if(callback) callback(err, null);
        } else {
          // finally - start a match timer
          matches.createMatch(game._id, game.matchDay, function(err, result) {
            if( err != null ) {
            if(callback)  callback(err, null);
            } else {
              // finally, add this match to the game's match value
              Game.linkMatchToGame(result._id, game._id);
              if(callback) callback(null, leagueResult);
            }
          });
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
          } else if (leagueResult.admin != clientId) {
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
  } else if (result.admin != clientId) {
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

module.exports.addUserToGame = function(gameId, clientId, callback) {
    Game.addUserToGame(gameId, clientId, function(err, gameResult) {
      if(err) {
        callback(err, null);
      } else if(gameResult == null) {
        // Could not add user, game is closed
        callback('could not add user, game is closed' , null);
      } else {
        users.updateActiveGames(clientId, gameId, true , function(err, client) {
          if(err) {
            callback(err, null);
          } else {
            // Close the game is the number of players has reached max
            updateGameStatus(gameResult);
            callback(null, gameResult); // Return the game
          }
          });
      }
    });
};

module.exports.removeUserFromGame = function(gameId, clientId, callback) {
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

/* This function is called by matches when a cron job is ticked */
module.exports.playGame = function(match, callback) {
  var gameId = match.gameId;
  // Now we get the game associated with this match
  Game.getGamesListById([gameId], function(err, gameResult) {
    if(err == null) {
      // Set this game to closed
      Game.closeGame(gameId);

      // Get the league associated with this game - we need this to build a game
      leagues.getLeagueById(gameResult.leagueId, function(err, leagueResult){
        if(err == null) {
          var maxNumOfPlayersPerTeam = leagueResult.numOfPlayersPerTeam;
          var frequency = leagueResult.frequency;
          if(frequency == 0) {
            // Handle games with weekly frequency
            createNextGame(gameResult);
          }
          var builtGame = buildGame(maxNumOfPlayersPerTeam, gameResult);
          updateGame(gameResult._id, builtGame, callback);
        }
      });
    }
  });
}

// Updates game fields
function updateGame(gameId, builtGame, callback) {
  Game.updateGame(gameId, builtGame, callback);
}

function buildGame(maxNumOfPlayersPerTeam, gameObj){
  // start game
  logger.audit('buildGame', 'game : ' + gameObj._id + ' is starting with ' + gameObj.users.length + ' players, building game..');
  var returnedGame = gameBuilder.buildGame(gameObj, maxNumOfPlayersPerTeam);
};


module.exports.getGameById = getGameById;
