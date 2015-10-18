//Controller for games
var logger = require('../utils/logger').init('games');
var wpDate = require('../framework/wpDate');
var matches = require('../models/main/matches');
var gameBuilder = require('../models/main/gameBuilder');
var Game = require('../models/main/Schemas/Game');
var leagues = require('./leagues');
var users = require('./users');
var Constants = require('../utils/Constants');

var async = require('async');


function addGame(leagueObj, matchDay, clientId, callback) {
  logger.audit('addGame' , 'creating a game in league - '+ leagueObj._id +', to be played at:' + matchDay);
  var gameUsers = generateGameUsers(leagueObj.users);
  Game.addGame(leagueObj._id, matchDay, clientId, gameUsers, leagueObj.numOfPlayersPerTeam, leagueObj.makeTeamsAtNum, function(err, game){
    if(err){
      if(callback) return callback(er, null);
    } else {
      async.parallel({
        league : function(callback) {
          leagues.addGameToLeague(leagueObj._id, game.id, callback);
        },
        game : function(callback) {
          if(clientId) {
            updateGameAttendingStatus(leagueObj._id, game.id, clientId, Constants.GAME_ATTENDING_YES.status, callback);
          } else {
            callback(null,null);
          }
        },
        match : function(callback){
          matches.createMatch(game.id, game.matchDay, callback);
        }
      }, function(err, result){
          if(err != null) {
            if(callback ) callback('error creating new game, reason : ' + err, null);
          } else {
            if(callback) return callback(null, result.game);
          }
      });
    }
  });
}

/* Closes the game explicitily  */
module.exports.changeGameStatus = function(leagueId, gameId, clientId, shouldCloseGame, callback) {
  leagues.getLeagueById(leagueId, function(err, leagueResult){
    if(err != null || leagueResult == null) {
      // No league found
      callback(err, null);
    } else if (leagueResult.admins.indexOf(clientId) < 0) {
      logger.error('changeGameStatus', ' a non admin has attempted to change the game status');
      // League was found, check if the creator is the admin, only admins can create games
      return callback('only admins can change the game status', null);
    } else {
      if(shouldCloseGame) {
        Game.closeGame(gameId, callback);
      } else {
        Game.openGame(gameId, callback);
      }
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
    addGame(result, matchDay, clientId, callback);
    }
  });
};

module.exports.buildGame = function(gameId, clientId, leagueId, callback) {
  leagues.getLeagueById(leagueId, function(err, result){
  if(err != null || result == null) {
    // No league found
    callback(err, null);
  } else if (result.admins.indexOf(clientId) < 0) {
    // League was found, check if the creator is the admin, only admins can create games
    return callback('only admins can create games', null);
  } else {
    getGameById(gameId, function(err, gameResult){
      if(err) {
        return callback(err, null);
      } else {
        var builtGame = gameBuilder.buildGame(gameResult);
        var params = {teamA: builtGame.teamA, teamB: builtGame.teamB, invites: builtGame.invites};
        updateGame(gameResult._id, params, callback);
      }
    });
    }
  });
}

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


var updateGameAttendingStatus = module.exports.updateGameAttendingStatus = function(leagueId, gameId, clientId, attending, callback) {
  async.parallel({
    game : function(callback) {
      Game.updateGameAttendingStatus(gameId, clientId, attending, function(err, gameResult) {
        callback(err, gameResult);
      });
    },
    user : function(callback) {
      if(clientId && attending == 1) {
        users.updateActiveGames(clientId, gameId, true, callback);
      } else {
        callback(null,null);
      }
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


// var addUserToGame = module.exports.addUserToGame = function(leagueId, gameId, clientId, callback) {
//   async.parallel({
//     game : function(callback) {
//       var gameUser = generateGameUsers([clientId], Constants.ATTENDING_YES);
//       Game.addUserToGame(gameId, gameUser, function(err, gameResult) {
//         callback(err, gameResult);
//       })
//     },
//     user : function(callback) {
//       users.updateActiveGames(clientId, gameId, true, callback);
//     }
//   }, function(err, result) {
//     if(err) {
//     return  callback(err, null);
//     } else {
//       // Close the game if the number of players has reached max
//       if(result.game == null) {
//         return callback('game closed', null);
//       }
//       updateGameStatus(result.game);
//     return  callback(null, result.game); // Return the game
//     }
//   });
// };

// var removeUserFromGame = module.exports.removeUserFromGame = function(leagueId, gameId, clientId, callback) {
//   async.parallel({
//     user : function(callback) {
//       users.updateActiveGames(clientId, gameId, false , callback);
//     },
//     game : function(callback) {
//       Game.removeUserFromGame(gameId, clientId, callback);
//     }
//   }, function(err, result){
//     // End of all callbacks
//     if(err != null) {
//       return callback(err, null);
//     } else {
//       return callback(null, result.game);
//     }
//   });
// };

// This closes the game if players == max
function updateGameStatus(gameObj) {
  var numOfPlayers = gameBuilder.sumAttendingPlayers(gameObj.users);
      if(gameObj.makeTeamsAtNum == numOfPlayers) {
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
    }
  });
  // Get the league associated with this game - we need this to know if a game is reoccuring
  leagues.getLeagueById(gameResult.leagueId, function(err, leagueResult){
    if(err == null) {
      var frequency = leagueResult.frequency;
      if(frequency == 0) {
        // Handle games with weekly frequency
        createNextGame(gameResult);
      }
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

// Helper methods
function generateGameUsers(leagueUserObjectsArray, attending) {
  var result = [];
  var attending = attending ? attending : Constants.GAME_ATTENDING_UNDECIDED.status;
  for(var i = 0 ; i < leagueUserObjectsArray.length ; i++) {
    leagueUserObjectsArray[i].attending = attending;
    leagueUserObjectsArray[i].date = Date();
    result.push(leagueUserObjectsArray[i]);
  }
  return result;
}

module.exports.updateGame = updateGame;
module.exports.getGameById = getGameById;
