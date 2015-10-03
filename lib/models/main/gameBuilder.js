// This file builds games...
var logger = require('../../framework/logger').init('gameBuilder');


module.exports.buildGame = function(gameObj, maxNumOfPlayersPerTeam) {
  logger.audit('buildGame', 'building game : ' + gameObj._id + ' with ' + gameObj.users.length + ' available players');
  var players = gameObj.users;
  var teamA = [];
  var teamB = [];
  var invites = [];

  for(var i = 0 ; i < players.length ; i++) {
    if(teamA.length == maxNumOfPlayersPerTeam) {
      if(teamB.length == maxNumOfPlayersPerTeam) {
        invites.push(players[i]);
      } else {
        teamB.push(players[i]);
      }
    } else {
      teamA.push(players[i]);
    }
  }
  // set the new teams
  gameObj.teamA = teamA;
  gameObj.teamB = teamB;
  gameObj.invites = invites;
  return gameObj;
}
