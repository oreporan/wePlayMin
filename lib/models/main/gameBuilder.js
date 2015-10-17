// This file builds games...
var logger = require('../../utils/logger').init('gameBuilder');

var sumAttendingPlayers = module.exports.sumAttendingPlayers = function(listOfUsers) {
  var count = 0;
  for (var i = 0; i < listOfUsers.length ; i++) {
    if(listOfUsers[i].attending == 1) {
      count++;
    }
  }
  return count;
}

function listAttendingPlayers(gameUsersList) {
  var usersAttending = [];
  for (var i = 0; i < gameUsersList.length ; i++) {
    if(gameUsersList[i].attending == 1) {
      usersAttending.push(gameUsersList[i]._id);
    }
  }
  return usersAttending;
}


module.exports.buildGame = function(gameObj) {
  logger.audit('buildGame', 'building game : ' + gameObj._id + ' with ' + sumAttendingPlayers(gameObj.users) + ' available players');
  var players = listAttendingPlayers(gameObj.users);
  var maxNumOfPlayersPerTeam = gameObj.numOfPlayersPerTeam;
  var teamA = [];
  var teamB = [];
  var invites = [];

  for(var i = 0 ; i < players.length ; i++) {
    if(teamA.length == maxNumOfPlayersPerTeam || teamA.length >= players.length / 2) {
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
