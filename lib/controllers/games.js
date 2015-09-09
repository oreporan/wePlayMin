//Controller for games
var logger = require('../framework/logger').init('games');
var Game = require('../models/Game');
var leagues = require('./leagues');


module.exports.addGame = function(leagueId, numOfPlayersPerTeam, matchDay, clientId, callback) {
  // Use the league controller to push this game in to the league
  leagues.getLeagueById(leagueId, function(err, result){
  if(err != null || result == null) {
    // No league found
    callback(err, null);
  } else if (result.admin != clientId) {
    // League was found, check if the creator is the admin, only admins can create games
    callback('only admins can create games', null);
  } else {
    Game.addGame(leagueId, numOfPlayersPerTeam, matchDay, clientId, function(er , game) {
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
